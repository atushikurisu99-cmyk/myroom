// collector-version: playguide-first-2ofN
import { readFile, writeFile, mkdir } from "node:fs/promises";

const SOURCES = [
  // ライブ系はプレイガイドを入口にする。会場・主催者は裏取り側。
  { id:"eplus-green", type:"playguide", role:"discovery", category:"live", venue:"広島グリーンアリーナ", url:"https://eplus.jp/sf/venue/7300060/events" },
  { id:"eplus-sunplaza", type:"playguide", role:"discovery", category:"live", venue:"広島サンプラザホール", url:"https://eplus.jp/sf/venue/7330010/events" },
  { id:"eplus-jms", type:"playguide", role:"discovery", category:"live", venue:"JMSアステールプラザ", url:"https://eplus.jp/sf/venue/7300010/events" },
  { id:"eplus-hbg", type:"playguide", role:"discovery", category:"live", venue:"広島文化学園HBGホール", url:"https://eplus.jp/sf/venue/7300050/events" },
  { id:"eplus-quattro", type:"playguide", role:"discovery", category:"live", venue:"広島クラブクアトロ", url:"https://eplus.jp/sf/venue/7300090/events" },
  { id:"eplus-ueno", type:"playguide", role:"discovery", category:"live", venue:"上野学園ホール", url:"https://eplus.jp/sf/venue/7300130/events" },

  // 上野学園ホールはセブンチケットも取得元として使えるため、同格の発見元にする。
  { id:"seven-ueno", type:"playguide", role:"discovery", category:"live", venue:"上野学園ホール", url:"https://7ticket.jp/s/116553/d" },

  // 主催者・別プレイガイド・会場は裏取り候補。
  { id:"candy", type:"promoter", role:"verify", category:"live", url:"https://www.candy-p.com/schedule/" },
  { id:"lawson-green", type:"playguide", role:"discovery", category:"live", venue:"広島グリーンアリーナ", url:"https://l-tike.com/search/?keyword=%E5%BA%83%E5%B3%B6%E3%82%B0%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%A2%E3%83%AA%E3%83%BC%E3%83%8A" },
  { id:"lawson-sunplaza", type:"playguide", role:"discovery", category:"live", venue:"広島サンプラザホール", url:"https://l-tike.com/search/?keyword=%E5%BA%83%E5%B3%B6%E3%82%B5%E3%83%B3%E3%83%97%E3%83%A9%E3%82%B6" },
  { id:"lawson-jms", type:"playguide", role:"discovery", category:"live", venue:"JMSアステールプラザ", url:"https://l-tike.com/search/?keyword=JMS%E3%82%A2%E3%82%B9%E3%83%86%E3%83%BC%E3%83%AB%E3%83%97%E3%83%A9%E3%82%B6" },
  { id:"lawson-hbg", type:"playguide", role:"discovery", category:"live", venue:"広島文化学園HBGホール", url:"https://l-tike.com/search/?keyword=%E5%BA%83%E5%B3%B6%E6%96%87%E5%8C%96%E5%AD%A6%E5%9C%92HBG%E3%83%9B%E3%83%BC%E3%83%AB" },
  { id:"lawson-quattro", type:"playguide", role:"discovery", category:"live", venue:"広島クラブクアトロ", url:"https://l-tike.com/search/?keyword=%E5%BA%83%E5%B3%B6%E3%82%AF%E3%83%A9%E3%83%96%E3%82%AF%E3%82%A2%E3%83%88%E3%83%AD" },
  { id:"lawson-ueno", type:"playguide", role:"discovery", category:"live", venue:"上野学園ホール", url:"https://l-tike.com/search/?keyword=%E4%B8%8A%E9%87%8E%E5%AD%A6%E5%9C%92" },
  { id:"venue-ueno", type:"venue", role:"verify", category:"live", venue:"上野学園ホール", url:"https://www.rcchall.jp/" },

  // スポーツはチケット情報より試合公式情報の方が強いので従来通り公式を入口にする。
  { id:"dragonflies", type:"team", role:"discovery", category:"sport", url:"https://hiroshimadragonflies.com/schedule/list/" },
  { id:"sanfrecce", type:"team", role:"discovery", category:"sport", url:"https://www.sanfrecce.co.jp/matches/results" },
];

const VENUE_ALIASES = [
  ["広島グリーンアリーナ",["広島グリーンアリーナ","広島県立総合体育館"]],
  ["広島サンプラザホール",["広島サンプラザホール","広島サンプラザ"]],
  ["JMSアステールプラザ",["広島JMSアステールプラザ","JMSアステールプラザ","アステールプラザ"]],
  ["広島文化学園HBGホール",["広島文化学園HBGホール","広島市文化交流会館"]],
  ["上野学園ホール",["上野学園ホール","広島上野学園ホール","広島県立文化芸術ホール"]],
  ["広島クラブクアトロ",["広島クラブクアトロ","クラブクアトロ"]],
  ["広島セカンド・クラッチ",["広島セカンド・クラッチ","SECOND CRUTCH","セカンド・クラッチ"]],
  ["広島Live space Reed",["広島Live space Reed","Live space Reed"]],
  ["広島4.14",["広島4.14","4.14"]],
  ["Eピース",["エディオンピースウイング広島","Eピース"]],
];

function clean(s="") {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi," ")
    .replace(/<style[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/g," ")
    .replace(/&amp;/g,"&")
    .replace(/&#x2F;|&#47;/g,"/")
    .replace(/&#8217;|&#039;|&apos;/g,"'")
    .replace(/\s+/g," ")
    .trim();
}

function cleanAll(s="") {
  return s
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/g," ")
    .replace(/&amp;/g,"&")
    .replace(/&#x2F;|&#47;/g,"/")
    .replace(/&#8217;|&#039;|&apos;/g,"'")
    .replace(/\\u([0-9a-fA-F]{4})/g,(_,h)=>String.fromCharCode(parseInt(h,16)))
    .replace(/\\n|\\r|\\t/g," ")
    .replace(/\\\"/g,'"')
    .replace(/\s+/g," ")
    .trim();
}

function pad(v){ return String(v).padStart(2,"0"); }
function isoDate(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }

function sleep(ms){ return new Promise(resolve=>setTimeout(resolve,ms)); }

async function fetchText(url) {
  let lastStatus=0;
  for (let attempt=0; attempt<3; attempt++) {
    if (attempt>0) await sleep(1800*attempt);
    const res = await fetch(url,{
      headers:{
        "user-agent":"Mozilla/5.0 (compatible; TaxiSalesNavigator/0.2)",
        "accept-language":"ja-JP,ja;q=0.9,en;q=0.6"
      }
    });
    lastStatus=res.status;
    if (res.ok) return await res.text();
    if (![429,500,502,503,504].includes(res.status)) throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`${lastStatus} ${url}`);
}

function canonicalVenue(v="") {
  for (const [canonical,aliases] of VENUE_ALIASES) {
    if (aliases.some(x => v.includes(x))) return canonical;
  }
  return v.trim();
}

function pickVenue(text) {
  for (const [canonical,aliases] of VENUE_ALIASES) {
    if (aliases.some(x => text.includes(x))) return canonical;
  }
  return "";
}

function normalizeTitle(s="") {
  return s.normalize("NFKC")
    .replace(/劇団四季|ミュージカル|広島公演|一般発売|先着|抽選|受付中|受付終了|受付前|予定枚数終了|SOLD OUT/gi,"")
    .replace(/[「」『』【】［］（）()！!・･★☆~〜～\s]/g,"")
    .toLowerCase();
}

function titleMatches(a,b) {
  const x=normalizeTitle(a), y=normalizeTitle(b);
  if (!x || !y) return false;
  if (x===y) return true;
  if (x.length>=5 && y.length>=5 && (x.includes(y) || y.includes(x))) return true;
  return false;
}

function sameEvent(a,b) {
  return a.date===b.date &&
    canonicalVenue(a.venue)===canonicalVenue(b.venue) &&
    titleMatches(a.title,b.title);
}

function makeId(e) {
  const stem=Buffer.from(normalizeTitle(e.title)||e.title).toString("hex").slice(0,16);
  return `${e.category}-${e.date.replaceAll("-","")}-${(e.start||"0000").replace(":","")}-${stem}`;
}

function parseEplusVenue(html, source) {
  const out=[];
  const texts=[clean(html),cleanAll(html)];
  const seenText=new Set();
  for (const text of texts) {
    if (!text || seenText.has(text)) continue;
    seenText.add(text);
    const re=/(20\d{2})\/(\d{1,2})\/(\d{1,2})[\s\S]{0,48}?(?:先着|抽選)?\s*([\s\S]{1,180}?)\s*(?:開演|開始)[^0-9]{0,10}(\d{1,2}:\d{2})/g;
    let m;
    while ((m=re.exec(text))) {
    let title=m[4]
      .replace(/(?:受付中|受付終了|受付前|予定枚数終了).*$/,"")
      .replace(/^\s*(?:先着|抽選)\s*/,"")
      .trim();
    if (!title || /公演一覧|会場情報/.test(title)) continue;
    title=title.slice(0,100);
    const e={
      category:"live", date:isoDate(m[1],m[2],m[3]), start:m[5], endEstimate:null,
      title, venue:canonicalVenue(source.venue), area:"広島市",
      sourceIds:[source.id], sourceUrl:source.url, sourceTypes:["playguide"], confidence:"candidate"
    };
    e.id=makeId(e);
    out.push(e);
    }
  }
  const unique=new Map();
  for (const e of out) unique.set(normalizeKey(e),e);
  return [...unique.values()];
}


function parseLawsonVenue(html, source) {
  const text=cleanAll(html).normalize("NFKC");
  const out=[];
  const re=/(?:コンサート|演劇・ステージ・舞台|クラシック|イベント|スポーツ)\s+([\s\S]{1,140}?)\s+公演日：\s*(20\d{2})\/(\d{1,2})\/(\d{1,2})[^\s]*[\s\S]{0,160}?会場：\s*([\s\S]{1,120}?)(?:\(広島県\)|（広島県）)/g;
  let m;
  while ((m=re.exec(text))) {
    const title=m[1].trim().replace(/\s+/g," ").slice(0,120);
    const venue=canonicalVenue(m[5].trim());
    if (!title || venue!==canonicalVenue(source.venue)) continue;
    const e={
      category:"live", date:isoDate(m[2],m[3],m[4]), start:null, endEstimate:null,
      title, venue, area:"広島市",
      sourceIds:[source.id], sourceUrl:source.url, sourceTypes:["playguide"], confidence:"candidate"
    };
    e.id=makeId(e);
    out.push(e);
  }
  const unique=new Map();
  for (const e of out) unique.set([e.date,e.venue,normalizeTitle(e.title)].join("|"),e);
  return [...unique.values()];
}

function extractStartFromEvidence(text,e) {
  if (!text || e.start) return e.start||null;
  const t=cleanAll(text).normalize("NFKC");
  const title=e.title.normalize("NFKC").replace(/\s+/g," ").trim();
  let pos=t.indexOf(title);
  if (pos<0) {
    const short=title.split(/\s{2,}| TOUR | LIVE | 20\d{2}/i)[0].trim();
    if (short.length>=4) pos=t.indexOf(short);
  }
  if (pos<0) return null;
  const around=t.slice(Math.max(0,pos-220),Math.min(t.length,pos+520));
  const [y,m,d]=e.date.split("-").map(Number);
  const dateHit=[
    `${y}/${m}/${d}`,`${y}/${pad(m)}/${pad(d)}`,
    `${m}/${d}`,`${pad(m)}/${pad(d)}`
  ].some(x=>around.includes(x));
  if (!dateHit) return null;
  const tm=around.match(/(?:開演|開始)[^0-9]{0,12}(\d{1,2}:\d{2})/);
  return tm ? tm[1] : null;
}

function parseSevenUeno(html, year, source) {
  const text=clean(html);
  if (!text.includes("上野学園ホール") || !text.includes("マンマ")) return [];
  const from=text.indexOf("公演日・開演時間");
  if (from < 0) return [];
  const schedule=text.slice(from);
  const found=[...schedule.matchAll(/(\d{1,2})\/(\d{1,2})/g)];
  const out=[];
  for (let i=0;i<found.length;i++) {
    const m=found[i];
    const next=i+1<found.length ? found[i+1].index : schedule.length;
    const segment=schedule.slice(m.index+m[0].length,next);
    const times=[...segment.matchAll(/(\d{1,2}:\d{2})/g)].map(x=>x[1]);
    for (const start of [...new Set(times)]) {
      const e={
        category:"live", date:isoDate(year,m[1],m[2]), start, endEstimate:null,
        title:"マンマ・ミーア！", venue:"上野学園ホール", area:"広島市",
        sourceIds:[source.id], sourceUrl:source.url, sourceTypes:["playguide"], confidence:"candidate"
      };
      e.id=makeId(e);
      out.push(e);
    }
  }
  return out;
}

function parseDragonflies(html, year, source) {
  const text=clean(html);
  const out=[];
  const re=/(HOME|AWAY)[\s\S]{0,100}?(\d{1,2})\/(\d{1,2})[^0-9]{0,12}(\d{1,2}:\d{2})[\s\S]{0,120}?(広島グリーンアリーナ|広島サンプラザホール|エフピコアリーナふくやま)/g;
  let m;
  while ((m=re.exec(text))) {
    if (m[1]!=="HOME") continue;
    const around=text.slice(m.index,Math.min(text.length,re.lastIndex+100));
    const opponent=(around.match(/(?:広島\s*){1,2}([^ ]{1,12})/)||[])[1]||"対戦";
    const e={
      category:"sport", sport:"basketball", date:isoDate(year,m[2],m[3]), start:m[4], endEstimate:null,
      title:`広島×${opponent}`, venue:canonicalVenue(m[5]), area:m[5].includes("ふくやま")?"福山市":"広島市",
      sourceIds:[source.id], sourceUrl:source.url, sourceTypes:["team"], confidence:"official"
    };
    e.id=makeId(e);
    out.push(e);
  }
  return out;
}

function parseSanfrecce(html, year, source) {
  const text=clean(html);
  const out=[];
  const re=/HOME\s+エディオンピースウイング広島[\s\S]{0,120}?(\d{1,2})\.(\d{1,2})[^0-9]{0,8}(\d{1,2}:\d{2})/g;
  let m;
  while ((m=re.exec(text))) {
    const around=text.slice(m.index,Math.min(text.length,re.lastIndex+160));
    const opponent=(around.match(/Image\s*([^ ]{1,16})/)||[])[1]||"対戦";
    const e={
      category:"sport", sport:"soccer", date:isoDate(year,m[1],m[2]), start:m[3], endEstimate:null,
      title:`広島×${opponent}`, venue:"Eピース", area:"広島市",
      sourceIds:[source.id], sourceUrl:source.url, sourceTypes:["team"], confidence:"official"
    };
    e.id=makeId(e);
    out.push(e);
  }
  return out;
}

function sourceConfirmsEvent(text,e,source) {
  if (!text) return false;
  if (source.venue && canonicalVenue(source.venue)!==canonicalVenue(e.venue)) return false;

  const normalizedText=normalizeTitle(text);
  const title=normalizeTitle(e.title);
  const titleHit=title.length>=5 && normalizedText.includes(title);
  if (!titleHit) return false;

  const [y,m,d]=e.date.split("-").map(Number);
  const dateForms=[
    `${y}/${m}/${d}`, `${y}/${pad(m)}/${pad(d)}`,
    `${m}/${d}`, `${pad(m)}/${pad(d)}`,
    `${m}月${d}日`
  ];
  const dateHit=dateForms.some(x=>text.includes(x));
  if (!dateHit) return false;

  if (source.venue) return true;
  const venueAliases=VENUE_ALIASES.find(([v])=>v===canonicalVenue(e.venue))?.[1]||[e.venue];
  return venueAliases.some(v=>text.includes(v));
}

function mergeAndVerify(discovered, evidenceTexts) {
  const groups=[];
  for (const e of discovered) {
    let g=groups.find(x=>sameEvent(x.base,e) && (!x.base.start || !e.start || x.base.start===e.start));
    if (!g) {
      g={base:{...e,venue:canonicalVenue(e.venue)},members:[]};
      groups.push(g);
    }
    g.members.push(e);
  }

  return groups.map(g=>{
    const sourceIds=[...new Set(g.members.flatMap(x=>x.sourceIds||[]))];
    const sourceTypes=[...new Set(g.members.flatMap(x=>x.sourceTypes||[]))];

    for (const [sourceId,payload] of evidenceTexts) {
      if (sourceIds.includes(sourceId)) continue;
      if (sourceConfirmsEvent(payload.text,g.base,payload.source)) {
        sourceIds.push(sourceId);
        sourceTypes.push(payload.source.type);
        if (!g.base.start) {
          const start=extractStartFromEvidence(payload.text,g.base);
          if (start) g.base.start=start;
        }
      }
    }

    const distinctSources=new Set(sourceIds).size;
    const confidence=g.base.category==="sport" && sourceTypes.includes("team")
      ? "official"
      : distinctSources>=2 ? "confirmed" : "candidate";

    return {
      ...g.base,
      sourceIds,
      sourceTypes:[...new Set(sourceTypes)],
      confidence,
      verifiedBy:distinctSources
    };
  });
}

function normalizeKey(e) {
  return [e.date,e.start||"",canonicalVenue(e.venue),normalizeTitle(e.title)].join("|");
}

function dedupe(events) {
  const map=new Map();
  for (const e of events) {
    const key=normalizeKey(e);
    const prev=map.get(key);
    if (!prev) map.set(key,e);
    else {
      const sourceIds=[...new Set([...(prev.sourceIds||[]),...(e.sourceIds||[])])];
      const sourceTypes=[...new Set([...(prev.sourceTypes||[]),...(e.sourceTypes||[])])];
      const verifiedBy=sourceIds.length;
      const confidence=(e.category==="sport" && sourceTypes.includes("team"))
        ? "official"
        : verifiedBy>=2 ? "confirmed" : "candidate";
      map.set(key,{...prev,...e,sourceIds,sourceTypes,verifiedBy,confidence});
    }
  }
  return [...map.values()].sort((a,b)=>`${a.date}T${a.start||"00:00"}`.localeCompare(`${b.date}T${b.start||"00:00"}`));
}

function endEstimate(e) {
  if (e.endEstimate || !e.start) return e;
  const mins=normalizeTitle(e.title).includes("マンマミーア") ? 155 :
    e.sport==="soccer" ? 120 : e.sport==="basketball" ? 145 : 140;
  const [h,m]=e.start.split(":").map(Number);
  const total=h*60+m+mins;
  return {...e,endEstimate:`${pad(Math.floor(total/60)%24)}:${pad(total%60)}`};
}

async function main() {
  const now=new Date();
  const year=now.getUTCFullYear();
  const discovered=[];
  const evidenceTexts=new Map();
  const errors=[];

  let previousType="";
  for (const s of SOURCES) {
    try {
      if (s.type==="playguide" && previousType==="playguide") await sleep(900);
      const html=await fetchText(s.url);
      const text=clean(html);
      evidenceTexts.set(s.id,{text,source:s});

      if (s.role!=="discovery") continue;
      if (s.id.startsWith("eplus-")) discovered.push(...parseEplusVenue(html,s));
      else if (s.id.startsWith("lawson-")) {
        const parsed=parseLawsonVenue(html,s);
        console.log("lawson source",s.id,"html",html.length,"visible",clean(html).length,"all",cleanAll(html).length,"parsed",parsed.length,
          "markers",html.includes("公演日"),html.includes("会場"),html.includes("ＳＨＥ"),html.includes("PERSONZ"));
        if (s.id==="lawson-quattro" || s.id==="lawson-jms") {
          const t=cleanAll(html).normalize("NFKC");
          const p=Math.max(0,t.indexOf(s.id==="lawson-quattro" ? "SHE" : "PERSONZ"));
          console.log("lawson snippet",s.id,t.slice(Math.max(0,p-120),p+520));
        }
        discovered.push(...parsed);
      }
      else if (s.id==="seven-ueno") discovered.push(...parseSevenUeno(html,year,s));
      else if (s.id==="dragonflies") discovered.push(...parseDragonflies(html,year,s));
      else if (s.id==="sanfrecce") discovered.push(...parseSanfrecce(html,year,s));
    } catch (err) {
      errors.push({source:s.id,error:String(err.message||err)});
    }
    previousType=s.type;
  }

  const fresh=mergeAndVerify(discovered,evidenceTexts);
  const horizon=new Date(now.getTime()+62*86400000);

  // 片方のプレイガイドが落ちても、別ソースで取れた新データだけで組み直す。
  // 旧方式の会場ベース/壊れた解析結果を復活させない。
  const keep=[...fresh]
    .filter(e=>{
      const d=new Date(`${e.date}T23:59:59+09:00`);
      return d>=new Date(now.getTime()-86400000) && d<=horizon && e.area==="広島市";
    })
    .map(endEstimate);

  const events=dedupe(keep);
  const stats={
    discovered:fresh.length,
    confirmed:fresh.filter(e=>e.confidence==="confirmed").length,
    candidate:fresh.filter(e=>e.confidence==="candidate").length,
    official:fresh.filter(e=>e.confidence==="official").length,
    playguideBased:fresh.filter(e=>(e.sourceTypes||[]).includes("playguide")).length
  };

  await mkdir("data",{recursive:true});
  await writeFile("data/events.json",JSON.stringify({
    generatedAt:new Date().toISOString(),
    area:"hiroshima",
    strategy:"playguide-first; verify with any independent second source including venue/promoter/another playguide",
    sources:SOURCES.map(({id,type,role,url,venue})=>({id,type,role,url,venue})),
    stats,errors,events
  },null,2)+"\n");

  console.log("event stats:",JSON.stringify(stats));
  console.log(`events: ${events.length}, errors: ${errors.length}`);
}

main().catch(err=>{ console.error(err); process.exit(1); });

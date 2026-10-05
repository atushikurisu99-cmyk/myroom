import { readFile, writeFile, mkdir } from "node:fs/promises";

const SOURCES = [
  { id: "candy", category: "live", url: "https://www.candy-p.com/schedule/" },
  { id: "dragonflies", category: "sport", url: "https://hiroshimadragonflies.com/schedule/list/" },
  { id: "sanfrecce", category: "sport", url: "https://www.sanfrecce.co.jp/matches/results" },
];

const HIROSHIMA_VENUES = [
  "広島グリーンアリーナ","広島サンプラザ","JMSアステールプラザ","アステールプラザ",
  "広島文化学園HBGホール","広島国際会議場","エディオンピースウイング広島","Eピース",
  "広島クラブクアトロ","広島セカンド・クラッチ","広島Live space Reed","広島4.14"
];

function clean(s="") {
  return s
    .replace(/<script[\\s\\S]*?<\\/script>/gi," ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/g," ")
    .replace(/&amp;/g,"&")
    .replace(/&#x2F;|&#47;/g,"/")
    .replace(/\\s+/g," ")
    .trim();
}

function pad(v){ return String(v).padStart(2,"0"); }
function isoDate(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }

async function fetchText(url) {
  const res = await fetch(url,{headers:{"user-agent":"TaxiSalesNavigator/0.1 (+event collector)"}});
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

function pickVenue(text) {
  return HIROSHIMA_VENUES.find(v => text.includes(v)) || "";
}

function parseCandy(html, year) {
  const text = clean(html);
  const out = [];
  const re = /(20\\d{2})\\/(\\d{1,2})\\/(\\d{1,2})[^0-9]{0,8}([^0-9]{0,80}?)(\\d{1,2}:\\d{2})\\/(\\d{1,2}:\\d{2})/g;
  let m;
  while ((m = re.exec(text))) {
    const around = text.slice(Math.max(0,m.index-90), Math.min(text.length,re.lastIndex+100));
    const venue = pickVenue(around);
    if (!venue) continue;
    const titleChunk = text.slice(Math.max(0,m.index-120),m.index).trim();
    const title = titleChunk.split(/20\\d{2}\\/\\d{1,2}\\/\\d{1,2}/).pop().slice(-40).trim() || "ライブ";
    out.push({
      id:`live-${m[1]}${pad(m[2])}${pad(m[3])}-${Buffer.from(title).toString("hex").slice(0,12)}`,
      category:"live", date:isoDate(m[1],m[2],m[3]), start:m[6], endEstimate:null,
      title, venue, area:"広島市", sourceIds:["candy"], sourceUrl:SOURCES[0].url, confidence:"source"
    });
  }
  return out;
}

function parseDragonflies(html, year) {
  const text = clean(html);
  const out = [];
  const re = /(HOME|AWAY)[\\s\\S]{0,100}?(\\d{1,2})\\/(\\d{1,2})[^0-9]{0,12}(\\d{1,2}:\\d{2})[\\s\\S]{0,120}?(広島グリーンアリーナ|広島サンプラザホール|エフピコアリーナふくやま)/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1] !== "HOME") continue;
    const around = text.slice(m.index, Math.min(text.length,re.lastIndex+100));
    const opponent = (around.match(/(?:広島\\s*){1,2}([^ ]{1,12})/)||[])[1] || "対戦";
    out.push({
      id:`sport-${year}${pad(m[2])}${pad(m[3])}-dragonflies`,
      category:"sport", sport:"basketball", date:isoDate(year,m[2],m[3]), start:m[4], endEstimate:null,
      title:`広島×${opponent}`, venue:m[5], area:m[5].includes("ふくやま")?"福山市":"広島市",
      sourceIds:["dragonflies"], sourceUrl:SOURCES[1].url, confidence:"official"
    });
  }
  return out;
}

function parseSanfrecce(html, year) {
  const text = clean(html);
  const out = [];
  const re = /HOME\\s+エディオンピースウイング広島[\\s\\S]{0,120}?(\\d{1,2})\\.(\\d{1,2})[^0-9]{0,8}(\\d{1,2}:\\d{2})/g;
  let m;
  while ((m = re.exec(text))) {
    const around = text.slice(m.index, Math.min(text.length,re.lastIndex+160));
    const opponent = (around.match(/Image\\s*([^ ]{1,16})/)||[])[1] || "対戦";
    out.push({
      id:`sport-${year}${pad(m[1])}${pad(m[2])}-sanfrecce`,
      category:"sport", sport:"soccer", date:isoDate(year,m[1],m[2]), start:m[3], endEstimate:null,
      title:`広島×${opponent}`, venue:"Eピース", area:"広島市",
      sourceIds:["sanfrecce"], sourceUrl:SOURCES[2].url, confidence:"official"
    });
  }
  return out;
}

function normalizeKey(e) {
  return [e.date,e.venue,e.title].join("|").replace(/\\s/g,"").toLowerCase();
}

function mergeEvents(events) {
  const map = new Map();
  for (const e of events) {
    const key = normalizeKey(e);
    const prev = map.get(key);
    if (!prev) map.set(key,e);
    else map.set(key,{...prev,...e,sourceIds:[...new Set([...(prev.sourceIds||[]),...(e.sourceIds||[])])]});
  }
  return [...map.values()].sort((a,b)=>`${a.date}T${a.start||"00:00"}`.localeCompare(`${b.date}T${b.start||"00:00"}`));
}

function endEstimate(e) {
  if (e.endEstimate) return e;
  const mins = e.sport==="soccer" ? 120 : e.sport==="basketball" ? 145 : 140;
  const [h,m] = (e.start||"18:00").split(":").map(Number);
  const total = h*60+m+mins;
  return {...e,endEstimate:`${pad(Math.floor(total/60)%24)}:${pad(total%60)}`};
}

async function main() {
  const now = new Date();
  const year = now.getUTCFullYear();
  let existing={events:[]};
  try { existing=JSON.parse(await readFile("data/events.json","utf8")); } catch {}
  const fetched=[];
  const errors=[];
  for (const s of SOURCES) {
    try {
      const html=await fetchText(s.url);
      if (s.id==="candy") fetched.push(...parseCandy(html,year));
      if (s.id==="dragonflies") fetched.push(...parseDragonflies(html,year));
      if (s.id==="sanfrecce") fetched.push(...parseSanfrecce(html,year));
    } catch (err) { errors.push({source:s.id,error:String(err.message||err)}); }
  }
  const horizon = new Date(now.getTime()+62*86400000);
  const keep = [...existing.events,...fetched]
    .filter(e => {
      const d=new Date(`${e.date}T23:59:59+09:00`);
      return d >= new Date(now.getTime()-86400000) && d <= horizon && e.area==="広島市";
    })
    .map(endEstimate);
  const events=mergeEvents(keep);
  await mkdir("data",{recursive:true});
  await writeFile("data/events.json",JSON.stringify({
    generatedAt:new Date().toISOString(), area:"hiroshima",
    sources:SOURCES.map(({id,url})=>({id,url})), errors, events
  },null,2)+"\\n");
  console.log(`events: ${events.length}, errors: ${errors.length}`);
}
main().catch(err=>{ console.error(err); process.exit(1); });

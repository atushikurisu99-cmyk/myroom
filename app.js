let state = "idle"; // idle / waiting / riding
let amount = 0;
let people = 1;
let cardMode = 0;

/* =====================
 初期化
===================== */
window.onload = () => {
  bindEvents();
  renderAll();
};

/* =====================
 イベント登録
===================== */
function bindEvents(){

  // メインボタン
  document.getElementById("mainBtn").onclick = mainAction;

  // 状態カード
  document.getElementById("stateCard").onclick = toggleCard;

  // その他
  document.getElementById("otherBtn").onclick = openOther;

  document.getElementById("closeOther").onclick = closeOther;
  document.getElementById("openHistory").onclick = openHistory;
  document.getElementById("closeHistory").onclick = closeHistory;

  // 金額
  document.getElementById("closeFare").onclick = closeFare;

  const addBtns = document.querySelectorAll(".btn-row .btn");
  addBtns.forEach(btn => {
    btn.onclick = () => handleButton(btn.innerText);
  });

  const payBtns = document.querySelectorAll(".pay-btn");
  payBtns[0].onclick = () => saveRide(1);
  payBtns[1].onclick = () => saveRide(2);
}

/* =====================
 状態遷移
===================== */
function mainAction(){

  if(state === "idle"){
    state = "waiting";
  }
  else if(state === "waiting"){
    state = "riding";
  }
  else if(state === "riding"){
    openFare();
    return;
  }

  renderMainBtn();
}

/* =====================
 金額入力
===================== */
function handleButton(text){

  if(text.includes("+")){
    const num = Number(text.replace("+",""));
    amount += num;
    renderAmount();
    return;
  }

  // 人数
  if(!isNaN(text)){
    people = Number(text);
  }
}

function openFare(){
  document.getElementById("fareSheet").classList.add("active");
}

function closeFare(){
  document.getElementById("fareSheet").classList.remove("active");
  amount = 0;
  renderAmount();
}

function renderAmount(){
  document.getElementById("amount").innerText = amount;
}

/* =====================
 保存
===================== */
function saveRide(type){

  const now = new Date();

  const record = {
    amount,
    type,
    people,
    time: now.toLocaleTimeString(),
    ts: now.getTime()
  };

  addRecord(record);

  closeFare();

  state = "waiting";
  renderAll();
}

/* =====================
 カード切替
===================== */
function toggleCard(){
  cardMode = (cardMode + 1) % 2;
  renderCard();
}

/* =====================
 描画
===================== */
function renderAll(){
  renderMainBtn();
  renderMini();
  renderHistory();
  renderCard();
}

function renderMainBtn(){
  const btn = document.getElementById("mainBtn");

  if(state === "idle") btn.innerText = "乗務開始";
  if(state === "waiting") btn.innerText = "実車";
  if(state === "riding") btn.innerText = "降車";
}

/* =====================
 カード
===================== */
function renderCard(){

  const view = document.getElementById("cardView");

  if(cardMode === 0){
    view.innerHTML = `
      今日のペース<br>
      <strong>${getPace()}</strong>
    `;
  }

  if(cardMode === 1){

    const total = getTotal();
    const a1 = getTypeTotal(1);
    const a2 = getTypeTotal(2);

    view.innerHTML = `
      売上合計<br>
      <span style="font-size:14px;">¥${total}</span>
      <div style="display:flex;justify-content:space-between;font-size:13px;">
        <div>① ¥${a1}</div>
        <div>② ¥${a2}</div>
      </div>
    `;
  }
}

/* =====================
 履歴
===================== */
function renderMini(){

  const h = getHistory();

  if(h.length === 0){
    document.getElementById("miniHistory").innerText = "--";
    return;
  }

  const last = h[0];

  document.getElementById("miniHistory").innerHTML =
    `¥${last.amount}<br>${last.time}`;
}

function renderHistory(){

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  getHistory().forEach(h => {

    const div = document.createElement("div");
    div.className = "history-item";

    div.innerText =
      `${h.type===1?"①":"②"} ¥${h.amount} / ${h.people}人 / ${h.time}`;

    list.appendChild(div);
  });
}

/* =====================
 その他
===================== */
function openOther(){
  document.getElementById("otherSheet").classList.add("active");
}

function closeOther(){
  document.getElementById("otherSheet").classList.remove("active");
}

function openHistory(){
  closeOther();
  document.getElementById("historySheet").classList.add("active");
}

function closeHistory(){
  document.getElementById("historySheet").classList.remove("active");
}

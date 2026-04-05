import React, { useState } from "react";

export default function TopScreen(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full relative">

      {/* ▲ボタン */}
      <div
        className="absolute right-6 bottom-20 text-2xl"
        onClick={() => setOpen(!open)}
      >
        {open ? "▼" : "▲"}
      </div>

      {/* BottomCard */}
      <div
        className={`absolute left-0 right-0 bg-white shadow-lg transition-all duration-300
        ${open ? "bottom-0" : "-bottom-40"}`}
        style={{ height: 220 }}
      >
        <button className="w-full h-full text-lg">
          本日の乗務を終了
        </button>
      </div>

      {/* 下ナビ */}
      <div className="absolute bottom-0 w-full flex justify-around p-4 border-t bg-white">
        <button>ホーム</button>
        <button>経費</button>
        <button onClick={props.openHistoryFull}>メニュー</button>
      </div>
    </div>
  );
}

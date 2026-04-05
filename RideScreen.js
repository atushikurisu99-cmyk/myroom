import React from "react";

export default function RideScreen(props) {
  return (
    <div className="w-full h-full relative">

      <button
        className="w-40 h-40 bg-red-500 text-white text-xl rounded-full mx-auto mt-40"
        onClick={() => props.setScreen("fare")}
      >
        降車
      </button>

      {/* 下ナビ */}
      <div className="absolute bottom-0 w-full flex justify-around p-4 border-t bg-white">
        <button onClick={() => props.setScreen("top")}>ホーム</button>
        <button onClick={props.openHistorySimple}>履歴</button>
        <button onClick={props.openHistoryFull}>メニュー</button>
      </div>
    </div>
  );
}

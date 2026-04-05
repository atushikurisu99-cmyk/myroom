import React from "react";

export default function HistoryModal(props) {
  return (
    <div className="absolute inset-0 bg-white z-50 transition-all duration-300">

      <div className="p-4 flex justify-between border-b">
        <span>履歴一覧</span>
        <button onClick={() => props.setShowHistory(false)}>閉じる</button>
      </div>

      {/* フル or 簡易切替 */}
      {props.historyMode === "full" && (
        <div className="p-2 flex gap-2">
          <button>日</button>
          <button>週</button>
          <button>月</button>
        </div>
      )}

      <div className="p-4">
        <div>履歴データここ</div>
      </div>
    </div>
  );
}

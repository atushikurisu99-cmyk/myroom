// 既存をベースに「BottomCard」「下ナビ」「グラフ入口」だけ改造

// ★変更ポイント
// ・BottomCard＝終了専用
// ・履歴完全削除
// ・グラフ入口追加
// ・下ナビ切替対応

// ===== 追加コンポーネント =====

function BottomCard({ show, onFinish }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "90px",
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      <div className="card p-4">
        <button
          onClick={onFinish}
          className="w-full h-[60px] bg-black text-white rounded-xl text-lg font-bold"
        >
          本日の乗務を終了
        </button>
      </div>
    </div>
  );
}

function GraphEntryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          style={{
            height: "80px",
            background: "#e6e6fa",
            borderRadius: "16px",
          }}
        />
      ))}
    </div>
  );
}

function BottomNav({ isHome, onHome, onCenter, onMenu }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "80px",
        background: "#32cd32",
        display: "flex",
      }}
    >
      <button style={{ flex: 1 }} onClick={onHome}>
        ホーム
      </button>

      <button style={{ flex: 1 }} onClick={onCenter}>
        {isHome ? "経費" : "履歴"}
      </button>

      <button style={{ flex: 1 }} onClick={onMenu}>
        メニュー
      </button>
    </div>
  );
}

window.AppComponents.BottomCard = BottomCard;
window.AppComponents.GraphEntryGrid = GraphEntryGrid;
window.AppComponents.BottomNav = BottomNav;

window.AppComponents = (() => {
  const Utils = window.AppUtils || {};
  const C = window.AppConstants;

  const formatMoney =
    Utils.formatMoney ||
    ((v) => `¥${Number(v || 0).toLocaleString("ja-JP")}`);

  const formatTime =
    Utils.formatTime ||
    ((d) =>
      new Date(d).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }));

  /* =========================
     上部共通カード（黄緑）
  ========================= */
  function HeaderCard({
    timeParts,
    totalAmount,
    recordCount,
    subLabel,
  }) {
    return (
      <div
        style={{
          background: "#32cd32",
          borderRadius: "0 0 28px 28px",
          padding: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 42, fontWeight: "bold", color: "#fff" }}>
            {timeParts.hh}
            <span style={{ opacity: timeParts.showColon ? 1 : 0 }}>：</span>
            {timeParts.mm}
          </div>

          <div style={{ textAlign: "right", color: "#fff" }}>
            <div>{formatMoney(totalAmount)}</div>
            <div>{recordCount}件</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            height: 70,
            background: "#fff",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {subLabel}
        </div>
      </div>
    );
  }

  /* =========================
     BottomCard（終了専用）
  ========================= */
  function BottomCard({ show, onFinish }) {
    if (!show) return null;

    return (
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px 24px 0 0",
            padding: 16,
          }}
        >
          <button
            onClick={onFinish}
            style={{
              width: "100%",
              height: 60,
              background: "#444",
              color: "#fff",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            本日の乗務を終了
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     ▲ボタン
  ========================= */
  function ToggleButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          right: 16,
          bottom: 110,
          fontSize: 26,
          color: "#999",
        }}
      >
        ▲
      </button>
    );
  }

  /* =========================
     グラフ入口
  ========================= */
  function GraphEntryGrid() {
    return (
      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: 80,
              background: "#e6e6fa",
              borderRadius: 16,
            }}
          />
        ))}
      </div>
    );
  }

  /* =========================
     下ナビ
  ========================= */
  function BottomNav({ isHome, onHome, onCenter, onMenu }) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
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

  return {
    HeaderCard,
    BottomCard,
    ToggleButton,
    GraphEntryGrid,
    BottomNav,
  };
})();

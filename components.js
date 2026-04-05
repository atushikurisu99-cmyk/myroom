window.AppComponents = (() => {
  const {
    formatMoney,
    formatTime,
    formatFullDate,
    recordType,
    getWeatherIcon,
  } = window.AppUtils;
  const C = window.AppConstants;

  /* =========================
   Header（黄緑エリア化）
  ========================= */
  function HeaderCard({
    timeParts,
    weather,
    totalAmount,
    recordCount,
  }) {
    return (
      <div
        className="h-[172px] px-4 py-4 shrink-0 overflow-hidden"
        style={{
          background: "#32cd32",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <div className="flex justify-between items-start">
          <div className="text-white text-[48px] font-black">
            {timeParts.hh}
            <span
              style={{
                opacity: timeParts.showColon ? 1 : 0,
                transition: "opacity .15s",
              }}
            >
              ：
            </span>
            {timeParts.mm}
          </div>

          <div className="text-right text-white text-sm">
            <div>{formatMoney(totalAmount)}</div>
            <div>{recordCount}件</div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
   BottomCard（完全新仕様）
  ========================= */
  function BottomCard({
    show,
    onClose,
    onFinish,
  }) {
    if (!show) return null;

    return (
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "80px",
        }}
      >
        <div
          className="p-4"
          style={{
            background: "#fff",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <button
            onClick={onFinish}
            style={{
              width: "100%",
              height: "60px",
              borderRadius: "16px",
              background: "#666",
              color: "#fff",
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
   ▲ボタン（新規）
  ========================= */
  function ToggleButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          right: "16px",
          bottom: "120px",
          fontSize: "20px",
        }}
      >
        ▲
      </button>
    );
  }

  /* =========================
   グラフ入口
  ========================= */
  function GraphEntry() {
    return (
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: "80px",
              background: "#f2f2f2",
              borderRadius: "16px",
            }}
          />
        ))}
      </div>
    );
  }

  /* =========================
   下ナビ（新仕様）
  ========================= */
  function BottomNav({
    isHome,
    onHome,
    onCenter,
    onMenu,
  }) {
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

  return {
    HeaderCard,
    BottomCard,
    ToggleButton,
    GraphEntry,
    BottomNav,
  };
})();

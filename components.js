window.AppComponents = (() => {
  const {
    formatMoney,
    formatTime,
    formatFullDate,
    formatDutyDate,
    recordType,
    getWeatherIcon,
  } = window.AppUtils;

  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  /* =========================
     ▼ 矢印コンポーネント（追加）
  ========================= */
  function BottomToggleArrow({ isOpen, onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: `${L.BOTTOM_BAND_BOTTOM + L.BOTTOM_BAND_H - 6}px`,
          width: "42px",
          height: "42px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            transition: "transform 220ms cubic-bezier(0.22,1,0.36,1)",
            transform: `rotate(${isOpen ? 180 : 0}deg) scale(${isOpen ? 0.85 : 1})`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
          >
            <path
              d="M6 14L12 8L18 14"
              stroke="#4a5568"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    );
  }

  /* =========================
     ▼ BottomNav 修正版
  ========================= */
  function BottomNav({
    centerLabel = "履歴",
    onHome,
    onCenter,
    onMenu,
    active = "home",

    // ★追加
    isOpen = false,
    onToggle,
  }) {
    return (
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: `${L.NAV_H}px`, zIndex: 20 }}
      >
        {/* 帯 */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: `${L.BOTTOM_BAND_BOTTOM}px`,
            height: `${L.BOTTOM_BAND_H}px`,
            background: C.GREEN,
            borderTopLeftRadius: `${L.BOTTOM_BAND_RADIUS}px`,
            borderTopRightRadius: `${L.BOTTOM_BAND_RADIUS}px`,
            overflow: "visible",
            zIndex: 1,
          }}
        />

        {/* ▼ 矢印（ここに追加） */}
        <BottomToggleArrow
          isOpen={isOpen}
          onClick={onToggle}
        />

        {/* ナビブロック */}
        <div
          className="absolute inset-x-0"
          style={{
            bottom: `${L.BOTTOM_BAND_BOTTOM}px`,
            height: `${L.BOTTOM_BAND_H}px`,
            zIndex: 3,
          }}
        >
          <div className="absolute inset-0 grid grid-cols-3">
            {["home", "center", "menu"].map((key) => {
              const blockType = key === "center" ? "center" : key;
              const blockLabel = key === "center" ? centerLabel : "";
              const isActive = active === key;
              const onClick =
                key === "home" ? onHome : key === "center" ? onCenter : onMenu;

              return (
                <div key={key} className="relative">
                  {isActive && (
                    <div
                      className="absolute left-1/2"
                      style={{
                        top: `${L.NAV_CIRCLE_TOP}px`,
                        transform: "translateX(-50%)",
                        width: `${L.NAV_CIRCLE_SIZE}px`,
                        height: `${L.NAV_CIRCLE_SIZE}px`,
                        borderRadius: "999px",
                        background: C.NAV_ACTIVE,
                        zIndex: 2,
                      }}
                    />
                  )}

                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: `${L.NAV_BLOCK_TOP}px`,
                      zIndex: 4,
                    }}
                  >
                    <BottomNavBlock
                      type={blockType}
                      label={blockLabel}
                      onClick={onClick}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ▼ export
  ========================= */
  return {
    HeaderCard,
    RideInfoCard,
    HistoryRecordCard,
    TopGraphArea,
    BottomNav,
    MainButton,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
  };
})();

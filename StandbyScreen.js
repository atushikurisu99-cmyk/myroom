window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { MainButton, BottomNav } = window.AppComponents;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
      homeEndSheetOpen = false,
      toggleHomeEndSheet = () => {},
      handleFinishTap = () => {},
      goHome = () => {},
      openMenu = () => {},
      openHistorySimple = () => {},
    } = props;

    const endSheetHeight = 88;
    const endSheetBottom = L.NAV_H - 6;
    const endSheetVisibleY = 0;
    const endSheetHiddenY = endSheetHeight + 14;

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
            zIndex: 6,
          }}
        >
          <MainButton
            label="実車"
            type="standby"
            onClick={handleStartRide}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
            height: `${L.CONTENT_PLACEHOLDER_H}px`,
            zIndex: 4,
          }}
        >
          <div style={{ height: "100%" }} />
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            bottom: `${endSheetBottom}px`,
            height: `${endSheetHeight}px`,
            zIndex: 18,
            pointerEvents: homeEndSheetOpen ? "auto" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${L.SIDE}px`,
              right: `${L.SIDE}px`,
              bottom: "0px",
              transform: `translateY(${homeEndSheetOpen ? endSheetVisibleY : endSheetHiddenY}px)`,
              opacity: homeEndSheetOpen ? 1 : 0,
              transition:
                "transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease",
            }}
          >
            <button
              type="button"
              onClick={handleFinishTap}
              style={{
                width: "100%",
                height: "64px",
                borderRadius: "22px",
                background: "linear-gradient(180deg,#ffffff 0%, #f3f5f8 100%)",
                color: "#2d3748",
                fontSize: "24px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                border: "1px solid rgba(140,150,170,0.22)",
              }}
            >
              本日の乗務を終了
            </button>
          </div>
        </div>

        <BottomNav
          centerLabel="履歴"
          onHome={goHome}
          onCenter={openHistorySimple}
          onMenu={openMenu}
          active="home"
          isOpen={homeEndSheetOpen}
          onToggle={toggleHomeEndSheet}
        />
      </div>
    );
  };
})();

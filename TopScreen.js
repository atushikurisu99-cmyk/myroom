window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { HeaderCard, BottomNav, HomeGraphCards, HomeEndDutySheet } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      screen,
      timeParts,
      homeDisplayAmount,
      isHomeAmountVisible,
      toggleHomeAmountVisible,
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      mainButtonStyle,
      contentStyle,
      startupMainStyle,
      startupOtherStyle,
      homeEndSheetOpen,
      toggleHomeEndSheet,
      handleFinishTap,
      dutyStarted,
      navCenterLabel,
      navActiveArea,
      onHome,
      onCenter,
      onMenu,
    } = props;

    const resolvedMainStyle = mainButtonStyle || startupMainStyle || {};
    const resolvedContentStyle = contentStyle || startupOtherStyle || {};

    return (
      <div className="h-full flex flex-col overflow-hidden relative bg-transparent">
        <div
          className="shrink-0"
          style={{
            background: "#9ED36A",
            paddingBottom: "8px",
          }}
        >
          <div className="h-[172px] shrink-0">
            <HeaderCard
              screen={screen}
              timeParts={timeParts}
              homeDisplayAmount={homeDisplayAmount}
              isHomeAmountVisible={isHomeAmountVisible}
              toggleHomeAmountVisible={toggleHomeAmountVisible}
              cardMode={1}
              totalAmount={homeDisplayAmount}
              recordCount={0}
              amount1={0}
              amount2={0}
            />
          </div>

          <div
            className="pt-4 px-3"
            style={resolvedMainStyle}
          >
            <button
              type="button"
              onClick={handleTopMain}
              disabled={topMainButtonDisabled}
              className={`${C.mainButtonBase} ${C.mainButtonShine} ${
                topMainLabel === "乗務開始"
                  ? "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
                  : topMainLabel === "実車"
                  ? "bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] text-white"
                  : "bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)] text-white"
              }`}
            >
              <span className={C.bigButtonText}>{topMainLabel}</span>
            </button>
          </div>
        </div>

        <div
          className="flex-1 min-h-0 overflow-hidden px-3 pt-4 relative"
          style={resolvedContentStyle}
        >
          <HomeGraphCards />

          <div
            className="absolute z-20"
            style={{
              right: "18px",
              bottom: `${(C.HOME_END_SHEET_HEIGHT || 120) + (C.BOTTOM_NAV_HEIGHT || 82) + 8}px`,
            }}
          >
            <button
              type="button"
              onClick={toggleHomeEndSheet}
              className="flex items-center justify-center w-[40px] h-[36px] active:opacity-80"
              aria-label={homeEndSheetOpen ? "終了ボタンを閉じる" : "終了ボタンを開く"}
            >
              <span className="text-[31px] leading-none font-bold text-slate-300">
                {homeEndSheetOpen ? "▼" : "▲"}
              </span>
            </button>
          </div>

          <HomeEndDutySheet
            open={homeEndSheetOpen}
            dutyStarted={dutyStarted}
            onFinishTap={handleFinishTap}
          />
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 z-20"
          style={{ height: `${C.BOTTOM_NAV_HEIGHT || 82}px` }}
        >
          <BottomNav
            centerLabel={navCenterLabel || "経費"}
            onHome={onHome}
            onCenter={onCenter}
            onMenu={onMenu}
            activeArea={navActiveArea || "home"}
          />
        </div>
      </div>
    );
  };
})();

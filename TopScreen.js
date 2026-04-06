window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const {
    HeaderCard,
    HomeGraphCards,
    HomeEndDutySheet,
    BottomNav,
  } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#9ED36A";

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
      contentStyle,
      mainButtonStyle,
      homeEndSheetOpen,
      toggleHomeEndSheet,
      handleFinishTap,
      dutyStarted,
      isRiding,
      navCenterLabel,
      navActiveArea,
      onHome,
      onCenter,
      onMenu,
    } = props;

    const canShowEndEntry = dutyStarted && !isRiding;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        <div className="shrink-0" style={{ background: GREEN_MAIN }}>
          <div className="h-[172px] shrink-0">
            <HeaderCard
              screen={screen}
              timeParts={timeParts}
              homeDisplayAmount={homeDisplayAmount}
              isHomeAmountVisible={isHomeAmountVisible}
              toggleHomeAmountVisible={toggleHomeAmountVisible}
            />
          </div>

          <div
            className="shrink-0 px-3 pb-4"
            style={{
              height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
              ...(mainButtonStyle || {}),
            }}
          >
            <div className="h-full pt-1">
              <button
                type="button"
                onClick={handleTopMain}
                disabled={topMainButtonDisabled}
                className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white rounded-[28px] shadow-[0_8px_16px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.45)]`}
              >
                <span className="text-[30px] font-bold tracking-[-0.02em]">{
                  topMainLabel
                }</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 flex-1 min-h-0 overflow-hidden" style={contentStyle || undefined}>
          {!homeEndSheetOpen ? (
            <div className="h-[150px] shrink-0 relative">
              <HomeGraphCards />
              {canShowEndEntry && (
                <div
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleHomeEndSheet}
                    className="flex items-center justify-center w-[46px] h-[40px] active:opacity-80"
                    aria-label="終了導線を開く"
                  >
                    <span className="text-[32px] leading-none font-bold text-slate-400">
                      ▲
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[86px] shrink-0 relative">
              <HomeEndDutySheet
                open={homeEndSheetOpen}
                dutyStarted={dutyStarted}
                onFinishTap={handleFinishTap}
              />
              <div
                className="absolute z-20"
                style={{
                  right: "8px",
                  top: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={toggleHomeEndSheet}
                  className="flex items-center justify-center w-[46px] h-[40px] active:opacity-80"
                  aria-label="終了導線を閉じる"
                >
                  <span className="text-[32px] leading-none font-bold text-slate-400">
                    ▼
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0"></div>
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 z-20"
          style={{ height: `${C.BOTTOM_NAV_HEIGHT}px` }}
        >
          <BottomNav
            centerLabel={navCenterLabel}
            onHome={onHome}
            onCenter={onCenter}
            onMenu={onMenu}
            activeArea={navActiveArea}
          />
        </div>
      </div>
    );
  };
})();

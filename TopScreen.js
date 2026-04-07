// =========================
// TopScreen.js（全文置き換え）
// =========================
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
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ paddingBottom: `${C.BOTTOM_NAV_HEIGHT}px` }}
      >
        <div className="h-full flex flex-col overflow-hidden">
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
                  className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white rounded-[28px]`}
                >
                  <span className="text-[30px] font-bold">
                    {topMainLabel}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 flex-1 min-h-0 overflow-hidden" style={contentStyle || undefined}>
            {!homeEndSheetOpen ? (
              <div className="h-[150px] shrink-0 relative px-0">
                <HomeGraphCards />
                {canShowEndEntry && (
                  <div className="absolute right-2 top-1 z-20">
                    <button
                      type="button"
                      onClick={toggleHomeEndSheet}
                      className="w-[46px] h-[40px] flex items-center justify-center"
                    >
                      <span className="text-[32px] text-slate-400">▲</span>
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
                  label="終了前チェックへ"
                />
                <div className="absolute right-2 top-1 z-20">
                  <button
                    type="button"
                    onClick={toggleHomeEndSheet}
                    className="w-[46px] h-[40px]"
                  >
                    <span className="text-[32px] text-slate-400">▼</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
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

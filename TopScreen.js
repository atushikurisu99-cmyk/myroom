window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { HeaderCard, HomeGraphCards, HomeEndDutySheet } = window.AppComponents;
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
    } = props;

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
            className="shrink-0 px-0 pb-0"
            style={{
              height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
              ...(mainButtonStyle || {}),
            }}
          >
            <div className="h-full px-0 pt-0">
              <button
                type="button"
                onClick={handleTopMain}
                disabled={topMainButtonDisabled}
                className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white rounded-none border-0 shadow-[inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(0,0,0,0.24),0_8px_16px_rgba(0,0,0,0.14)]`}
              >
                <span className={C.bigButtonText}>{topMainLabel}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 flex-1 min-h-0 overflow-hidden" style={contentStyle || undefined}>
          <div className="h-[150px] shrink-0">
            <HomeGraphCards />
          </div>

          <div className="pt-4 flex-1 min-h-0 relative">
            <div className="absolute inset-x-0 bottom-0 h-[122px]">
              <HomeEndDutySheet
                open={homeEndSheetOpen}
                dutyStarted={dutyStarted}
                onFinishTap={handleFinishTap}
              />
            </div>

            <div
              className="absolute z-20"
              style={{
                right: "8px",
                bottom: "14px",
              }}
            >
              <button
                type="button"
                onClick={toggleHomeEndSheet}
                className="flex items-center justify-center w-[46px] h-[40px] active:opacity-80"
                aria-label={homeEndSheetOpen ? "終了ボタンを閉じる" : "終了ボタンを開く"}
              >
                <span className="text-[32px] leading-none font-bold text-slate-400">
                  {homeEndSheetOpen ? "▼" : "▲"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
})();

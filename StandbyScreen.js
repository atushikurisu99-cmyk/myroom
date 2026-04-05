window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { HeaderCard } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#9ED36A";

  return function StandbyScreen(props) {
    const {
      screen,
      timeParts,
      cardMode,
      weather,
      totalAmount,
      recordCount,
      amount1,
      amount2,
      handleStartRide,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0" style={{ background: GREEN_MAIN }}>
          <div className="h-[172px] shrink-0">
            <HeaderCard
              screen={screen}
              timeParts={timeParts}
              cardMode={cardMode}
              weather={weather}
              totalAmount={totalAmount}
              recordCount={recordCount}
              amount1={amount1}
              amount2={amount2}
            />
          </div>

          <div
            className="shrink-0"
            style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
          >
            <button
              type="button"
              onClick={handleStartRide}
              className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] text-white rounded-none border-0 shadow-[inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(0,0,0,0.24),0_8px_16px_rgba(0,0,0,0.14)]`}
            >
              <span className={C.bigButtonText}>実車</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0"></div>
      </div>
    );
  };
})();

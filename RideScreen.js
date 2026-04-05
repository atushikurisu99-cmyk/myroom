window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { HeaderCard, RideInfoCard } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#9ED36A";

  return function RideScreen(props) {
    const {
      screen,
      timeParts,
      cardMode,
      weather,
      totalAmount,
      recordCount,
      amount1,
      amount2,
      pickup,
      rideStartAt,
      elapsedText,
      viaStops,
      handleDropOffTap,
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
            className="shrink-0 px-3 pb-4"
            style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
          >
            <div className="h-full pt-1">
              <button
                type="button"
                onClick={handleDropOffTap}
                className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)] text-white rounded-[28px] border border-white/60`}
              >
                <span className={C.bigButtonText}>降車</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className="pt-3 shrink-0"
          style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT + 12}px` }}
        >
          <RideInfoCard
            pickup={pickup}
            rideStartAt={rideStartAt}
            elapsedText={elapsedText}
            viaStops={viaStops}
          />
        </div>

        <div className="flex-1 min-h-0"></div>
      </div>
    );
  };
})();

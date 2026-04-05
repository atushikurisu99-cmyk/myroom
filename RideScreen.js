window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { RideInfoCard } = window.AppComponents;
  const C = window.AppConstants;

  return function RideScreen(props) {
    const {
      pickup,
      rideStartAt,
      elapsedText,
      viaStops,
      handleDropOffTap,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleDropOffTap}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)]`}
          >
            <span className={C.bigButtonText}>降車</span>
          </button>
        </div>

        <div className="pt-4 shrink-0" style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}>
          <RideInfoCard
            pickup={pickup}
            rideStartAt={rideStartAt}
            elapsedText={elapsedText}
            viaStops={viaStops}
          />
        </div>

        <div className="pt-4 flex-1 min-h-0"></div>
      </div>
    );
  };
})();

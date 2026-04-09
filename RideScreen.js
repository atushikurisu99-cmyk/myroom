window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { RideInfoCard } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#32CD32";

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
          className="shrink-0 px-3 pt-4 pb-4 -mx-4"
          style={{
            height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
            background: GREEN_MAIN,
          }}
        >
          <div className="px-4 h-full">
            <button
              type="button"
              onClick={handleDropOffTap}
              className={`${C.mainButtonBase} w-full h-full bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)] text-white rounded-[28px] shadow-[0_8px_16px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.45)]`}
            >
              <span className="text-[30px] font-bold tracking-[-0.02em]">降車</span>
            </button>
          </div>
        </div>

        <div
          className="pt-4 shrink-0"
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

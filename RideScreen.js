window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { RideInfoCard, BottomNav } = window.AppComponents;
  const C = window.AppConstants;

  return function RideScreen(props) {
    const {
      pickup,
      rideStartAt,
      elapsedText,
      viaStops,
      handleDropOffTap,
      goHome,
      openHistoryModal,
      openOtherSheet,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative pb-[94px]">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleDropOffTap}
            className={`${C.mainButtonBase} ${C.mainButtonShine}`}
            style={{
              background: "linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)",
            }}
          >
            <span className={C.bigButtonText}>降車</span>
          </button>
        </div>

        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
        >
          <RideInfoCard
            pickup={pickup}
            rideStartAt={rideStartAt}
            elapsedText={elapsedText}
            viaStops={viaStops}
          />
        </div>

        <div className="pt-4 flex-1 min-h-0">
          <div className="h-full rounded-[28px] bg-[#f7f7f7]" />
        </div>

        <BottomNav
          centerLabel="履歴"
          onHome={goHome}
          onCenter={openHistoryModal}
          onMenu={openOtherSheet}
        />
      </div>
    );
  };
})();

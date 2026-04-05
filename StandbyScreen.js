window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { BottomNav } = window.AppComponents;
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
      renderSharedInfoSpacer,
      goHome,
      openSimpleHistory,
      openOtherSheet,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative pb-[92px]">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleStartRide}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="flex-1 min-h-0" />

        <BottomNav
          mode="ride"
          onHome={goHome}
          onCenter={openSimpleHistory}
          onMenu={openOtherSheet}
        />
      </div>
    );
  };
})();

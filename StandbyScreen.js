window.AppScreens = window.AppScreens || {};

window.AppScreens.StandbyScreen = (() => {
  const { BottomNav } = window.AppComponents;
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
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
            onClick={handleStartRide}
            className={`${C.mainButtonBase} ${C.mainButtonShine}`}
            style={{
              background: "linear-gradient(180deg,#78bbff,#4f97f5,#2e6fd6)",
            }}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
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

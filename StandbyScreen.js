window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const { handleStartRide } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleStartRide}
            className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] text-white rounded-[28px] shadow-[0_8px_16px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.45)]`}
          >
            <span className="text-[30px] font-bold tracking-[-0.02em]">実車</span>
          </button>
        </div>

        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
        >
          <div className="h-full rounded-[28px] opacity-0 pointer-events-none" />
        </div>

        <div className="flex-1 min-h-0"></div>
      </div>
    );
  };
})();

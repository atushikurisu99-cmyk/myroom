window.AppScreens.StandbyScreen = (() => {
  const C = window.AppConstants;

  return function StandbyScreen({ handleStartRide }) {
    return (
      <div className="flex-1 flex flex-col">

        <div className="pt-4" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            onClick={handleStartRide}
            className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
        </div>

      </div>
    );
  };
})();

window.AppScreens.RideScreen = (() => {
  const C = window.AppConstants;

  return function RideScreen({ handleDropOffTap }) {
    return (
      <div className="flex-1 flex flex-col">

        <div className="pt-4" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            onClick={handleDropOffTap}
            className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)]`}
          >
            <span className={C.bigButtonText}>降車</span>
          </button>
        </div>

      </div>
    );
  };
})();

window.AppComponents = (() => {
  const C = window.AppConstants;

  function HeaderCard({ timeParts }) {
    return (
      <div className={`${C.cardClass} h-[172px] px-4 py-4`}>
        <div className="flex justify-end">
          <div className="text-[58px] font-black text-slate-800">
            {timeParts.hh}
            <span className={timeParts.showColon ? "" : "opacity-0"}>：</span>
            {timeParts.mm}
          </div>
        </div>
      </div>
    );
  }

  function BottomCard({ open, onClose, onFinish }) {
    return (
      <div
        className="absolute left-0 right-0 z-40"
        style={{
          bottom: "60px",
          transform: open ? "translateY(0)" : "translateY(120%)",
          transition: "transform 160ms linear",
        }}
      >
        <div
          className={`${C.cardClass} mx-4`}
          style={{ height: `${C.BOTTOM_CARD_HEIGHT}px` }}
        >
          <div className="h-full flex items-end justify-center pb-10">
            <button
              onClick={() => {
                onFinish();
                onClose();
              }}
              className={C.endDutyButtonClass}
              style={{ width: "260px", height: "50px" }}
            >
              本日の乗務を終了
            </button>
          </div>
        </div>
      </div>
    );
  }

  function FloatingToggle({ open, toggle }) {
    return (
      <button
        onClick={toggle}
        className="absolute z-50"
        style={{ right: "18px", bottom: "70px" }}
      >
        <div className="w-[42px] h-[38px] flex items-center justify-center">
          <span className="text-[30px] text-slate-300">▲</span>
        </div>
      </button>
    );
  }

  return {
    HeaderCard,
    BottomCard,
    FloatingToggle,
  };
})();

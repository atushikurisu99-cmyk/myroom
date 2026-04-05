window.AppComponents = (() => {
  const C = window.AppConstants;

  function BottomCard({ show, onClose, onFinish }) {
    if (!show) return null;

    return (
      <div
        className="absolute inset-0 z-40 flex items-end bg-black/30"
        onClick={onClose}
      >
        <div
          className="w-full rounded-t-[28px] bg-white p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: "translateY(0)",
            transition: "transform 180ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <button
            onClick={onFinish}
            className={`${C.endDutyButtonClass} w-full h-[56px]`}
          >
            本日の乗務を終了
          </button>
        </div>
      </div>
    );
  }

  return { BottomCard };
})();

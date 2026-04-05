window.AppScreens = window.AppScreens || {};

window.AppScreens.TopScreen = (() => {
  const { BottomCard, GraphEntryGrid, BottomNav } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      showHomeBottomCard,
      toggleHomeBottomCard,
      handleFinishTap,
      openOtherSheet,
      openExpenseModal,
      startupMainStyle,
      dutyStarted,
    } = props;

    const mainGradient =
      topMainLabel === "降車"
        ? "linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)"
        : topMainLabel === "実車"
        ? "linear-gradient(180deg,#78bbff,#4f97f5,#2e6fd6)"
        : "linear-gradient(180deg,#5ee05e,#32cd32,#24a924)";

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative pb-[94px]">
        <div
          className="pt-4 shrink-0"
          style={{
            height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
            ...(startupMainStyle || {}),
          }}
        >
          <button
            type="button"
            onClick={handleTopMain}
            disabled={topMainButtonDisabled}
            className={`${C.mainButtonBase} ${C.mainButtonShine}`}
            style={{ background: mainGradient }}
          >
            <span className={C.bigButtonText}>{topMainLabel}</span>
          </button>
        </div>

        <div className="pt-4 flex-1 min-h-0 overflow-hidden">
          <div className="h-full rounded-[28px] bg-[#f7f7f7]">
            <GraphEntryGrid />
          </div>
        </div>

        {dutyStarted && (
          <>
            <button
              type="button"
              onClick={toggleHomeBottomCard}
              className="absolute z-30 flex items-center justify-center active:opacity-80"
              style={{
                right: "16px",
                bottom: "92px",
                width: "40px",
                height: "38px",
              }}
              aria-label="乗務終了を開閉"
            >
              <span className="text-[28px] leading-none font-bold text-slate-400">
                {showHomeBottomCard ? "▼" : "▲"}
              </span>
            </button>

            <BottomCard
              show={showHomeBottomCard}
              onFinish={handleFinishTap}
            />
          </>
        )}

        <BottomNav
          centerLabel="経費"
          onHome={() => {}}
          onCenter={openExpenseModal}
          onMenu={openOtherSheet}
        />
      </div>
    );
  };
})();

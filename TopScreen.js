window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { BottomNav, HomeBottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      renderSharedInfoSpacer,
      showHomeBottomCard,
      toggleHomeBottomCard,
      handleFinishTap,
      openExpenseModal,
      openOtherSheet,
      startupMainStyle,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative pb-[92px]">
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
            className={`${C.mainButtonBase} ${C.mainButtonShine} ${
              topMainLabel === "降車"
                ? "bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)] text-white"
                : topMainLabel === "実車"
                ? "bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] text-white"
                : "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
            }`}
          >
            <span className={C.bigButtonText}>{topMainLabel}</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="flex-1 min-h-0 relative">
          <button
            type="button"
            onClick={toggleHomeBottomCard}
            className="absolute right-[16px] bottom-[98px] z-30 flex items-center justify-center w-[42px] h-[38px] active:opacity-80"
            aria-label="乗務終了を開く"
          >
            <span className="text-[30px] leading-none font-bold text-slate-300">▲</span>
          </button>

          <HomeBottomCard
            visible={showHomeBottomCard}
            onFinish={handleFinishTap}
          />
        </div>

        <BottomNav
          mode="home"
          onHome={() => {}}
          onCenter={openExpenseModal}
          onMenu={openOtherSheet}
        />
      </div>
    );
  };
})();

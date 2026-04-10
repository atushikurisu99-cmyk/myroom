window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { HomeGraphCards, HomeEndDutySheet, StartHeader } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#32CD32";

  return function TopScreen(props) {
    const {
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      startupHeaderStyle,
      startupMainStyle,
      startupOtherStyle,
      homeEndSheetOpen,
      toggleHomeEndSheet,
      handleFinishTap,
      dutyStarted,
      timeParts,
      monthlyProgressAmount,
      monthlyProgressVisible,
      toggleMonthlyProgressVisible,
    } = props;

    const isStartMode = !dutyStarted && topMainLabel === "乗務開始";

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {isStartMode && (
          <div className="-mx-4" style={{ background: GREEN_MAIN, ...(startupHeaderStyle || {}) }}>
            <div className="px-4">
              <StartHeader
                timeParts={timeParts}
                progressAmount={monthlyProgressAmount}
                progressVisible={monthlyProgressVisible}
                onToggleVisible={toggleMonthlyProgressVisible}
              />
            </div>
          </div>
        )}

        <div
          className="shrink-0 px-3 pt-4 pb-4 -mx-4"
          style={{
            height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
            background: GREEN_MAIN,
            ...(startupMainStyle || {}),
          }}
        >
          <div className="px-4 h-full">
            <button
              type="button"
              onClick={handleTopMain}
              disabled={topMainButtonDisabled}
              className={`${C.mainButtonBase} ${C.mainButtonShine} w-full h-full ${
                topMainLabel === "乗務開始"
                  ? "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
                  : topMainLabel === "実車"
                  ? "bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] text-white"
                  : "bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)] text-white"
              }`}
            >
              <span className={C.bigButtonText}>{topMainLabel}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative" style={startupOtherStyle || undefined}>
          {!homeEndSheetOpen && (
            <div
              className="absolute inset-x-0 top-0 overflow-y-auto"
              style={{
                bottom: "86px",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              <div className="pt-0">
                <HomeGraphCards />
              </div>
            </div>
          )}

          <div
            className="absolute z-20"
            style={{
              right: "22px",
              bottom: "94px",
            }}
          >
            <button
              type="button"
              onClick={toggleHomeEndSheet}
              className="flex items-center justify-center w-[40px] h-[36px] active:opacity-80"
              aria-label={homeEndSheetOpen ? "終了ボタンを閉じる" : "終了ボタンを開く"}
            >
              <span className="text-[31px] leading-none font-bold text-slate-300">
                {homeEndSheetOpen ? "▼" : "▲"}
              </span>
            </button>
          </div>

          <HomeEndDutySheet
            open={homeEndSheetOpen}
            dutyStarted={dutyStarted}
            onFinishTap={handleFinishTap}
          />
        </div>
      </div>
    );
  };
})();

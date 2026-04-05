window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { HomeGraphCards, HomeEndDutySheet } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      startupMainStyle,
      startupOtherStyle,
      homeEndSheetOpen,
      toggleHomeEndSheet,
      handleFinishTap,
      dutyStarted,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
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

        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
        >
          <div
            className="h-full rounded-[28px] px-3 py-3"
            style={{ background: "#7FC84E" }}
          >
            <HomeGraphCards />
          </div>
        </div>

        <div
          className="pt-4 flex-1 min-h-0 overflow-hidden"
          style={startupOtherStyle || undefined}
        >
          <div
            className="h-full rounded-[28px] px-3 py-3 flex flex-col"
            style={{ background: "#7FC84E" }}
          >
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full rounded-[24px] bg-white/10 border border-white/15 px-3 py-3">
                <HomeGraphCards />
              </div>
            </div>

            <div className="pt-3 shrink-0 h-[116px] relative">
              <HomeEndDutySheet
                open={homeEndSheetOpen}
                dutyStarted={dutyStarted}
                onFinishTap={handleFinishTap}
              />

              <div
                className="absolute z-20"
                style={{
                  right: "10px",
                  bottom: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={toggleHomeEndSheet}
                  className="flex items-center justify-center w-[46px] h-[40px] active:opacity-80"
                  aria-label={homeEndSheetOpen ? "終了ボタンを閉じる" : "終了ボタンを開く"}
                >
                  <span className="text-[32px] leading-none font-bold text-slate-400">
                    {homeEndSheetOpen ? "▼" : "▲"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
})();

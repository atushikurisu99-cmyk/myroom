window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const {
    HeaderCard,
    HomeGraphCards,
    HomeEndDutySheet,
    BottomNav,
  } = window.AppComponents;
  const C = window.AppConstants;

  const GREEN_MAIN = "#9ED36A";

  const GRAPH_AREA_HEIGHT = 150;
  const ARROW_LANE_WIDTH = 64;
  const ARROW_BUTTON_SIZE = 52;

  return function TopScreen(props) {
    const {
      screen,
      timeParts,
      cardMode,
      weather,
      totalAmount,
      recordCount,
      amount1,
      amount2,
      homeDisplayAmount,
      isHomeAmountVisible,
      toggleHomeAmountVisible,

      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,

      contentStyle,
      mainButtonStyle,

      homeEndSheetOpen,
      toggleHomeEndSheet,
      handleFinishTap,

      dutyStarted,
      isRiding,

      navCenterLabel,
      navActiveArea,
      onHome,
      onCenter,
      onMenu,
    } = props;

    const canShowEndEntry = dutyStarted && !isRiding;

    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ paddingBottom: `${C.BOTTOM_NAV_HEIGHT}px` }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="shrink-0" style={{ background: GREEN_MAIN }}>
            <div className="h-[172px] shrink-0">
              <HeaderCard
                screen={screen}
                timeParts={timeParts}
                cardMode={cardMode}
                weather={weather}
                totalAmount={totalAmount}
                recordCount={recordCount}
                amount1={amount1}
                amount2={amount2}
                homeDisplayAmount={homeDisplayAmount}
                isHomeAmountVisible={isHomeAmountVisible}
                toggleHomeAmountVisible={toggleHomeAmountVisible}
              />
            </div>

            <div
              className="shrink-0 px-3 pb-4"
              style={{
                height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
                ...(mainButtonStyle || {}),
              }}
            >
              <div className="h-full pt-1">
                <button
                  type="button"
                  onClick={handleTopMain}
                  disabled={topMainButtonDisabled}
                  className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white rounded-[28px]`}
                >
                  <span className="text-[30px] font-bold">
                    {topMainLabel}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="pt-3 flex-1 min-h-0 overflow-hidden"
            style={contentStyle || undefined}
          >
            {!homeEndSheetOpen ? (
              <div
                className="shrink-0 relative"
                style={{ height: `${GRAPH_AREA_HEIGHT}px` }}
              >
                <div
                  className="h-full"
                  style={{
                    paddingRight: canShowEndEntry ? `${ARROW_LANE_WIDTH}px` : "0px",
                  }}
                >
                  <HomeGraphCards />
                </div>

                {canShowEndEntry && (
                  <div
                    className="absolute top-0 right-0 h-full flex items-center justify-center"
                    style={{ width: `${ARROW_LANE_WIDTH}px` }}
                  >
                    <button
                      type="button"
                      onClick={toggleHomeEndSheet}
                      className="flex items-center justify-center active:opacity-80"
                      style={{
                        width: `${ARROW_BUTTON_SIZE}px`,
                        height: `${ARROW_BUTTON_SIZE}px`,
                      }}
                      aria-label="終了導線を開く"
                    >
                      <span className="text-[34px] leading-none text-slate-500">
                        ▲
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[86px] shrink-0 relative">
                <div style={{ paddingRight: `${ARROW_LANE_WIDTH}px` }}>
                  <HomeEndDutySheet
                    open={homeEndSheetOpen}
                    dutyStarted={dutyStarted}
                    onFinishTap={handleFinishTap}
                    label="終了前チェックへ"
                  />
                </div>

                <div
                  className="absolute top-0 right-0 h-full flex items-center justify-center"
                  style={{ width: `${ARROW_LANE_WIDTH}px` }}
                >
                  <button
                    type="button"
                    onClick={toggleHomeEndSheet}
                    className="flex items-center justify-center active:opacity-80"
                    style={{
                      width: `${ARROW_BUTTON_SIZE}px`,
                      height: `${ARROW_BUTTON_SIZE}px`,
                    }}
                    aria-label="終了導線を閉じる"
                  >
                    <span className="text-[34px] leading-none text-slate-500">
                      ▼
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1"></div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: `${C.BOTTOM_NAV_HEIGHT}px` }}
        >
          <BottomNav
            centerLabel={navCenterLabel}
            onHome={onHome}
            onCenter={onCenter}
            onMenu={onMenu}
            activeArea={navActiveArea}
          />
        </div>
      </div>
    );
  };
})();

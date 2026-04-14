window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { MainButton, TopGraphArea, HomeEndDutySheet } = window.AppComponents;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

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

    const buttonType =
      topMainLabel === "乗務開始"
        ? "start"
        : topMainLabel === "実車"
        ? "standby"
        : "ride";

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
            zIndex: 6,
            ...(startupMainStyle || {}),
          }}
        >
          <MainButton
            label={topMainLabel || "乗務開始"}
            type={buttonType}
            onClick={handleTopMain}
            disabled={topMainButtonDisabled}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
            ...(startupOtherStyle || {}),
          }}
        >
          <TopGraphArea />
        </div>

        <div
          className="absolute z-20"
          style={{
            right: "26px",
            bottom: "118px",
          }}
        >
          <button
            type="button"
            onClick={toggleHomeEndSheet}
            className="flex items-center justify-center w-[40px] h-[36px] active:opacity-80"
            aria-label={homeEndSheetOpen ? "終了ボタンを閉じる" : "終了ボタンを開く"}
          >
            <span className="text-[28px] font-black text-[#a7adb7] leading-none">
              {homeEndSheetOpen ? "▼" : "▲"}
            </span>
          </button>
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            bottom: `${C.BOTTOM_NAV_HEIGHT}px`,
            height: `${C.HOME_END_SHEET_HEIGHT}px`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
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

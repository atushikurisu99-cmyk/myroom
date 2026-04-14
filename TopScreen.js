window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { MainButton, TopGraphArea } = window.AppComponents;
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
            height: "172px",
            ...(startupOtherStyle || {}),
          }}
        >
          <div
            className="relative w-full h-full bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
            style={{ borderRadius: "8px" }}
          >
            {!homeEndSheetOpen ? (
              <>
                <div className="absolute inset-0 p-[12px]">
                  <TopGraphArea />
                </div>

                <div
                  className="absolute z-20"
                  style={{
                    right: "6px",
                    bottom: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleHomeEndSheet}
                    className="flex items-center justify-center w-[40px] h-[36px] active:opacity-80"
                    aria-label="終了ボタンを表示"
                  >
                    <span className="text-[28px] font-black text-[#a7adb7] leading-none">
                      ▲
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center px-5">
                  <button
                    type="button"
                    onClick={handleFinishTap}
                    disabled={!dutyStarted}
                    className={`${C.endDutyButtonClass} ${
                      dutyStarted ? "opacity-100" : "opacity-45"
                    }`}
                    style={{
                      width: "268px",
                      height: "46px",
                    }}
                  >
                    <span className="text-[17px] font-bold tracking-[-0.02em]">
                      本日の乗務を終了
                    </span>
                  </button>
                </div>

                <div
                  className="absolute z-20"
                  style={{
                    right: "6px",
                    bottom: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleHomeEndSheet}
                    className="flex items-center justify-center w-[40px] h-[36px] active:opacity-80"
                    aria-label="グラフ表示に戻す"
                  >
                    <span className="text-[28px] font-black text-[#a7adb7] leading-none">
                      ▼
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
})();

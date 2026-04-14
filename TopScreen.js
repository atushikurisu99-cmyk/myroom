window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { MainButton, TopGraphArea } = window.AppComponents;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  function EyeIcon() {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2.2 12C4.1 8.7 7.7 6.6 12 6.6C16.3 6.6 19.9 8.7 21.8 12C19.9 15.3 16.3 17.4 12 17.4C7.7 17.4 4.1 15.3 2.2 12Z"
          stroke="white"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3.1" fill="white" />
      </svg>
    );
  }

  function formatMoneyNoYen(value) {
    return Number(value || 0).toLocaleString("ja-JP");
  }

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
      timeParts,
      totalAmount,
    } = props;

    const hh = timeParts?.hh || "00";
    const mm = timeParts?.mm || "00";
    const digits = formatMoneyNoYen(totalAmount ?? 1000000);

    const buttonType =
      topMainLabel === "乗務開始"
        ? "start"
        : topMainLabel === "実車"
        ? "standby"
        : "ride";

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 bg-[#32CD32]"
          style={{ height: `${L.LINE_5_GREEN_BOTTOM}px` }}
        />

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_2_HEADER_BOTTOM - L.HEADER_H}px`,
            height: `${L.HEADER_H}px`,
            zIndex: 3,
          }}
        >
          <div className="relative w-full h-full">
            <div
              className="absolute font-bold leading-none tracking-[-0.05em]"
              style={{
                top: `${L.TOP_BAND_TOP}px`,
                right: `${L.CLOCK_RIGHT}px`,
                fontSize: "68px",
                color: "#ffffff",
              }}
            >
              {hh}：{mm}
            </div>

            <div
              style={{
                position: "absolute",
                left: `${L.HEADER_INNER_X}px`,
                top: `${L.LOWER_BAND_TOP + L.SWITCH_LABEL_TOP}px`,
                fontSize: "13px",
                lineHeight: "1",
                color: "#ffffff",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              累計+未確認
            </div>

            <div
              className="font-bold"
              style={{
                position: "absolute",
                right: `${L.TOP_MONEY_DIGITS_RIGHT}px`,
                bottom: "5px",
                width: `${L.TOP_MONEY_DIGITS_WIDTH}px`,
                fontSize: `${L.TOP_MONEY_NUMBER_FONT}px`,
                color: "#ffffff",
                lineHeight: "1",
                whiteSpace: "nowrap",
                textAlign: "right",
                letterSpacing: "-0.04em",
                overflow: "hidden",
              }}
            >
              {digits}
            </div>

            <div
              style={{
                position: "absolute",
                right: `${L.TOP_MONEY_YEN_RIGHT}px`,
                bottom: "7px",
                fontSize: `${L.TOP_MONEY_YEN_FONT}px`,
                color: "#ffffff",
                lineHeight: "1",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              円
            </div>

            <div
              style={{
                position: "absolute",
                left: L.TOP_MONEY_EYE_LEFT,
                bottom: `${L.TOP_MONEY_EYE_BOTTOM}px`,
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${L.TOP_MONEY_EYE_SIZE}px`,
                height: `${L.TOP_MONEY_EYE_SIZE}px`,
              }}
            >
              <EyeIcon />
            </div>
          </div>
        </div>

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
            zIndex: 4,
            ...(startupOtherStyle || {}),
          }}
        >
          {!homeEndSheetOpen ? (
            <div className="relative">
              <TopGraphArea />
              <div
                className="absolute"
                style={{
                  right: "6px",
                  bottom: "-8px",
                  zIndex: 20,
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
            </div>
          ) : (
            <div
              className="relative"
              style={{ height: `${L.GRAPH_CARD_H * 2 + L.GRAPH_GAP_Y}px` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
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
                className="absolute"
                style={{
                  right: "6px",
                  bottom: "-8px",
                  zIndex: 20,
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
            </div>
          )}
        </div>
      </div>
    );
  };
})();

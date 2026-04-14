window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { MainButton, TopGraphArea } = window.AppComponents;

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
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: "20px",
            right: "20px",
            top: "196px",
            height: "142px",
            ...(startupMainStyle || {}),
          }}
        >
          <MainButton
            label={topMainLabel || "乗務開始"}
            type={
              topMainLabel === "乗務開始"
                ? "start"
                : topMainLabel === "実車"
                ? "standby"
                : "ride"
            }
            onClick={handleTopMain}
            disabled={topMainButtonDisabled}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: "20px",
            right: "20px",
            top: "354px",
            ...(startupOtherStyle || {}),
          }}
        >
          <TopGraphArea />
        </div>

        <div
          className="absolute"
          style={{
            right: "26px",
            bottom: "118px",
            zIndex: 20,
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

        {homeEndSheetOpen && (
          <div
            className="absolute left-0 right-0 bottom-[112px] z-10 flex justify-center"
            style={{
              animation: "homeEndSheetUp 220ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="w-full px-[20px]">
              <div
                className="bg-white border border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.12)]"
                style={{
                  borderRadius: "24px",
                  padding: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={handleFinishTap}
                  disabled={!dutyStarted}
                  className={`w-full h-[52px] rounded-[18px] text-white font-bold shadow-[inset_0_2px_0_rgba(255,255,255,0.30),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)] ${
                    dutyStarted ? "opacity-100" : "opacity-45"
                  }`}
                  style={{
                    background:
                      "linear-gradient(180deg,#8f8787,#7f7777,#706868)",
                  }}
                >
                  <span className="text-[17px] font-bold tracking-[-0.02em]">
                    本日の乗務を終了
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes homeEndSheetUp {
            0% { transform: translateY(24px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  };
})();

window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
      handleFinishTap,
      isFinishVisible,
      openOtherSheet,
      openHistoryModal,
      previewRecords,
      standbySheetOffset,
      beginStandbySheetDrag,
      toggleStandbySheet,
      dragging,
      isStandbySheetOpened,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* 実車ボタン */}
        <div className="pt-4 shrink-0" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            type="button"
            onClick={handleStartRide}
            disabled={isFinishVisible}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)] disabled:opacity-60`}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
        </div>

        {/* 待機画面下部エリア */}
        <div className="pt-4 flex-1 min-h-0 relative overflow-hidden">
          {/* 背面：乗務終了 */}
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{ height: `${C.BOTTOM_CARD_HEIGHT + 84}px` }}
          >
            <div className="h-full rounded-[30px] bg-[#eef3f9] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] px-2 pt-3">
              <div className="w-full h-full rounded-[26px] bg-[linear-gradient(180deg,#edf2f8,#e6edf5)] flex items-center justify-center px-2">
                <button
                  type="button"
                  onClick={handleFinishTap}
                  disabled={!isFinishVisible}
                  className={`max-w-[100%] ${C.endDutyButtonClass} transition-opacity duration-150 ${
                    isFinishVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: "100%" }}
                >
                  本日の乗務を終了
                </button>
              </div>
            </div>
          </div>

          {/* その他カード本体 */}
          <div
            className="absolute inset-x-0 top-0 z-30"
            style={{
              transform: `translateY(${standbySheetOffset}px)`,
              transition: dragging ? "none" : "transform 180ms ease-out",
              willChange: "transform",
              pointerEvents: isFinishVisible ? "none" : "auto",
            }}
          >
            <BottomCard
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          </div>

          {/* ▽ 左モック位置 */}
          {!isStandbySheetOpened && (
            <div
              className="absolute z-40"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: `${C.BOTTOM_CARD_HEIGHT - 8}px`,
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center w-[28px] h-[24px] active:opacity-80"
                aria-label="その他を下げる"
              >
                <span className="text-[18px] leading-none font-bold text-slate-400">▽</span>
              </button>
            </div>
          )}

          {/* △ 右モック位置 */}
          {isStandbySheetOpened && (
            <div
              className="absolute z-40"
              style={{
                right: "18px",
                top: `${C.BOTTOM_CARD_HEIGHT + 92}px`,
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center w-[28px] h-[24px] active:opacity-80"
                aria-label="その他を戻す"
              >
                <span className="text-[18px] leading-none font-bold text-slate-400">△</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
})();

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

    const finishTop = 94;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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

        <div className="pt-4 flex-1 min-h-0 relative overflow-hidden">
          {/* 終了ボタン：最初からここに置く */}
          <div
            className="absolute inset-x-0 z-10 px-3"
            style={{ top: `${finishTop}px` }}
          >
            <button
              type="button"
              onClick={handleFinishTap}
              className={`${C.endDutyButtonClass} w-full`}
            >
              本日の乗務を終了
            </button>
          </div>

          {/* その他カード：上からかぶせる */}
          <div
            className="absolute inset-x-0 top-0 z-20"
            style={{
              transform: `translateY(${standbySheetOffset}px)`,
              transition: dragging ? "none" : "transform 180ms ease-out",
              willChange: "transform",
            }}
          >
            <BottomCard
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          </div>

          {/* その他が出ている時：▽ 左モック位置 */}
          {!isStandbySheetOpened && (
            <div
              className="absolute z-30"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: `${C.BOTTOM_CARD_HEIGHT - 12}px`,
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

          {/* 下げた後：△ 右モック位置 */}
          {isStandbySheetOpened && (
            <div
              className="absolute z-30"
              style={{
                right: "18px",
                top: `${finishTop + 48}px`,
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

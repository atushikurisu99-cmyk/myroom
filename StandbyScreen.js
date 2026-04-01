window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
      renderSharedInfoSpacer,
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

    const revealAreaTop = 16;
    const revealButtonTop = 54;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleStartRide}
            disabled={isFinishVisible}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="pt-4 flex-1 min-h-0 relative overflow-hidden">
          {/* 背面：終了ボタン */}
          <div
            className="absolute left-0 right-0 z-10"
            style={{
              top: `${revealAreaTop}px`,
              height: `${C.BOTTOM_CARD_HEIGHT}px`,
            }}
          >
            <div
              className="absolute left-0 right-0 flex justify-center"
              style={{ top: `${revealButtonTop}px` }}
            >
              <button
                type="button"
                onClick={handleFinishTap}
                disabled={!isFinishVisible}
                className={`${C.endDutyButtonClass} transition-opacity duration-150 ${
                  isFinishVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                style={{
                  width: "244px",
                  height: "40px",
                }}
              >
                <span className="text-[15px] font-bold tracking-[-0.02em]">
                  本日の乗務を終了
                </span>
              </button>
            </div>
          </div>

          {/* 前面：その他カード */}
          <div
            className="absolute left-0 right-0 z-20"
            style={{ top: `${revealAreaTop}px` }}
          >
            <div
              style={{
                transform: `translateY(${standbySheetOffset}px)`,
                transition: dragging ? "none" : "transform 180ms ease-out",
                willChange: "transform",
                pointerEvents: isStandbySheetOpened ? "none" : "auto",
              }}
            >
              <BottomCard
                movable={false}
                openOtherSheet={openOtherSheet}
                openHistoryModal={openHistoryModal}
                previewRecords={previewRecords}
              />
            </div>
          </div>

          {/* 通常時の▼ */}
          {!isStandbySheetOpened && (
            <div
              className="absolute z-30"
              style={{
                top: `${revealAreaTop + 6}px`,
                right: "18px",
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center w-[30px] h-[26px] active:opacity-80"
                aria-label="その他を下げる"
              >
                <span className="text-[22px] leading-none font-bold text-slate-300">▼</span>
              </button>
            </div>
          )}

          {/* 下げた後の▲ */}
          {isStandbySheetOpened && (
            <div
              className="absolute z-30"
              style={{
                right: "18px",
                bottom: "18px",
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center w-[32px] h-[28px] active:opacity-80"
                aria-label="その他を戻す"
              >
                <span className="text-[24px] leading-none font-bold text-slate-300">▲</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
})();

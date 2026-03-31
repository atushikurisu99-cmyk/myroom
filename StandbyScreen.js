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

        {renderSharedInfoSpacer()}

        <div className="flex-1 min-h-0 relative overflow-hidden">
          {/* ▼ 背面：乗務終了 */}
          <div
            className="absolute inset-x-0 z-10"
            style={{
              top: `${C.STANDBY_REVEAL_TOP}px`,
              height: `${C.STANDBY_REVEAL_PANEL_HEIGHT}px`,
            }}
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

          {/* ▼ その他カード（常時表示・動く本体） */}
          <div className="absolute inset-x-0 top-0 z-30">
            <BottomCard
              movable={true}
              standbySheetOffset={standbySheetOffset}
              dragging={dragging}
              isFinishVisible={isFinishVisible}
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          </div>

          {/* ▼▽ 左モック位置（通常時） */}
          {!isStandbySheetOpened && (
            <div
              className="absolute z-40"
              style={{
                right: "50%",
                transform: "translateX(50%)",
                top: `${C.BOTTOM_CARD_HEIGHT - 24}px`,
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="text-[18px] font-bold text-slate-400"
              >
                ▽
              </button>
            </div>
          )}

          {/* ▲ 右モック位置（下げた後） */}
          {isStandbySheetOpened && (
            <div
              className="absolute z-40"
              style={{
                right: "16px",
                bottom: `${C.STANDBY_HANDLE_BOTTOM + 8}px`,
              }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="text-[18px] font-bold text-slate-400"
              >
                △
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
})();

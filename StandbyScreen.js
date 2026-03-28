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

    const REVEAL_TOP = 72;
    const REVEAL_PANEL_HEIGHT = 126;
    const HANDLE_BOTTOM = 124;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="pt-4 shrink-0" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            type="button"
            onClick={handleStartRide}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
          >
            <span className={C.bigButtonText}>実車</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="flex-1 min-h-0 relative overflow-hidden">
          <div
            className="absolute inset-x-0 z-10 px-1"
            style={{
              top: `${REVEAL_TOP}px`,
              height: `${REVEAL_PANEL_HEIGHT}px`,
            }}
          >
            <div className="h-full rounded-[30px] bg-[#eef3f9] border border-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] px-2 py-3">
              <div className="w-full h-full rounded-[26px] bg-[linear-gradient(180deg,#edf2f8,#e6edf5)] flex items-center justify-center px-2">
                <button
                  type="button"
                  onClick={handleFinishTap}
                  disabled={!isFinishVisible}
                  className={`${C.endDutyButtonClass} transition-opacity duration-150 ${
                    isFinishVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{ width: "100%" }}
                >
                  乗務終了
                </button>
              </div>
            </div>
          </div>

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

          <div
            className="absolute inset-x-0 z-40 flex justify-center"
            style={{ bottom: `${HANDLE_BOTTOM}px` }}
          >
            <button
              type="button"
              onClick={toggleStandbySheet}
              onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
              onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
              className="w-[54px] h-[54px] rounded-full bg-white/80 border border-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.10)] flex items-center justify-center active:scale-[0.96]"
              aria-label={isStandbySheetOpened ? "閉じる" : "開く"}
            >
              <span
                className={
                  isStandbySheetOpened
                    ? "block w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px] border-l-transparent border-r-transparent border-b-slate-400"
                    : "block w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-slate-400"
                }
              />
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

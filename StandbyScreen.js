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

    const REVEAL_TOP = 92;
    const REVEAL_PANEL_HEIGHT = 154;
    const TRIANGLE_CLOSED_BOTTOM = 206;
    const TRIANGLE_OPENED_BOTTOM = 238;

    const finishShown = !!isStandbySheetOpened || !!isFinishVisible;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
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
            className="absolute inset-x-0 z-50 px-2"
            style={{
              top: `${REVEAL_TOP}px`,
              height: `${REVEAL_PANEL_HEIGHT}px`,
              pointerEvents: finishShown ? "auto" : "none",
            }}
          >
            <div className="h-full rounded-[28px] bg-[#eef3f9] border border-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.08)] px-3 py-3">
              <button
                type="button"
                onClick={handleFinishTap}
                disabled={!finishShown}
                className={`${C.endDutyButtonClass} h-full transition-opacity duration-150 ${
                  finishShown ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                style={{ width: "100%" }}
              >
                乗務終了
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 z-20">
            <BottomCard
              movable={true}
              standbySheetOffset={standbySheetOffset}
              dragging={dragging}
              isFinishVisible={finishShown}
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          </div>

          {!finishShown && (
            <div
              className="absolute inset-x-0 z-40 flex justify-center"
              style={{ bottom: `${TRIANGLE_CLOSED_BOTTOM}px` }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center px-4 py-3 active:opacity-70"
                aria-label="開く"
              >
                <span className="block w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-slate-400" />
              </button>
            </div>
          )}

          {finishShown && (
            <div
              className="absolute inset-x-0 z-40 flex justify-center"
              style={{ bottom: `${TRIANGLE_OPENED_BOTTOM}px` }}
            >
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="flex items-center justify-center px-4 py-3 active:opacity-70"
                aria-label="閉じる"
              >
                <span className="block w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
})();

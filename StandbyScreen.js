window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
      renderSharedInfoSpacer,
      handleFinishTap,
      openOtherSheet,
      openHistoryModal,
      previewRecords,
      toggleStandbySheet,
      isStandbySheetOpened,
    } = props;

    const finishShown = !!isStandbySheetOpened;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          {!finishShown ? (
            <button
              type="button"
              onClick={handleStartRide}
              className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
            >
              <span className={C.bigButtonText}>実車</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishTap}
              className={C.endDutyButtonClass.replace("h-[56px]", "h-full rounded-[28px]")}
            >
              <span className="text-[28px] font-extrabold tracking-[-0.03em]">乗務終了</span>
            </button>
          )}
        </div>

        {renderSharedInfoSpacer()}

        <div className="pt-4 flex-1 min-h-0 overflow-hidden">
          <div className="relative h-full">
            <div className="absolute inset-0">
              <BottomCard
                movable={false}
                standbySheetOffset={0}
                dragging={false}
                isFinishVisible={false}
                openOtherSheet={openOtherSheet}
                openHistoryModal={openHistoryModal}
                previewRecords={previewRecords}
              />
            </div>

            <button
              type="button"
              onClick={toggleStandbySheet}
              className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/92 shadow-[0_4px_10px_rgba(0,0,0,0.10)] active:scale-[0.97]"
              aria-label={finishShown ? "下げる" : "上げる"}
            >
              {finishShown ? (
                <span className="block w-0 h-0 border-l-[8px] border-r-[8px] border-b-[11px] border-l-transparent border-r-transparent border-b-slate-500" />
              ) : (
                <span className="block w-0 h-0 border-l-[8px] border-r-[8px] border-t-[11px] border-l-transparent border-r-transparent border-t-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

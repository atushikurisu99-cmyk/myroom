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
      standbySheetOffset,
      beginStandbySheetDrag,
      totalAmount,
    } = props;

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

        <div className="pt-4 flex-1 min-h-0 overflow-hidden">
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-x-0 top-3 z-0 px-2">
              <button
                type="button"
                onClick={handleFinishTap}
                className={`${C.endDutyButtonClass} w-full`}
                style={{ height: "96px" }}
              >
                <span className="text-[24px] font-extrabold tracking-[-0.03em]">
                  乗務終了
                </span>
              </button>
            </div>

            {isStandbySheetOpened ? (
              <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
                <div className="px-4 relative h-[30px]">
                  <button
                    type="button"
                    onClick={toggleStandbySheet}
                    className="pointer-events-auto absolute right-0 top-0 h-[28px] min-w-[44px] rounded-full bg-white/92 border border-slate-200 text-[18px] font-black leading-none text-slate-500 shadow-[0_4px_10px_rgba(0,0,0,0.10)]"
                    aria-label="その他を戻す"
                  >
                    △
                  </button>
                </div>
              </div>
            ) : null}

            <BottomCard
              movable={true}
              standbySheetOffset={standbySheetOffset}
              toggleStandbySheet={toggleStandbySheet}
              beginStandbySheetDrag={beginStandbySheetDrag}
              isOpened={!!isStandbySheetOpened}
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    );
  };
})();

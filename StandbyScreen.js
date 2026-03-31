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

        <div className="pt-4 flex-1 min-h-0 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{ height: `${C.BOTTOM_CARD_HEIGHT + 78}px` }}
          >
            <div className="h-full rounded-[30px] bg-[#eef3f9] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] px-2 pt-3">
              <div className="w-full h-full rounded-[26px] bg-[linear-gradient(180deg,#edf2f8,#e6edf5)] flex items-end justify-center px-2 pb-4">
                <button
                  type="button"
                  onClick={handleFinishTap}
                  disabled={!isFinishVisible}
                  className={`w-full ${C.endDutyButtonClass} transition-opacity duration-150 ${isFinishVisible ? "opacity-100" : "opacity-0"}`}
                >
                  本日の乗務を終了
                </button>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-x-0 top-0 z-30"
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

            <div className="flex justify-center -mt-2">
              <button
                type="button"
                onClick={toggleStandbySheet}
                onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
                onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
                className="w-[58px] h-[58px] rounded-full bg-white/96 border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.14)] flex items-center justify-center active:scale-[0.97]"
                aria-label={isStandbySheetOpened ? "その他を下げる" : "その他を戻す"}
              >
                <span className="text-[28px] leading-none font-bold text-slate-500">
                  {isStandbySheetOpened ? "▽" : "△"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
})();

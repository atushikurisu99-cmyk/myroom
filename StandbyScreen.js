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

        <div className="pt-4 flex-1 min-h-0 relative">
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{ height: `${C.BOTTOM_CARD_HEIGHT + 64}px` }}
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

          <div
            className="relative z-30"
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

          <div
            className="absolute inset-x-0 z-40 flex justify-center"
            style={{ top: `${C.BOTTOM_CARD_HEIGHT - 6}px` }}
          >
            <button
              type="button"
              onClick={toggleStandbySheet}
              onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
              onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
              className="flex items-center justify-center py-1 px-3 active:opacity-80"
              aria-label={isStandbySheetOpened ? "その他を下げる" : "その他を戻す"}
            >
              <span className="text-[18px] leading-none font-bold text-slate-400">
                {isStandbySheetOpened ? "▽" : "△"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

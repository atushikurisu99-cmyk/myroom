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

    // ここは constants.js に頼らず、この画面内で固定
    const REVEAL_TOP = 110;
    const REVEAL_PANEL_HEIGHT = 170;
    const HANDLE_BOTTOM = 88;

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
          {/* 乗務終了エリア */}
          <div
            className="absolute inset-x-0 z-10 px-1"
            style={{
              top: `${REVEAL_TOP}px`,
              height: `${REVEAL_PANEL_HEIGHT}px`,
            }}
          >
            <div className="h-full rounded-[30px] bg-[#eef3f9] border border-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] px-2 pt-3 pb-3">
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

          {/* その他カード */}
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

          {/* ハンドルは固定位置 */}
          <div
            className="absolute inset-x-0 z-40 flex justify-center"
            style={{ bottom: `${HANDLE_BOTTOM}px` }}
          >
            <button
              type="button"
              onClick={toggleStandbySheet}
              onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
              onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
              className="flex flex-col items-center justify-center py-2 px-6 active:opacity-80"
            >
              <div className="w-14 h-1.5 rounded-full bg-slate-300 mb-2"></div>
              <div className="text-[13px] font-semibold text-slate-400">
                {isStandbySheetOpened ? "↑ 隠す" : "↓ 下へ"}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

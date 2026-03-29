window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function RideScreen(props) {
    const {
      pickup,
      rideStartAt,
      elapsedText,
      viaStops,
      handleDropOffTap,
      openOtherSheet,
      openHistoryModal,
      previewRecords,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleDropOffTap}
            className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)]`}
          >
            <span className={C.bigButtonText}>降車</span>
          </button>
        </div>

        <div className="pt-4 shrink-0">
          <div
            className={`${C.cardClass} px-4 py-4`}
            style={{ minHeight: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
          >
            <div className="text-[18px] font-bold text-slate-800 truncate leading-tight">
              {pickup || "未取得"}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[13px] font-semibold text-slate-500">
                  乗車時刻
                </div>
                <div className="mt-1 text-[17px] font-bold text-slate-800 leading-none">
                  {window.AppUtils.formatTime(rideStartAt)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[13px] font-semibold text-slate-500">
                  経過時間
                </div>
                <div className="mt-1 text-[17px] font-bold text-slate-800 leading-none">
                  {elapsedText}
                </div>
              </div>
            </div>

            {viaStops.length > 0 && (
              <div className="mt-3 text-[11px] font-semibold text-slate-500 truncate leading-none">
                経由あり（{viaStops.length}件）
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex-1 min-h-0 overflow-y-auto">
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
      </div>
    );
  };
})();

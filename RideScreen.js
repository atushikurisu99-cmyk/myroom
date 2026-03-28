
window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function RideScreen(props) {
    const {
      pickup,
      pickupMeta,
      rideStartAt,
      selectedPassengers,
      elapsedText,
      viaStops,
      handleDropOffTap,
      openOtherSheet,
      openHistoryModal,
      previewRecords,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="pt-4 shrink-0">
          <div className={`${C.cardClass} px-4 py-4`} style={{ minHeight: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}>
            <div className="text-[14px] font-semibold text-slate-500">乗車地</div>
            <div className="mt-1 text-[18px] font-bold text-slate-800">{pickup || '未取得'}</div>
            <div className="mt-1 text-[11px] text-slate-400">精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : '--'}</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[13px] font-semibold text-slate-500">乗車時刻</div>
                <div className="mt-1 text-[17px] font-bold text-slate-800">{window.AppUtils.formatTime(rideStartAt)}</div>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-500">人数</div>
                <div className="mt-1 text-[17px] font-bold text-slate-800">{selectedPassengers ? `${selectedPassengers}人` : ''}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold text-slate-500">経過時間</div>
                <div className="mt-1 text-[17px] font-bold text-slate-800">{elapsedText}</div>
              </div>
            </div>
            {viaStops.length > 0 && <div className="mt-3 text-xs font-semibold text-slate-500">経由あり（{viaStops.length}件）</div>}
          </div>
        </div>

        <div className="pt-4 shrink-0" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button type="button" onClick={handleDropOffTap} className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)]`}>
            <span className={C.bigButtonText}>降車</span>
          </button>
        </div>

        <div className="pt-4 flex-1 min-h-0 overflow-y-auto">
          <BottomCard openOtherSheet={openOtherSheet} openHistoryModal={openHistoryModal} previewRecords={previewRecords} />
        </div>
      </div>
    );
  };
})();

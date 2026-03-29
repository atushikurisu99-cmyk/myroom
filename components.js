window.AppComponents = (() => {
  const {
    formatMoney,
    formatTime,
    formatFullDate,
    recordType,
    formatDutyDate,
  } = window.AppUtils;

  const {
    BOTTOM_CARD_HEIGHT,
    shadowSub,
    cardClass,
  } = window.AppConstants;

  function HistoryRecordCard({ record, onClick }) {
    const type = recordType(record);

    return (
      <button
        type="button"
        onClick={() => onClick(record)}
        className={`w-full text-left rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50 ${shadowSub}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl font-bold text-slate-800">
              {formatMoney(record.金額)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatTime(record.乗車時刻)} → {formatTime(record.降車時刻)}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div
              className={`inline-flex min-w-[34px] justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
                type === "1"
                  ? "bg-sky-100 text-sky-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {type === "1" ? "①" : "②"}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {type === "1" ? "現金" : "カード・QR / 領収証"}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-1 text-sm text-slate-600">
          <div className="truncate">乗車地：{record.乗車地 || "未取得"}</div>
          <div className="truncate">降車地：{record.降車地 || "未取得"}</div>
          {record.備考 ? (
            <div className="truncate text-xs text-slate-500">
              備考：{record.備考}
            </div>
          ) : null}
          <div className="truncate text-xs text-slate-400">
            乗務日：{formatFullDate(record.乗務日 || record.乗車時刻)}
          </div>
        </div>
      </button>
    );
  }

  function PreviewHistoryRows({ previewRecords }) {
    if (!previewRecords || previewRecords.length === 0) {
      return (
        <div className="px-4 py-8 text-sm text-slate-400">
          まだ履歴はありません
        </div>
      );
    }

    return previewRecords.slice(0, 3).map((record, index) => {
      const isPeek = index === 2;
      return (
        <div
          key={record.id}
          className={`px-4 border-b last:border-b-0 border-slate-100 ${
            isPeek ? "py-2 h-[30px] overflow-hidden opacity-70" : "py-3"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-[15px] font-normal text-slate-700">
              {formatMoney(record.金額)}
            </div>
            <div className="text-xs text-slate-500 shrink-0">
              {recordType(record) === "1" ? "①" : "②"}
            </div>
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {formatTime(record.乗車時刻)} → {formatTime(record.降車時刻)}
          </div>

          {!isPeek && (
            <div className="mt-1 text-[11px] text-slate-400 truncate">
              {record.乗車地 || "未取得"} → {record.降車地 || "未取得"}
            </div>
          )}
        </div>
      );
    });
  }

  function BottomCard(props) {
    const {
      openOtherSheet,
      openHistoryModal,
      previewRecords,
      totalAmount,
      movable = false,
      standbySheetOffset = 0,
      toggleStandbySheet,
      beginStandbySheetDrag,
    } = props;

    const safeBottom = "max(12px, env(safe-area-inset-bottom))";
    const panelStyle = movable
      ? {
          position: "absolute",
          inset: 0,
          transform: `translateY(${standbySheetOffset}px)`,
          transition: "transform 180ms ease",
          zIndex: 10,
        }
      : {};

    const startMouseDrag = (e) => {
      if (!movable || !beginStandbySheetDrag) return;
      beginStandbySheetDrag(e.clientY);
    };

    const startTouchDrag = (e) => {
      if (!movable || !beginStandbySheetDrag) return;
      beginStandbySheetDrag(e.touches[0].clientY);
    };

    return (
      <div className="shrink-0 pt-3" style={{ paddingBottom: safeBottom, ...panelStyle }}>
        <div
          className={`${cardClass} overflow-hidden flex flex-col bg-white h-full relative`}
          style={{ minHeight: `${BOTTOM_CARD_HEIGHT}px` }}
        >
          <div className="px-4 pt-3 pb-2 shrink-0 bg-white">
            <div className="relative flex items-center justify-center h-[22px]">
              <div
                className="w-14 h-1.5 rounded-full bg-slate-200"
                onMouseDown={startMouseDrag}
                onTouchStart={startTouchDrag}
              />
              {movable ? (
                <button
                  type="button"
                  onClick={toggleStandbySheet}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-[22px] font-black text-slate-500 leading-none px-1"
                  aria-label="開閉"
                >
                  {standbySheetOffset > 90 ? "▽" : "△"}
                </button>
              ) : null}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={openOtherSheet}
                className="text-sm font-medium text-slate-400 active:text-slate-600"
              >
                その他
              </button>

              <div className="text-[18px] font-extrabold text-slate-800">
                売上 {formatMoney(totalAmount)}
              </div>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={openHistoryModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openHistoryModal();
            }}
            className="flex-1 min-h-0 bg-white active:bg-slate-50"
          >
            <div className="h-full overflow-y-auto">
              <PreviewHistoryRows previewRecords={previewRecords} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryModal }) {
    if (!show) return null;

    return (
      <div
        className="fixed inset-0 z-[9999] bg-slate-900/40 flex items-end justify-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm rounded-t-[28px] bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          <div className="px-4 pt-3 pb-4 bg-white">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>

            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-slate-800">その他</div>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                閉じる
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50 bg-white"
              >
                分析
              </button>
              <button
                type="button"
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50 bg-white"
              >
                設定
              </button>
              <button
                type="button"
                onClick={openHistoryModal}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 active:bg-slate-50 bg-white"
              >
                履歴
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PaymentDialog(props) {
    const {
      amount,
      pickupMeta,
      dropoffMeta,
      paymentCountdown,
      paymentLabel,
      onCancel,
    } = props;

    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[34px] font-black text-slate-800 tracking-[-0.04em]">
            {formatMoney(amount)}
          </div>

          <div className="mt-3 text-[17px] font-bold text-slate-700">
            {paymentLabel}
          </div>

          <div className="mt-5 text-[22px] font-black text-slate-800">
            保存まで {paymentCountdown}…
          </div>

          <div className="mt-3 text-sm text-slate-500">
            乗車位置精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
            <br />
            降車位置精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="min-w-[92px] h-[44px] rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ViaDialog({ pendingViaPlace, onCancel, onRecord }) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[18px] font-bold text-slate-800">
            現在地を経由地として記録します
          </div>
          <div className="mt-3 text-sm text-slate-500 truncate">
            {pendingViaPlace || "未取得"}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onRecord}
              className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold"
            >
              記録
            </button>
          </div>
        </div>
      </div>
    );
  }

  function FinishDialog(props) {
    const {
      workDate,
      recordCount,
      totalAmount,
      onCancel,
      onConfirm,
    } = props;

    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[20px] font-bold text-slate-800">
            {formatDutyDate(workDate)}の乗務を終了しますか？
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <div>乗車回数：{recordCount}回</div>
            <div>売上合計：{formatMoney(totalAmount)}</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold"
            >
              乗務終了
            </button>
          </div>
        </div>
      </div>
    );
  }

  return {
    HistoryRecordCard,
    PreviewHistoryRows,
    BottomCard,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
  };
})();

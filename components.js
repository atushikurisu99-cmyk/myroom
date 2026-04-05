window.AppComponents = (() => {
  const {
    formatMoney,
    formatTime,
    formatFullDate,
    formatDutyDate,
    recordType,
    getWeatherIcon,
  } = window.AppUtils;
  const C = window.AppConstants;

  function WeatherMiniPair({ weather }) {
    const base = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(base.getDate() + 1);

    const items = [
      {
        label: `${base.getMonth() + 1}/${base.getDate()}`,
        icon: getWeatherIcon(weather?.nowKind || "unknown"),
      },
      {
        label: `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`,
        icon: getWeatherIcon(weather?.tomorrowKind || "unknown"),
      },
    ];

    return (
      <div className="flex items-start gap-5 pt-[6px]">
        {items.map((item) => (
          <div key={item.label} className="w-[36px] shrink-0">
            <div className="text-[10px] leading-none font-semibold text-slate-500">
              {item.label}
            </div>
            <div className="mt-[5px] text-[21px] leading-none">{item.icon}</div>
          </div>
        ))}
      </div>
    );
  }

  function HeaderCard({
    timeParts,
    cardMode,
    weather,
    totalAmount,
    recordCount,
    amount1,
    amount2,
  }) {
    return (
      <div className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0 overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="flex items-start justify-between gap-4 shrink-0 pt-[4px]">
            <div className="min-w-0">
              <WeatherMiniPair weather={weather} />
            </div>

            <div className="shrink-0 text-right pt-[4px]">
              <div className="flex items-center justify-end text-[58px] leading-[0.9] font-black tracking-[-0.05em] text-slate-800">
                <span>{timeParts.hh}</span>
                <span
                  className={`${
                    timeParts.showColon ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-150 mx-[-0.08em]`}
                >
                  ：
                </span>
                <span>{timeParts.mm}</span>
              </div>
            </div>
          </div>

          {cardMode === 1 ? (
            <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
              <div className="text-[12px] font-medium text-slate-500">売上合計</div>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div className="text-[16px] leading-none font-normal text-slate-600">
                  {formatMoney(totalAmount)}
                </div>
                <div className="text-[12px] leading-none font-normal text-slate-500">
                  {recordCount}件
                </div>
              </div>
            </div>
          ) : cardMode === 2 ? (
            <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
              <div className="text-[12px] font-medium text-slate-500">売上目標達成率</div>
              <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
                -- %
              </div>
            </div>
          ) : cardMode === 3 ? (
            <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
              <div className="text-[12px] font-medium text-slate-500">今日のペース</div>
              <div className="mt-1 text-[16px] leading-none font-normal text-[#00a676]">
                良好
              </div>
            </div>
          ) : cardMode === 4 ? (
            <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
              <div className="text-[12px] font-medium text-slate-500">① 売上</div>
              <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
                {formatMoney(amount1)}
              </div>
            </div>
          ) : (
            <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
              <div className="text-[12px] font-medium text-slate-500">② 売上</div>
              <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
                {formatMoney(amount2)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function RideInfoCard({ pickup, rideStartAt, elapsedText, viaStops }) {
    return (
      <div className={`${C.cardClass} h-full px-4 py-4 overflow-hidden`}>
        <div className="text-[18px] font-bold text-slate-800 truncate leading-tight">
          {pickup || "未取得"}
        </div>

        <div className="mt-[8px] grid grid-cols-2 gap-4">
          <div>
            <div className="text-[13px] font-semibold text-slate-500">乗車時刻</div>
            <div className="mt-[1px] text-[17px] font-bold text-slate-800 leading-none">
              {formatTime(rideStartAt)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[13px] font-semibold text-slate-500">経過時間</div>
            <div className="mt-[1px] text-[17px] font-bold text-slate-800 leading-none">
              {elapsedText}
            </div>
          </div>
        </div>

        {viaStops.length > 0 && (
          <div className="mt-[7px] text-[11px] font-semibold text-slate-500 truncate leading-none">
            経由あり（{viaStops.length}件）
          </div>
        )}
      </div>
    );
  }

  function HistoryRecordCard({ record, onClick }) {
    const type = recordType(record);

    return (
      <button
        type="button"
        onClick={() => onClick(record)}
        className={`w-full text-left rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50 ${C.shadowSub}`}
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
            <div className="truncate text-xs text-slate-500">備考：{record.備考}</div>
          ) : null}
          <div className="truncate text-xs text-slate-400">
            乗務日：{formatFullDate(record.乗務日 || record.乗車時刻)}
          </div>
        </div>
      </button>
    );
  }

  function HomeBottomCard({ visible, onFinish }) {
    return (
      <div
        className={`absolute left-0 right-0 z-20 transition-transform duration-200 ease-out ${
          visible ? "translate-y-0" : "translate-y-[130%]"
        }`}
        style={{ bottom: `${C.BOTTOM_NAV_HEIGHT + 10}px` }}
      >
        <div className={`${C.cardClass} h-[${C.HOME_BOTTOM_CARD_HEIGHT}px] mx-0 px-4 py-4`}>
          <button
            type="button"
            onClick={onFinish}
            className={`${C.endDutyButtonClass} w-full h-[52px]`}
          >
            <span className="text-[18px] font-bold tracking-[-0.02em]">
              本日の乗務を終了
            </span>
          </button>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openFullHistory, openExpense, expenseEnabled }) {
    if (!show) return null;

    return (
      <div
        className="absolute inset-0 z-40 bg-slate-900/40 flex items-end"
        onClick={onClose}
      >
        <div
          className="w-full rounded-t-[28px] bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-3 pb-4">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-slate-800">メニュー</div>
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
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                分析
              </button>

              <button
                type="button"
                onClick={openExpense}
                disabled={!expenseEnabled}
                className={`w-full px-4 py-4 text-left text-base font-semibold border-b border-slate-100 ${
                  expenseEnabled
                    ? "text-slate-800 active:bg-slate-50"
                    : "text-slate-300 cursor-default"
                }`}
              >
                経費
              </button>

              <button
                type="button"
                onClick={openFullHistory}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 active:bg-slate-50"
              >
                履歴
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PaymentDialog({
    amount,
    pickupMeta,
    dropoffMeta,
    paymentCountdown,
    savingDots,
    onCancel,
  }) {
    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[34px] font-black text-slate-800 tracking-[-0.04em]">
            {formatMoney(amount)}
          </div>
          <div className="mt-5 text-[18px] font-bold text-slate-800">
            {paymentCountdown > 0.5
              ? `自動保存中${"・".repeat(Math.max(0, savingDots))}`
              : "保存中"}
          </div>
          <div className="mt-3 text-sm text-slate-500">
            乗車位置精度：
            {pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
            <br />
            降車位置精度：
            {dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
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
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
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

  function FinishDialog({ workDate, recordCount, totalAmount, onCancel, onConfirm }) {
    return (
      <div className="absolute inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
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
              本日の乗務を終了
            </button>
          </div>
        </div>
      </div>
    );
  }

  function BottomNav({ mode, onHome, onCenter, onMenu }) {
    const centerLabel = mode === "home" ? "経費" : "履歴";

    return (
      <div
        className="absolute left-0 right-0 bottom-0 z-30"
        style={{ height: `${C.BOTTOM_NAV_HEIGHT}px` }}
      >
        <div className={`${C.cardClass} h-full rounded-[26px] px-3 py-3 flex items-center gap-3`}>
          <button
            type="button"
            onClick={onHome}
            className="flex-1 h-full rounded-[18px] bg-slate-100 text-slate-700 text-[15px] font-bold active:scale-[0.985]"
          >
            ホーム
          </button>

          <button
            type="button"
            onClick={onCenter}
            className="flex-1 h-full rounded-[18px] bg-slate-800 text-white text-[15px] font-bold active:scale-[0.985]"
          >
            {centerLabel}
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="flex-1 h-full rounded-[18px] bg-slate-100 text-slate-700 text-[15px] font-bold active:scale-[0.985]"
          >
            メニュー
          </button>
        </div>
      </div>
    );
  }

  function ExpenseModal({ show, onClose }) {
    if (!show) return null;

    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-end">
        <div className="w-full h-[54svh] rounded-t-[28px] bg-white shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-slate-800">経費</div>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                閉じる
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <div className={`${C.cardClass} p-4`}>
              <div className="text-base font-bold text-slate-800">今回は導線のみ実装</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">
                経費画面の本格実装は後回しです。
                <br />
                ここは後から差し替えやすいように、暫定の入れ物だけ用意しています。
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return {
    HeaderCard,
    RideInfoCard,
    HistoryRecordCard,
    HomeBottomCard,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
    BottomNav,
    ExpenseModal,
  };
})();

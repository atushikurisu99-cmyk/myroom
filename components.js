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

  function PreviewHistoryRows({ previewRecords }) {
    const rows =
      previewRecords.length > 0 ? previewRecords : [{ id: "empty", empty: true }];

    return (
      <div
        className="overflow-y-auto overscroll-contain"
        style={{
          height: `${C.previewViewportHeight}px`,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none;}`}</style>
        <div className="hide-scrollbar">
          {rows.map((record) =>
            record.empty ? (
              <div
                key={record.id}
                className="flex items-center justify-center px-4 text-sm text-slate-400"
                style={{ height: `${C.previewRowHeight * 2.5}px` }}
              >
                まだ履歴はありません
              </div>
            ) : (
              <div
                key={record.id}
                className="px-4 py-3 border-b last:border-b-0 border-slate-100 overflow-hidden"
                style={{ height: `${C.previewRowHeight}px` }}
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
                <div className="mt-1 text-[11px] text-slate-400 truncate">
                  {record.乗車地 || "未取得"} → {record.降車地 || "未取得"}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  function BottomCard({
    movable = false,
    standbySheetOffset = 0,
    dragging = false,
    onFinish,
  }) {
    const translateStyle = movable
      ? {
          transform: `translateY(${standbySheetOffset}px)`,
          transition: dragging ? "none" : "transform 160ms linear",
          willChange: "transform",
        }
      : {};

    return (
      <div className="shrink-0" style={translateStyle}>
        <div style={{ height: `${C.BOTTOM_CARD_HEIGHT}px` }}>
          <div className={`${C.cardClass} h-full flex items-end justify-center pb-10`}>
            <button
              onClick={onFinish}
              className={C.endDutyButtonClass}
              style={{ width: "260px", height: "50px" }}
            >
              本日の乗務を終了
            </button>
          </div>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryModal }) {
    if (!show) return null;

    return (
      <div
        className="absolute inset-0 z-30 bg-slate-900/40 flex items-end"
        onClick={onClose}
      >
        <div
          className="w-full rounded-t-[28px] bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-3 pb-4">
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
              <button className="w-full px-4 py-4 text-left font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50">分析</button>
              <button className="w-full px-4 py-4 text-left font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50">設定</button>
              <button onClick={openHistoryModal} className="w-full px-4 py-4 text-left font-semibold text-slate-800 active:bg-slate-50">履歴</button>
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
    PreviewHistoryRows,
    BottomCard,
    OtherSheet,
  };
})();

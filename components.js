window.AppComponents = (() => {
  const Utils = window.AppUtils || {};

  const formatMoney =
    Utils.formatMoney || ((value) => `¥${Number(value || 0).toLocaleString("ja-JP")}`);
  const formatTime =
    Utils.formatTime ||
    ((dateValue) => {
      if (!dateValue) return "";
      return new Date(dateValue).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });
  const formatFullDate =
    Utils.formatFullDate ||
    ((dateValue) => {
      const d = new Date(dateValue);
      const week = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
      return `${d.getMonth() + 1}/${d.getDate()}（${week}）`;
    });
  const formatDutyDate =
    Utils.formatDutyDate ||
    ((dateValue) => {
      if (!dateValue) return "";
      const d = new Date(dateValue);
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    });
  const recordType =
    Utils.recordType ||
    ((record) => (record.payment === "cash" && !record.receipt ? "1" : "2"));
  const getWeatherIcon =
    Utils.getWeatherIcon ||
    ((kind) => {
      if (kind === "clear") return "☀️";
      if (kind === "partlyCloudy") return "⛅";
      if (kind === "cloudy") return "☁️";
      if (kind === "fog") return "🌫️";
      if (kind === "rain") return "🌧️";
      if (kind === "snow") return "❄️";
      if (kind === "thunder") return "⛈️";
      return "・";
    });

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
            <div className="text-[10px] leading-none font-semibold text-white/90">
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
    weather,
    totalAmount,
    recordCount,
    title = "累計＋乗務分",
    subLabel = "乗務開始ぱたん",
    green = "#32cd32",
  }) {
    return (
      <div
        className="h-[172px] px-4 py-4 shrink-0 overflow-hidden rounded-[28px]"
        style={{
          background: green,
          boxShadow: "0 8px 16px rgba(0,0,0,0.10)",
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-start justify-between gap-4 shrink-0 pt-[2px]">
            <div className="min-w-0">
              <WeatherMiniPair weather={weather} />
            </div>

            <div className="shrink-0 text-right pt-[2px]">
              <div className="flex items-center justify-end text-[58px] leading-[0.9] font-black tracking-[-0.05em] text-slate-900">
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

          <div className="mt-3 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-white/95">{title}</div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div className="text-[16px] leading-none font-normal text-white">
                {formatMoney(totalAmount)}
              </div>
              <div className="text-[12px] leading-none font-normal text-white/90">
                {recordCount}件
              </div>
            </div>

            <div className="mt-4 rounded-[24px] bg-white/95 h-[74px] flex items-center justify-center text-[13px] text-slate-500">
              {subLabel}
            </div>
          </div>
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

  function BottomCard({ show, onFinish }) {
    if (!show) return null;

    return (
      <div
        className="absolute left-0 right-0 z-20"
        style={{ bottom: "90px" }}
      >
        <div className={`${C.cardClass} px-4 py-4`}>
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

  function GraphEntryGrid() {
    const items = ["売上", "ペース", "時間帯", "件数", "単価", "比較"];

    return (
      <div className="grid grid-cols-3 gap-3">
        {items.map((label) => (
          <button
            key={label}
            type="button"
            className="h-[82px] rounded-[18px] border border-slate-200 bg-[#e6e6fa] text-[12px] font-semibold text-slate-500 active:scale-[0.985]"
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  function BottomNav({ centerLabel, onHome, onCenter, onMenu }) {
    return (
      <div
        className="absolute left-0 right-0 bottom-0 z-30 rounded-[26px] px-3 py-3"
        style={{
          height: "82px",
          background: "#9bd356",
          boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div className="h-full grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onHome}
            className="rounded-[18px] bg-transparent text-white text-[15px] font-bold active:scale-[0.985]"
          >
            ホーム
          </button>

          <button
            type="button"
            onClick={onCenter}
            className="rounded-[999px] bg-[#89c73f] text-white text-[17px] font-bold active:scale-[0.985]"
          >
            {centerLabel}
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="rounded-[18px] bg-transparent text-white text-[15px] font-bold active:scale-[0.985]"
          >
            メニュー
          </button>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryModal }) {
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
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                設定
              </button>
              <button
                type="button"
                onClick={openHistoryModal}
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

  return {
    HeaderCard,
    RideInfoCard,
    HistoryRecordCard,
    BottomCard,
    GraphEntryGrid,
    BottomNav,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
  };
})();

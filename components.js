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

  const NAV_BAND = "#32CD32";
  const NAV_ACTIVE = "#33CC6D";

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

  function HomeGraphCards() {
    const cards = [
      { title: "売上", sub: "グラフ" },
      { title: "本数", sub: "推移" },
      { title: "時間帯", sub: "動き" },
      { title: "分析", sub: "入口" },
    ];

    return (
      <div className="grid grid-cols-2 gap-3 h-full">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            className="rounded-[24px] border border-slate-200 bg-slate-100/80 active:bg-slate-200/70 text-left px-4 py-4 overflow-hidden"
          >
            <div className="text-[16px] font-bold text-slate-600">{card.title}</div>
            <div className="mt-1 text-[12px] font-semibold text-slate-400">{card.sub}</div>
          </button>
        ))}
      </div>
    );
  }

  function HomeIconSvg({ color = "#ffffff" }) {
    return (
      <svg width="29" height="29" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M11 29.5L32 12L53 29.5"
          stroke={color}
          strokeWidth="5.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 27.5V50.5C17.5 52.4 19.1 54 21 54H28.7V39.7C28.7 37.9 30.2 36.4 32 36.4C33.8 36.4 35.3 37.9 35.3 39.7V54H43C44.9 54 46.5 52.4 46.5 50.5V27.5"
          fill={color}
        />
      </svg>
    );
  }

  function MenuGridSvg({ color = "#ffffff" }) {
    const dots = [
      [13, 13],
      [24, 13],
      [35, 13],
      [13, 24],
      [24, 24],
      [35, 24],
      [13, 35],
      [24, 35],
      [35, 35],
    ];
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        {dots.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill={color} />
        ))}
      </svg>
    );
  }

  function EyeIconSvg({ open = true }) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2.1 12C4.1 8.6 7.8 6.4 12 6.4C16.2 6.4 19.9 8.6 21.9 12C19.9 15.4 16.2 17.6 12 17.6C7.8 17.6 4.1 15.4 2.1 12Z"
          stroke="#ffffff"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="2.8" fill="#ffffff" />
        {!open && (
          <path
            d="M4.2 19.2L19.8 4.8"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  function StartHeader({
    timeParts,
    progressAmount,
    progressVisible,
    onToggleVisible,
  }) {
    const displayText = progressVisible
      ? formatMoney(progressAmount || 0)
      : "●●●,●●●円";

    return (
      <div className="h-[172px] px-4 pt-4 pb-3 shrink-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex items-start justify-end pt-[6px]">
            <div className="text-right">
              <div className="flex items-center justify-end text-[58px] leading-[0.9] font-black tracking-[-0.05em] text-white">
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

          <div className="mt-auto pb-[4px]">
            <div className="text-[12px] leading-none font-semibold text-white/90">
              当月達成売上
            </div>
            <div className="mt-[7px] flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 text-[23px] leading-none font-black tracking-[-0.03em] text-white truncate">
                {displayText}
              </div>

              <button
                type="button"
                onClick={onToggleVisible}
                className="shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full active:scale-[0.96]"
                aria-label={progressVisible ? "金額を隠す" : "金額を表示"}
              >
                <EyeIconSvg open={progressVisible} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function BottomNav({
    centerLabel,
    onHome,
    onCenter,
    onMenu,
    active = "home",
  }) {
    const activeLeft =
      active === "home" ? "16.6667%" : active === "center" ? "50%" : "83.3333%";

    const iconColor = "#ffffff";
    const textColor = "#ffffff";

    return (
      <div className="h-full relative">
        <div
          className="absolute left-0 right-0 bottom-0 rounded-t-[24px]"
          style={{
            height: "60px",
            background: NAV_BAND,
          }}
        />

        <div
          className="absolute top-[8px] w-[74px] h-[74px] rounded-full pointer-events-none"
          style={{
            left: activeLeft,
            transform: "translateX(-50%)",
            background: NAV_ACTIVE,
          }}
        />

        <div className="absolute inset-0 grid grid-cols-3">
          <button
            type="button"
            onClick={onHome}
            className="relative active:opacity-90"
            aria-label="ホーム"
          >
            <div className="absolute left-1/2 top-[33px] -translate-x-1/2 -translate-y-1/2">
              <HomeIconSvg color={iconColor} />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 text-[11px] leading-none font-bold whitespace-nowrap"
              style={{ bottom: "12px", color: textColor }}
            >
              ホーム
            </div>
          </button>

          <button
            type="button"
            onClick={onCenter}
            className="relative active:opacity-90"
            aria-label={centerLabel}
          >
            <div className="absolute left-1/2 top-[33px] -translate-x-1/2 -translate-y-1/2">
              <div className="text-[15px] leading-none font-bold tracking-[0.03em] text-white whitespace-nowrap">
                {centerLabel}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="relative active:opacity-90"
            aria-label="メニュー"
          >
            <div className="absolute left-1/2 top-[33px] -translate-x-1/2 -translate-y-1/2">
              <MenuGridSvg color={iconColor} />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 text-[11px] leading-none font-bold whitespace-nowrap"
              style={{ bottom: "12px", color: textColor }}
            >
              メニュー
            </div>
          </button>
        </div>
      </div>
    );
  }

  function HomeEndDutySheet({
    open,
    dutyStarted,
    onFinishTap,
  }) {
    const sheetHeight = C.HOME_END_SHEET_HEIGHT;
    const hiddenTranslate = sheetHeight + 24;

    return (
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: `${sheetHeight}px` }}
      >
        <div
          className="h-full rounded-t-[28px] bg-white border border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.12)] flex items-center justify-center px-5 pointer-events-auto"
          style={{
            transform: `translateY(${open ? 0 : hiddenTranslate}px)`,
            transition: "transform 260ms cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform",
          }}
        >
          <button
            type="button"
            onClick={onFinishTap}
            disabled={!dutyStarted}
            className={`${C.endDutyButtonClass} ${
              dutyStarted ? "opacity-100" : "opacity-45"
            }`}
            style={{
              width: "268px",
              height: "46px",
            }}
          >
            <span className="text-[17px] font-bold tracking-[-0.02em]">
              本日の乗務を終了
            </span>
          </button>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryFull, onShowSoon }) {
    if (!show) return null;

    return (
      <div
        className="absolute inset-0 z-30 bg-slate-900/40 flex items-end"
        onClick={onClose}
      >
        <div
          className="w-full rounded-t-[28px] bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "otherSheetUp 220ms cubic-bezier(0.22,1,0.36,1)",
          }}
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
                onClick={onShowSoon}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                分析
              </button>
              <button
                type="button"
                onClick={onShowSoon}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                設定
              </button>
              <button
                type="button"
                onClick={openHistoryFull}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 active:bg-slate-50"
              >
                履歴
              </button>
            </div>
          </div>

          <style>{`
            @keyframes otherSheetUp {
              0% { transform: translateY(100%); }
              100% { transform: translateY(0); }
            }
          `}</style>
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
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
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
    HomeGraphCards,
    BottomNav,
    HomeEndDutySheet,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
    StartHeader,
  };
})();

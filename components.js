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

  const GREEN_MAIN = "#9ED36A";
  const GREEN_SUB = "#7FC84E";
  const GREEN_CIRCLE = "#92CD4C";
  const END_GREEN = "#375f1d";

  function formatPlainNumber(value) {
    return `${Number(value || 0).toLocaleString("ja-JP")}`;
  }

  function AppFrame({ children }) {
    return (
      <div className="w-full h-full max-w-sm mx-auto relative overflow-hidden bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)]">
        {children}
      </div>
    );
  }

  function HomeFilledIcon({ className = "" }) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 31.5 32 10l24 21.5c1.7 1.6.7 4.5-1.7 4.5H49V54a2 2 0 0 1-2 2H37a2 2 0 0 1-2-2V43h-6v11a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V36H9.7C7.3 36 6.3 33.1 8 31.5Z"
        />
      </svg>
    );
  }

  function MenuDotsFilledIcon({ className = "" }) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        {[14, 32, 50].map((cx) =>
          [14, 32, 50].map((cy) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5.3} fill="currentColor" />
          ))
        )}
      </svg>
    );
  }

  function EyeToggleIcon({ hidden = false, className = "" }) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path
          d="M6 32c5.8-9.3 15.3-14 26-14s20.2 4.7 26 14c-5.8 9.3-15.3 14-26 14S11.8 41.3 6 32Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="32"
          cy="32"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
        />
        {hidden && (
          <path
            d="M13 51 51 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

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
      <div className="flex items-start gap-5 pt-[10px]">
        {items.map((item) => (
          <div key={item.label} className="w-[38px] shrink-0">
            <div className="text-[10px] leading-none font-semibold text-slate-500">
              {item.label}
            </div>
            <div className="mt-[5px] text-[22px] leading-none">{item.icon}</div>
          </div>
        ))}
      </div>
    );
  }

  function ClockDigits({ timeParts, dark = false }) {
    return (
      <div
        className={`flex items-center justify-end text-[58px] leading-[0.88] font-black tracking-[-0.05em] ${
          dark ? "text-black" : "text-slate-800"
        }`}
      >
        <span>{timeParts?.hh || "00"}</span>
        <span
          className={`${
            timeParts?.showColon ? "opacity-100" : "opacity-0"
          } transition-opacity duration-150 mx-[-0.08em]`}
        >
          ：
        </span>
        <span>{timeParts?.mm || "00"}</span>
      </div>
    );
  }

  function HomeAmountRow({
    homeDisplayAmount,
    isHomeAmountVisible,
    toggleHomeAmountVisible,
  }) {
    const numberText = formatPlainNumber(homeDisplayAmount);

    return (
      <div className="mt-[14px] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {isHomeAmountVisible ? (
            <div className="w-[266px] max-w-full flex justify-end">
              <div className="inline-flex items-end text-white whitespace-nowrap">
                <div className="text-[40px] leading-none font-bold tracking-[-0.03em]">
                  {numberText}
                </div>
                <div className="ml-[2px] text-[34px] leading-none font-normal">円</div>
              </div>
            </div>
          ) : (
            <div className="w-[266px] max-w-full flex justify-end">
              <div className="text-[40px] leading-none font-bold tracking-[-0.03em] text-white whitespace-nowrap">
                ーーー
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleHomeAmountVisible}
          className="shrink-0 w-[34px] h-[34px] flex items-center justify-center text-white/95 active:opacity-80"
          aria-label={isHomeAmountVisible ? "金額を非表示" : "金額を表示"}
        >
          <EyeToggleIcon hidden={!isHomeAmountVisible} className="w-[28px] h-[28px]" />
        </button>
      </div>
    );
  }

  function HomeTopHeader({
    timeParts,
    homeDisplayAmount,
    isHomeAmountVisible,
    toggleHomeAmountVisible,
  }) {
    return (
      <div className="h-full w-full px-[30px] pt-[22px] pb-[16px] flex flex-col justify-between">
        <div className="flex items-start justify-end">
          <ClockDigits timeParts={timeParts} dark />
        </div>

        <div className="min-h-0">
          <div className="text-[12px] leading-none font-semibold text-white/95">
            累計＋乗務分
          </div>

          <HomeAmountRow
            homeDisplayAmount={homeDisplayAmount}
            isHomeAmountVisible={isHomeAmountVisible}
            toggleHomeAmountVisible={toggleHomeAmountVisible}
          />
        </div>
      </div>
    );
  }

  function WhiteStatusHeader({
    timeParts,
    cardMode,
    weather,
    totalAmount,
    recordCount,
    amount1,
    amount2,
  }) {
    return (
      <div className={`${C.cardClass} h-full px-[16px] py-[16px] overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="flex items-start justify-between gap-4 shrink-0">
            <div className="min-w-0">
              <WeatherMiniPair weather={weather} />
            </div>

            <div className="shrink-0 text-right pt-[6px] pr-[0px]">
              <ClockDigits timeParts={timeParts} />
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

  function HeaderCard(props) {
    const {
      screen,
      timeParts,
      cardMode,
      weather,
      totalAmount,
      recordCount,
      amount1,
      amount2,
      homeDisplayAmount,
      isHomeAmountVisible = true,
      toggleHomeAmountVisible = () => {},
    } = props;

    if (screen === "top") {
      return (
        <div className="h-full w-full">
          <HomeTopHeader
            timeParts={timeParts}
            homeDisplayAmount={homeDisplayAmount}
            isHomeAmountVisible={isHomeAmountVisible}
            toggleHomeAmountVisible={toggleHomeAmountVisible}
          />
        </div>
      );
    }

    return (
      <div className="h-full w-full px-[14px] pt-[18px] pb-[14px]">
        <WhiteStatusHeader
          timeParts={timeParts}
          cardMode={cardMode}
          weather={weather}
          totalAmount={totalAmount}
          recordCount={recordCount}
          amount1={amount1}
          amount2={amount2}
        />
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

  function BottomNav({
    centerLabel,
    onHome,
    onCenter,
    onMenu,
    activeArea = "home",
  }) {
    const bubbleCenterMap = {
      home: "16.6667%",
      center: "50%",
      menu: "83.3333%",
    };

    const activeCenter = bubbleCenterMap[activeArea] || bubbleCenterMap.center;
    const safeInset = "env(safe-area-inset-bottom, 0px)";
    const visibleBandHeight = 56;

    const homeStrong = activeArea === "home";
    const centerStrong = activeArea === "center";
    const menuStrong = activeArea === "menu";

    return (
      <div className="h-full relative overflow-visible">
        <div
          className="absolute inset-x-0 bottom-0 rounded-t-[24px]"
          style={{
            background: GREEN_MAIN,
            height: `calc(${visibleBandHeight}px + ${safeInset})`,
          }}
        />

        <div
          className="absolute w-[94px] h-[94px] rounded-full z-10 transition-[left] duration-250 ease-out"
          style={{
            left: activeCenter,
            top: "-10px",
            transform: "translateX(-50%)",
            background: GREEN_CIRCLE,
            boxShadow: "0 8px 16px rgba(0,0,0,0.10)",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 z-20 grid grid-cols-3"
          style={{
            height: `calc(100% + ${safeInset})`,
            paddingBottom: safeInset,
          }}
        >
          <button
            type="button"
            onClick={onHome}
            className="h-full flex flex-col items-center justify-end pb-[10px] text-white active:opacity-85"
          >
            <HomeFilledIcon className="w-[32px] h-[32px]" />
            <div className={`mt-[5px] text-[12px] leading-none ${homeStrong ? "font-bold" : "font-semibold"}`}>
              ホーム
            </div>
          </button>

          <button
            type="button"
            onClick={onCenter}
            className="h-full flex flex-col items-center justify-end pb-[10px] text-white active:opacity-85"
          >
            <div className="w-[32px] h-[32px]" />
            <div className={`mt-[5px] text-[17px] tracking-[0.06em] leading-none ${centerStrong ? "font-bold" : "font-semibold"}`}>
              {centerLabel}
            </div>
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="h-full flex flex-col items-center justify-end pb-[10px] text-white active:opacity-85"
          >
            <MenuDotsFilledIcon className="w-[28px] h-[28px]" />
            <div className={`mt-[9px] text-[12px] leading-none ${menuStrong ? "font-bold" : "font-semibold"}`}>
              メニュー
            </div>
          </button>
        </div>
      </div>
    );
  }

  function EndDutyButton({ onClick, disabled }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full rounded-full overflow-hidden border-[5px] border-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] ${
          disabled ? "opacity-45" : "opacity-100 active:scale-[0.99]"
        }`}
        style={{
          height: "76px",
          background: END_GREEN,
        }}
      >
        <div className="h-full grid grid-cols-[72px_1fr] items-center">
          <div className="flex items-center justify-center pl-[4px]">
            <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-[34px] h-[34px]" aria-hidden="true">
                <path fill={END_GREEN} d="M8 28h24V14l24 18-24 18V36H8z" />
              </svg>
            </div>
          </div>

          <div className="text-white text-[19px] font-bold tracking-[-0.02em] text-center pr-[18px]">
            本日の乗務を終了
          </div>
        </div>
      </button>
    );
  }

  function HomeEndDutySheet({ open, dutyStarted, onFinishTap }) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="absolute inset-x-0 top-0"
          style={{
            transform: `translateY(${open ? 0 : 92}px)`,
            transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform",
          }}
        >
          <EndDutyButton onClick={onFinishTap} disabled={!dutyStarted} />
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
    AppFrame,
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
  };
})();

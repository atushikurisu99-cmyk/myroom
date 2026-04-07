window.AppComponents = (() => {
  const C = window.AppConstants;
  const U = window.AppUtils;

  const GREEN_MAIN = "#9ED36A";
  const GREEN_CIRCLE = "#8FC15A";
  const GREEN_CIRCLE_INACTIVE = "rgba(143,193,90,0.52)";

  function AppFrame({ children }) {
    return (
      <div className="w-full h-full flex justify-center bg-[#eef2f5] overflow-hidden">
        <div
          className="relative h-full w-full max-w-[430px] bg-white overflow-hidden"
          style={{ minHeight: "100dvh" }}
        >
          {children}
        </div>
      </div>
    );
  }

  function ClockText({ timeParts }) {
    const hh = timeParts?.hh || "--";
    const mm = timeParts?.mm || "--";
    const colon = timeParts?.showColon ? ":" : " ";

    return (
      <div className="flex items-end justify-center leading-none select-none">
        <span className="text-[46px] font-black tracking-[-0.04em] text-slate-800">{hh}</span>
        <span className="w-[16px] text-center text-[42px] font-black text-slate-700">
          {colon}
        </span>
        <span className="text-[46px] font-black tracking-[-0.04em] text-slate-800">{mm}</span>
      </div>
    );
  }

  function AmountEyeButton({ visible, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="ml-2 h-8 min-w-8 rounded-full bg-slate-100 px-2 text-[12px] font-bold text-slate-500 active:scale-[0.98]"
        aria-label="金額表示切替"
      >
        {visible ? "表示" : "非表示"}
      </button>
    );
  }

  function HeaderCard(props) {
    const {
      screen = "top",
      timeParts,
      cardMode,
      weather,
      totalAmount = 0,
      recordCount = 0,
      amount1 = 0,
      amount2 = 0,
      homeDisplayAmount = 0,
      isHomeAmountVisible = true,
      toggleHomeAmountVisible,
    } = props;

    const todayWeather = U.getWeatherIcon(weather?.nowKind);
    const tomorrowWeather = U.getWeatherIcon(weather?.tomorrowKind);

    return (
      <div className="w-full px-3 pt-3 pb-2">
        <div className={`${C.cardClass} h-full px-4 py-4`}>
          <div className="flex items-start justify-between gap-3 h-full">
            <div className="w-[62px] shrink-0 pt-1 text-center">
              <div className="text-[22px] leading-none">{todayWeather}</div>
              <div className="mt-2 text-[22px] leading-none">{tomorrowWeather}</div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
              <ClockText timeParts={timeParts} />

              {screen === "top" ? (
                <div className="mt-3 flex items-center justify-center min-w-0 max-w-full">
                  <div className="min-w-0 text-center">
                    <div className="text-[12px] font-semibold tracking-[0.08em] text-slate-500">
                      累計 + 乗務分
                    </div>
                    <div className="mt-1 text-[28px] font-black tracking-[-0.03em] text-slate-800 leading-none">
                      {isHomeAmountVisible
                        ? `¥${Number(homeDisplayAmount || 0).toLocaleString("ja-JP")}`
                        : "••••••"}
                    </div>
                  </div>
                  <AmountEyeButton
                    visible={isHomeAmountVisible}
                    onClick={toggleHomeAmountVisible}
                  />
                </div>
              ) : (
                <div className="mt-3 w-full max-w-[220px] rounded-[18px] bg-slate-50 px-3 py-2 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>合計</span>
                    <span>{recordCount}件</span>
                  </div>
                  <div className="mt-1 text-[24px] font-black tracking-[-0.03em] text-slate-800 leading-none text-center">
                    ¥{Number(totalAmount || 0).toLocaleString("ja-JP")}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>① ¥{Number(amount1 || 0).toLocaleString("ja-JP")}</span>
                    <span>② ¥{Number(amount2 || 0).toLocaleString("ja-JP")}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[62px] shrink-0 pt-1 text-right">
              <button
                type="button"
                onClick={() => {}}
                className="h-8 w-8 rounded-full bg-slate-100 text-[12px] font-bold text-slate-500"
                aria-label="状態表示"
              >
                {cardMode || 3}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function HomeGraphCards() {
    return (
      <div className="h-full px-3 pb-3">
        <div className="grid grid-cols-2 gap-3 h-full">
          {["売上", "ペース", "① / ②", "履歴"].map((label) => (
            <div
              key={label}
              className="rounded-[24px] border border-[#dbe5d3] bg-[#f3f7ef] shadow-[0_6px_14px_rgba(0,0,0,0.06)] flex items-center justify-center"
            >
              <span className="text-[15px] font-bold text-slate-500 tracking-[0.04em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function HomeEndDutySheet({ open, dutyStarted, onFinishTap, label = "終了前チェックへ" }) {
    if (!open || !dutyStarted) return null;

    return (
      <div className="px-3 pb-3 h-full">
        <div className="h-full rounded-[24px] border border-[#d7d7d7] bg-white shadow-[0_6px_14px_rgba(0,0,0,0.08)] p-3 flex items-center">
          <button
            type="button"
            onClick={onFinishTap}
            className={`w-full h-full ${C.endDutyButtonClass} flex items-center justify-center text-[22px] tracking-[-0.02em]`}
          >
            {label}
          </button>
        </div>
      </div>
    );
  }

  function RideInfoCard({ pickup, rideStartAt, elapsedText, viaStops }) {
    return (
      <div className="px-3 h-full">
        <div className={`${C.cardClass} h-full px-4 py-3 flex flex-col justify-center`}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-slate-500">{U.formatTime(rideStartAt)}</div>
              <div className="mt-1 text-[18px] font-bold text-slate-800 truncate">
                {pickup || "未取得"}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[12px] font-semibold text-slate-500">経過</div>
              <div className="mt-1 text-[24px] font-black text-slate-800 leading-none">
                {elapsedText || "0分"}
              </div>
            </div>
          </div>

          {viaStops?.length > 0 && (
            <div className="mt-3 rounded-[16px] bg-slate-50 border border-slate-100 px-3 py-2 text-[12px] text-slate-600 truncate">
              経由：{viaStops.join(" → ")}
            </div>
          )}
        </div>
      </div>
    );
  }

  function HistoryRecordCard({ record, item, onClick }) {
    const row = record || item || {};
    return (
      <button
        type="button"
        onClick={() => onClick?.(row)}
        className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left shadow-[0_6px_14px_rgba(0,0,0,0.06)] active:scale-[0.995]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-slate-500">
              {U.formatTime(row.乗車時刻 || row.time)} → {U.formatTime(row.降車時刻 || row.time)}
            </div>
            <div className="mt-1 text-[16px] font-bold text-slate-800 truncate">
              {(row.乗車地 || row.from || "-") + " → " + (row.降車地 || row.to || "-")}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[18px] font-black text-slate-800 leading-none">
              ¥{Number(row.金額 || row.amount || 0).toLocaleString("ja-JP")}
            </div>
            <div className="mt-2 text-[12px] font-semibold text-slate-500">
              {U.recordType(row) === "1" ? "①" : "②"}
            </div>
          </div>
        </div>
      </button>
    );
  }

  function HomeIcon() {
    return (
      <svg
        width="26"
        height="22"
        viewBox="0 0 26 22"
        aria-hidden="true"
        className="block"
      >
        <path
          d="M13 1.2L24 10.2H20.8V20.2H15.2V14.3H10.8V20.2H5.2V10.2H2L13 1.2Z"
          fill="white"
        />
      </svg>
    );
  }

  function MenuIcon() {
    const dots = Array.from({ length: 9 });
    return (
      <div
        className="grid grid-cols-3 gap-[4px] place-items-center"
        style={{ width: "22px", height: "22px" }}
        aria-hidden="true"
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="block rounded-full bg-white"
            style={{ width: "4px", height: "4px" }}
          />
        ))}
      </div>
    );
  }

  function BottomNav({ centerLabel, onHome, onCenter, onMenu, activeArea = "home" }) {
    const items = [
      {
        key: "home",
        label: "ホーム",
        onClick: onHome,
        kind: "icon+label",
        icon: <HomeIcon />,
        circleOffsetX: 0,
        clusterBottom: 16,
        iconTop: 0,
        labelTop: 25,
        labelWidth: 54,
        labelSize: 11,
        labelTracking: "0em",
      },
      {
        key: "center",
        label: centerLabel || "履歴",
        onClick: onCenter,
        kind: "labelOnly",
        icon: null,
        circleOffsetX: 0,
        clusterBottom: 19,
        iconTop: 0,
        labelTop: 7,
        labelWidth: 62,
        labelSize: 18,
        labelTracking: "-0.04em",
      },
      {
        key: "menu",
        label: "メニュー",
        onClick: onMenu,
        kind: "icon+label",
        icon: <MenuIcon />,
        circleOffsetX: 0,
        clusterBottom: 16,
        iconTop: -1,
        labelTop: 25,
        labelWidth: 58,
        labelSize: 11,
        labelTracking: "0em",
      },
    ];

    return (
      <div className="relative w-full h-full overflow-visible">
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: "52px",
            background: GREEN_MAIN,
          }}
        />

        <div className="absolute inset-0 grid grid-cols-3">
          {items.map((item) => {
            const isActive = activeArea === item.key;

            return (
              <div key={item.key} className="relative h-full">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: "82px",
                    height: "82px",
                    bottom: "7px",
                    marginLeft: `${item.circleOffsetX}px`,
                    background: isActive ? GREEN_CIRCLE : GREEN_CIRCLE_INACTIVE,
                    transition: "background 180ms ease, opacity 180ms ease",
                  }}
                />

                <button
                  type="button"
                  onClick={item.onClick}
                  className="absolute inset-0 z-10"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[86px] h-full">
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        bottom: `${item.clusterBottom}px`,
                        width: "86px",
                        height: "48px",
                      }}
                    >
                      {item.kind === "icon+label" && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
                          style={{
                            top: `${item.iconTop}px`,
                            width: "34px",
                            height: "20px",
                          }}
                        >
                          {item.icon}
                        </div>
                      )}

                      <div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
                        style={{
                          top: `${item.labelTop}px`,
                          width: `${item.labelWidth}px`,
                          height: item.kind === "icon+label" ? "14px" : "20px",
                        }}
                      >
                        <span
                          className="leading-none text-white select-none font-bold"
                          style={{
                            display: "block",
                            lineHeight: 1,
                            fontSize: `${item.labelSize}px`,
                            letterSpacing: item.labelTracking,
                            fontWeight: item.kind === "labelOnly" ? 900 : 700,
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryFull, onShowSoon }) {
    if (!show) return null;
    return (
      <div className="absolute inset-0 z-40 bg-black/30" onClick={onClose}>
        <div
          className="absolute left-3 right-3 bottom-[88px] rounded-[28px] bg-white p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[18px] font-bold text-slate-800 text-center">メニュー</div>
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={openHistoryFull}
              className="h-[52px] rounded-[18px] bg-slate-800 text-white font-bold"
            >
              履歴一覧を開く
            </button>
            <button
              type="button"
              onClick={onShowSoon}
              className="h-[52px] rounded-[18px] bg-slate-100 text-slate-700 font-bold"
            >
              準備中
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[48px] rounded-[18px] bg-slate-50 text-slate-500 font-bold"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  function PaymentDialog({ amount, paymentCountdown, savingDots, onCancel }) {
    return (
      <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
        <div className="w-full max-w-[330px] rounded-[28px] bg-white p-5 shadow-2xl">
          <div className="text-center text-[22px] font-black text-slate-800">
            ¥{Number(amount || 0).toLocaleString("ja-JP")}
          </div>
          <div className="mt-3 text-center text-[14px] text-slate-500 font-semibold">
            保存まで {Number(paymentCountdown || 0).toFixed(1)}秒
          </div>
          <div className="mt-3 text-center text-[20px] tracking-[0.25em] text-slate-400">
            {"•".repeat(Math.max(0, Math.round(savingDots || 0)))}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="mt-5 h-[48px] w-full rounded-[18px] bg-slate-100 text-slate-700 font-bold"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  function ViaDialog({ pendingViaPlace, onCancel, onRecord }) {
    return (
      <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
        <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 shadow-2xl">
          <div className="text-[18px] font-bold text-slate-800 text-center">経由地として記録しますか？</div>
          <div className="mt-4 rounded-[18px] bg-slate-50 border border-slate-100 px-4 py-3 text-[14px] text-slate-600 text-center break-words">
            {pendingViaPlace || "未取得"}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={onCancel} className="h-[48px] rounded-[18px] bg-slate-100 text-slate-700 font-bold">
              戻る
            </button>
            <button type="button" onClick={onRecord} className="h-[48px] rounded-[18px] bg-slate-800 text-white font-bold">
              記録
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SummaryRow({ label, value, onClick }) {
    const body = (
      <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-100 px-4 py-3">
        <span className="text-[14px] font-semibold text-slate-500">{label}</span>
        <span className="text-[18px] font-black text-slate-800">{value}</span>
      </div>
    );
    if (!onClick) return body;
    return (
      <button type="button" onClick={onClick} className="w-full text-left active:scale-[0.995]">
        {body}
      </button>
    );
  }

  function FinishCheckScreen(props) {
    const {
      finishLocked,
      finishPhase,
      finishSummary,
      onBack,
      onToggleLock,
      onConfirm,
      onFinalTap,
      openHistoryModalWithFilter,
    } = props;

    const isSaving = finishPhase === "saving";
    const isDone = finishPhase === "done";

    return (
      <div className="absolute inset-0 z-40 bg-white flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-[44px] px-4 rounded-[16px] bg-slate-100 text-slate-700 font-bold"
            >
              戻る
            </button>
            <div className="text-[20px] font-black text-slate-800">終了前チェック</div>
            <div className="w-[68px]" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          <div className="grid gap-3">
            <SummaryRow
              label="売上合計"
              value={`¥${Number(finishSummary?.totalAmount || 0).toLocaleString("ja-JP")}`}
              onClick={() => openHistoryModalWithFilter?.("all")}
            />
            <SummaryRow
              label="①"
              value={`¥${Number(finishSummary?.amount1 || 0).toLocaleString("ja-JP")}`}
              onClick={() => openHistoryModalWithFilter?.("1")}
            />
            <SummaryRow
              label="②"
              value={`¥${Number(finishSummary?.amount2 || 0).toLocaleString("ja-JP")}`}
              onClick={() => openHistoryModalWithFilter?.("2")}
            />
            <SummaryRow
              label="件数"
              value={`${Number(finishSummary?.recordCount || 0)}件`}
            />
            <SummaryRow
              label="人数"
              value={`${Number(finishSummary?.passengerCount || 0)}名`}
            />
            <SummaryRow
              label="営走"
              value={`${Number(finishSummary?.businessKm || 0)}km`}
            />

            {!isDone && (
              <button
                type="button"
                onClick={onToggleLock}
                className={`mt-2 h-[58px] rounded-[20px] text-[18px] font-black border ${finishLocked ? "bg-emerald-500 border-emerald-500 text-white" : "bg-slate-100 border-slate-200 text-slate-600"}`}
              >
                {finishLocked ? "ロック解除済み" : "ロック解除"}
              </button>
            )}

            {!isDone && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={!finishLocked || isSaving}
                className="h-[64px] rounded-[22px] bg-slate-800 text-white text-[22px] font-black disabled:opacity-40"
              >
                {isSaving ? "保存中…" : "スライドで終了"}
              </button>
            )}

            {isDone && (
              <button
                type="button"
                onClick={onFinalTap}
                className="h-[64px] rounded-[22px] bg-sky-500 text-white text-[22px] font-black"
              >
                タップして開始へ
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return {
    AppFrame,
    HeaderCard,
    HomeGraphCards,
    HomeEndDutySheet,
    RideInfoCard,
    HistoryRecordCard,
    BottomNav,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishCheckScreen,
  };
})();

// ===============================
// components.js 全文置き換え
// ===============================

const GREEN_MAIN = "#9ED36A";
const GREEN_CIRCLE = "#7FC84E";

// ===============================
// AppFrame
// ===============================
function AppFrame({ children }) {
  return (
    <div className="w-full h-screen flex justify-center bg-[#eef2f5]">
      <div className="w-[390px] h-full relative bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ===============================
// HeaderCard
// ===============================
function HeaderCard(props) {
  const { timeParts, screen } = props;

  const hh = timeParts?.hh || "--";
  const mm = timeParts?.mm || "--";
  const showColon = timeParts?.showColon ?? true;
  const colonOpacity = showColon ? 1 : 0.22;

  const EyeButton = ({ visible, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="mr-2 flex items-center justify-center w-[22px] h-[22px] active:opacity-70"
      aria-label="売上表示切替"
    >
      {visible ? (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <path
            d="M2.5 12C4.5 8.5 8 6.5 12 6.5S19.5 8.5 21.5 12C19.5 15.5 16 17.5 12 17.5S4.5 15.5 2.5 12Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3.2" fill="#94a3b8" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <path
            d="M2.5 12C4.5 8.5 8 6.5 12 6.5S19.5 8.5 21.5 12C19.5 15.5 16 17.5 12 17.5S4.5 15.5 2.5 12Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3.2" fill="#94a3b8" />
          <path
            d="M4 20L20 4"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );

  const renderRightBottom = () => {
    if (screen === "top") {
      const homeDisplayAmount = Number(props.homeDisplayAmount || 0);
      const isHomeAmountVisible = props.isHomeAmountVisible !== false;
      const displayText = isHomeAmountVisible
        ? homeDisplayAmount.toLocaleString("ja-JP")
        : "••••••";

      return (
        <div className="absolute right-4 bottom-4 flex items-end gap-[2px]">
          <EyeButton
            visible={isHomeAmountVisible}
            onClick={props.toggleHomeAmountVisible}
          />
          <div className="text-[42px] font-black tracking-[-0.04em] leading-none text-slate-800">
            {displayText}
          </div>
          <div className="text-[18px] font-bold leading-none text-slate-500 pb-[4px]">
            円
          </div>
        </div>
      );
    }

    const weatherNow =
      window.AppUtils?.getWeatherIcon?.(props.weather?.nowKind || "unknown") || "・";
    const weatherTomorrow =
      window.AppUtils?.getWeatherIcon?.(props.weather?.tomorrowKind || "unknown") || "・";

    const cardMode = Number(props.cardMode || 3);

    let value = "";
    let unit = "";
    let label = "";

    if (cardMode === 1) {
      value = Number(props.totalAmount || 0).toLocaleString("ja-JP");
      unit = "円";
      label = "売上合計";
    } else if (cardMode === 2) {
      value = String(Number(props.recordCount || 0));
      unit = "件";
      label = "件数";
    } else if (cardMode === 4) {
      value = Number(props.amount1 || 0).toLocaleString("ja-JP");
      unit = "円";
      label = "①";
    } else if (cardMode === 5) {
      value = Number(props.amount2 || 0).toLocaleString("ja-JP");
      unit = "円";
      label = "②";
    } else {
      value = Number(props.totalAmount || 0).toLocaleString("ja-JP");
      unit = "円";
      label = "売上合計";
    }

    return (
      <>
        <div className="absolute left-4 bottom-4 flex items-center gap-2 text-[24px]">
          <span>{weatherNow}</span>
          <span className="text-slate-400 text-[16px]">→</span>
          <span>{weatherTomorrow}</span>
        </div>

        <div className="absolute right-4 bottom-4 flex items-end gap-[2px]">
          <div className="mr-2 text-[12px] font-semibold text-slate-500 pb-[6px]">
            {label}
          </div>
          <div className="text-[38px] font-black tracking-[-0.04em] leading-none text-slate-800">
            {value}
          </div>
          <div className="text-[16px] font-bold leading-none text-slate-500 pb-[4px]">
            {unit}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-full px-3 pt-3 pb-0">
      <div className="relative h-full rounded-b-[28px] rounded-t-none bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="absolute left-1/2 top-[16px] -translate-x-1/2 flex items-center text-slate-800 select-none">
          <span className="text-[46px] font-black tracking-[-0.05em] leading-none">
            {hh}
          </span>
          <span
            className="text-[42px] font-black leading-none px-[2px] transition-opacity duration-150"
            style={{ opacity: colonOpacity }}
          >
            :
          </span>
          <span className="text-[46px] font-black tracking-[-0.05em] leading-none">
            {mm}
          </span>
        </div>

        {renderRightBottom()}
      </div>
    </div>
  );
}

// ===============================
// RideInfoCard
// ===============================
function RideInfoCard({
  pickup,
  rideStartAt,
  elapsedText,
  viaStops = [],
}) {
  const { formatTime } = window.AppUtils;

  return (
    <div className="px-3">
      <div className="rounded-[28px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-bold text-slate-800 leading-none truncate">
              {pickup || "未取得"}
            </div>
            {viaStops.length > 0 && (
              <div className="mt-2 text-[12px] text-slate-500 truncate">
                経由：{viaStops.join(" → ")}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[16px] font-bold text-slate-800 leading-none">
              {formatTime(rideStartAt)}
            </div>
            <div className="mt-2 text-[13px] font-semibold text-slate-500 leading-none">
              {elapsedText || "0分"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// HomeGraphCards
// ===============================
function HomeGraphCards() {
  const cards = ["売上", "件数", "時間帯", "曜日"];

  return (
    <div className="px-3 h-full">
      <div className="grid grid-cols-2 gap-3 h-full">
        {cards.map((label) => (
          <div
            key={label}
            className="rounded-[24px] bg-[#dfe5db] border border-[#d6ddcf] shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center"
          >
            <span className="text-[18px] font-bold text-[#90a08a]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===============================
// HomeEndDutySheet
// ===============================
function HomeEndDutySheet({
  open,
  dutyStarted,
  onFinishTap,
  label = "終了前チェックへ",
}) {
  if (!open || !dutyStarted) return null;

  return (
    <div className="px-3 h-full">
      <button
        type="button"
        onClick={onFinishTap}
        className="w-full h-full rounded-[24px] border border-[#d8c7c7] text-white font-bold text-[22px] shadow-[inset_0_2px_0_rgba(255,255,255,0.30),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)] active:scale-[0.985] bg-[linear-gradient(180deg,#8f8787,#7f7777,#706868)]"
      >
        {label}
      </button>
    </div>
  );
}

// ===============================
// HistoryRecordCard
// ===============================
function HistoryRecordCard({ item, record, onClick }) {
  const target = record || item || {};
  const { formatMoney, formatTime } = window.AppUtils;

  const amountValue = Number(target.金額 || target.amount || 0);
  const pickup = target.乗車地 || target.from || "-";
  const dropoff = target.降車地 || target.to || "-";
  const startAt = target.乗車時刻 || target.time || null;
  const typeText =
    window.AppUtils?.recordType?.(target) === "1" ? "①" : "②";

  return (
    <button
      type="button"
      onClick={() => onClick?.(target)}
      className="w-full text-left rounded-[22px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] px-4 py-3 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold text-slate-800 truncate">
            {pickup} → {dropoff}
          </div>
          <div className="mt-1 text-[12px] text-slate-500">
            {formatTime(startAt)}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[18px] font-black text-slate-800 leading-none">
            {formatMoney(amountValue)}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-slate-500">
            {typeText}
          </div>
        </div>
      </div>
    </button>
  );
}

// ===============================
// OtherSheet
// ===============================
function OtherSheet({
  show,
  onClose,
  openHistoryFull,
  onShowSoon,
}) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/18">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="absolute left-3 right-3 bottom-[92px] rounded-[28px] bg-white border border-white/70 shadow-[0_16px_32px_rgba(0,0,0,0.16)] p-4"
        style={{
          animation: "otherSheetUp 180ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="grid gap-3">
          <button
            type="button"
            onClick={openHistoryFull}
            className="h-[58px] rounded-[20px] bg-slate-100 text-slate-800 text-[20px] font-bold active:bg-slate-200"
          >
            履歴一覧
          </button>

          <button
            type="button"
            onClick={onShowSoon}
            className="h-[58px] rounded-[20px] bg-slate-100 text-slate-800 text-[20px] font-bold active:bg-slate-200"
          >
            設定
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-[52px] rounded-[20px] bg-slate-800 text-white text-[18px] font-bold active:opacity-90"
          >
            閉じる
          </button>
        </div>
      </div>

      <style>{`
        @keyframes otherSheetUp {
          0% { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ===============================
// PaymentDialog
// ===============================
function PaymentDialog({
  amount,
  pickupMeta,
  dropoffMeta,
  paymentCountdown = 2.5,
  savingDots = 4,
  onCancel,
}) {
  const { formatMoney } = window.AppUtils;
  const amountValue = Number(amount || 0);
  const dots = ".".repeat(Math.max(0, Number(savingDots || 0)));

  return (
    <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
      <div className="w-full max-w-[330px] rounded-[28px] bg-white shadow-2xl p-5">
        <div className="text-[20px] font-bold text-slate-800 text-center tracking-[-0.02em]">
          保存します
        </div>

        <div className="mt-4 text-center">
          <div className="text-[34px] font-black text-slate-800 leading-none">
            {formatMoney(amountValue)}
          </div>
        </div>

        <div className="mt-4 text-[14px] leading-relaxed text-slate-500 text-center">
          保存まで {paymentCountdown.toFixed(1)}秒{dots}
        </div>

        <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
          <div>
            乗車精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
          </div>
          <div>
            降車精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold active:bg-slate-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

// ===============================
// ViaDialog
// ===============================
function ViaDialog({
  pendingViaPlace,
  onCancel,
  onRecord,
}) {
  return (
    <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
      <div className="w-full max-w-[330px] rounded-[28px] bg-white shadow-2xl p-5">
        <div className="text-[20px] font-bold text-slate-800 text-center tracking-[-0.02em]">
          経由地を記録しますか？
        </div>

        <div className="mt-4 rounded-[20px] bg-slate-50 border border-slate-200 px-4 py-4 text-center">
          <div className="text-[16px] font-bold text-slate-800 break-words">
            {pendingViaPlace || "未取得"}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold active:bg-slate-200"
          >
            戻る
          </button>

          <button
            type="button"
            onClick={onRecord}
            className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold active:opacity-90"
          >
            記録
          </button>
        </div>
      </div>
    </div>
  );
}

// ===============================
// FinishCheckScreen
// ===============================
function FinishCheckScreen(props) {
  const {
    finishLocked = false,
    finishPhase = "check",
    finishSummary,
    onBack,
    onToggleLock,
    onConfirm,
    onFinalTap,
    openHistoryModalWithFilter,
  } = props;

  const summary = finishSummary || {
    amount1: 0,
    amount2: 0,
    totalAmount: 0,
    businessKm: 0,
    recordCount: 0,
    passengerCount: 0,
  };

  const isSaving = finishPhase === "saving";
  const isDone = finishPhase === "done";

  return (
    <div className="absolute inset-0 bg-[#eef2f5] overflow-hidden">
      <div className="h-full flex flex-col px-3 pt-3 pb-4">
        <div className="rounded-[28px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] px-4 py-4">
          <div className="text-[24px] font-bold text-slate-800 text-center">
            終了前チェック
          </div>
          <div className="mt-2 text-[13px] text-slate-500 text-center">
            この内容で本日の乗務を終了します
          </div>
        </div>

        <div className="mt-3 grid gap-3">
          <div className="rounded-[24px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] px-4 py-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-[12px] text-slate-500">①</div>
                <button
                  type="button"
                  onClick={() => openHistoryModalWithFilter?.("1")}
                  className="mt-1 text-[22px] font-black text-slate-800 active:opacity-70"
                >
                  {Number(summary.amount1 || 0).toLocaleString("ja-JP")}円
                </button>
              </div>

              <div>
                <div className="text-[12px] text-slate-500">②</div>
                <button
                  type="button"
                  onClick={() => openHistoryModalWithFilter?.("2")}
                  className="mt-1 text-[22px] font-black text-slate-800 active:opacity-70"
                >
                  {Number(summary.amount2 || 0).toLocaleString("ja-JP")}円
                </button>
              </div>

              <div>
                <div className="text-[12px] text-slate-500">合計</div>
                <button
                  type="button"
                  onClick={() => openHistoryModalWithFilter?.("all")}
                  className="mt-1 text-[24px] font-black text-slate-800 active:opacity-70"
                >
                  {Number(summary.totalAmount || 0).toLocaleString("ja-JP")}円
                </button>
              </div>

              <div>
                <div className="text-[12px] text-slate-500">＝営走</div>
                <div className="mt-1 text-[24px] font-black text-slate-800">
                  {Number(summary.businessKm || 0).toLocaleString("ja-JP")}km
                </div>
              </div>

              <div>
                <div className="text-[12px] text-slate-500">件数</div>
                <div className="mt-1 text-[22px] font-black text-slate-800">
                  {Number(summary.recordCount || 0)}件
                </div>
              </div>

              <div>
                <div className="text-[12px] text-slate-500">人数</div>
                <div className="mt-1 text-[22px] font-black text-slate-800">
                  {Number(summary.passengerCount || 0)}名
                </div>
              </div>
            </div>
          </div>

          {!isDone && (
            <button
              type="button"
              onClick={onToggleLock}
              className={`h-[62px] rounded-[24px] border text-[22px] font-bold active:scale-[0.985] ${
                finishLocked
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {finishLocked ? "ロック解除済み" : "ロック解除"}
            </button>
          )}

          {!isSaving && !isDone && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onBack}
                className="h-[56px] rounded-[22px] bg-slate-100 text-slate-700 font-bold active:bg-slate-200"
              >
                戻る
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={!finishLocked}
                className="h-[56px] rounded-[22px] bg-slate-800 text-white font-bold active:opacity-90 disabled:opacity-40"
              >
                終了する
              </button>
            </div>
          )}

          {isSaving && (
            <div className="rounded-[24px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)] px-4 py-6 text-center">
              <div className="text-[24px] font-bold text-slate-800">保存中…</div>
            </div>
          )}

          {isDone && (
            <button
              type="button"
              onClick={onFinalTap}
              className="h-[62px] rounded-[24px] bg-slate-800 text-white text-[22px] font-bold active:opacity-90"
            >
              タップして開始へ
            </button>
          )}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}

// ===============================
// BottomNav
// ===============================
function BottomNav({
  centerLabel,
  onHome,
  onCenter,
  onMenu,
  activeArea = "home",
}) {
  const slot = {
    home: "16.6667%",
    center: "50%",
    menu: "83.3333%",
  };

  const activeLeft = slot[activeArea] || slot.home;

  const NAV_HEIGHT = 82;
  const BAND_HEIGHT = 56;
  const BAND_RADIUS = 24;

  const CIRCLE_SIZE = 58;
  const CIRCLE_CENTER_Y = 31;

  const HOME_ICON_CENTER_Y = 30;
  const CENTER_TEXT_CENTER_Y = 31;
  const MENU_ICON_CENTER_Y = 29;
  const LABEL_BASELINE_Y = 71;

  const HomeGlyph = () => (
    <div
      aria-hidden="true"
      className="absolute"
      style={{
        left: slot.home,
        top: `${HOME_ICON_CENTER_Y}px`,
        width: "30px",
        height: "26px",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "0px",
          width: "30px",
          height: "16px",
          background: "#ffffff",
          transform: "translateX(-50%)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "14px",
          width: "18px",
          height: "10px",
          background: "#ffffff",
          transform: "translateX(-50%)",
          borderRadius: "1px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "16px",
          width: "5px",
          height: "8px",
          background: GREEN_CIRCLE,
          transform: "translateX(-50%)",
          borderRadius: "1px",
        }}
      />
    </div>
  );

  const MenuGlyph = () => (
    <div
      aria-hidden="true"
      className="absolute grid"
      style={{
        left: slot.menu,
        top: `${MENU_ICON_CENTER_Y}px`,
        transform: "translate(-50%, -50%)",
        gridTemplateColumns: "repeat(3, 6px)",
        gap: "5px",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 9 }).map((_, idx) => (
        <span
          key={idx}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "9999px",
            background: "#ffffff",
            display: "block",
          }}
        />
      ))}
    </div>
  );

  const BottomLabel = ({ area, text }) => (
    <div
      aria-hidden="true"
      className="absolute text-white text-[12px] leading-none whitespace-nowrap select-none"
      style={{
        left: slot[area],
        top: `${LABEL_BASELINE_Y}px`,
        transform: "translate(-50%, -100%)",
        fontWeight: 500,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden"
      style={{ height: `${NAV_HEIGHT}px` }}
    >
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: `${BAND_HEIGHT}px`,
          background: GREEN_MAIN,
          borderTopLeftRadius: `${BAND_RADIUS}px`,
          borderTopRightRadius: `${BAND_RADIUS}px`,
        }}
      />

      <div
        className="absolute rounded-full transition-all duration-200"
        style={{
          width: `${CIRCLE_SIZE}px`,
          height: `${CIRCLE_SIZE}px`,
          left: activeLeft,
          top: `${CIRCLE_CENTER_Y}px`,
          transform: "translate(-50%, -50%)",
          background: GREEN_CIRCLE,
          pointerEvents: "none",
        }}
      />

      <HomeGlyph />

      <div
        aria-hidden="true"
        className="absolute text-white leading-none whitespace-nowrap select-none pointer-events-none"
        style={{
          left: slot.center,
          top: `${CENTER_TEXT_CENTER_Y}px`,
          transform: "translate(-50%, -50%)",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        {centerLabel}
      </div>

      <MenuGlyph />

      <BottomLabel area="home" text="ホーム" />
      <BottomLabel area="menu" text="メニュー" />

      <button
        type="button"
        onClick={onHome}
        aria-label="ホーム"
        className="absolute left-0 top-0 w-1/3 h-full bg-transparent border-0 p-0 m-0"
      />
      <button
        type="button"
        onClick={onCenter}
        aria-label={centerLabel}
        className="absolute left-1/3 top-0 w-1/3 h-full bg-transparent border-0 p-0 m-0"
      />
      <button
        type="button"
        onClick={onMenu}
        aria-label="メニュー"
        className="absolute right-0 top-0 w-1/3 h-full bg-transparent border-0 p-0 m-0"
      />
    </div>
  );
}

// ===============================
// export
// ===============================
window.AppComponents = {
  AppFrame,
  HeaderCard,
  RideInfoCard,
  HomeGraphCards,
  HomeEndDutySheet,
  HistoryRecordCard,
  OtherSheet,
  PaymentDialog,
  ViaDialog,
  FinishCheckScreen,
  BottomNav,
};

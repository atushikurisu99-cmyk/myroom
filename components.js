// ===============================
// 共通カラー
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
function HeaderCard({
  time,
  subText = "",
  amount = 0,
}) {
  return (
    <div className="w-full px-4 pt-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="text-[32px] font-bold text-center">
          {time}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          {subText}
        </div>
        <div className="text-center mt-2 text-lg font-semibold">
          {amount.toLocaleString()}円
        </div>
      </div>
    </div>
  );
}

// ===============================
// History
// ===============================
function HistoryRecordCard({ item }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <div className="text-sm">{item?.time || "--:--"}</div>
      <div className="text-sm text-gray-500">
        {item?.from || "-"} → {item?.to || "-"}
      </div>
      <div className="text-right font-semibold">
        {item?.amount || 0}円
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

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[100px]">
      {/* 帯 */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px]"
        style={{
          height: "60px",
          background: GREEN_MAIN,
        }}
      />

      {/* 丸 */}
      <div
        className="absolute rounded-full transition-all duration-200"
        style={{
          width: "64px",
          height: "64px",
          left: activeLeft,
          bottom: "28px",
          transform: "translateX(-50%)",
          background: GREEN_CIRCLE,
        }}
      />

      {/* ホーム */}
      <button
        onClick={onHome}
        className="absolute left-0 top-0 w-1/3 h-full flex flex-col items-center justify-end pb-2 text-white"
      >
        <div className="text-[20px] leading-none">▲</div>
        <div className="text-[12px] leading-none">ホーム</div>
      </button>

      {/* 中央 */}
      <button
        onClick={onCenter}
        className="absolute left-1/2 -translate-x-1/2 top-0 w-1/3 h-full flex items-end justify-center pb-3 text-white"
      >
        <div className="text-[14px] font-semibold">
          {centerLabel}
        </div>
      </button>

      {/* メニュー */}
      <button
        onClick={onMenu}
        className="absolute right-0 top-0 w-1/3 h-full flex flex-col items-center justify-end pb-2 text-white"
      >
        <div className="text-[18px] leading-none">•••</div>
        <div className="text-[12px] leading-none">メニュー</div>
      </button>
    </div>
  );
}

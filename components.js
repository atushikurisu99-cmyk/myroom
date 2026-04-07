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
  const items = [
    {
      key: "home",
      label: "ホーム",
      iconType: "home",
      onClick: onHome,
    },
    {
      key: "center",
      label: centerLabel,
      iconType: "none",
      onClick: onCenter,
    },
    {
      key: "menu",
      label: "メニュー",
      iconType: "menu",
      onClick: onMenu,
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[100px]">
      {/* 帯 */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px]"
        style={{
          height: "52px",
          background: GREEN_MAIN,
        }}
      />

      {/* 3カラム固定 */}
      <div className="absolute inset-0 grid grid-cols-3">
        {items.map((item) => {
          const isActive = activeArea === item.key;

          return (
            <div key={item.key} className="relative h-full flex justify-center">
              {/* 円 */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "80px",
                  height: "80px",
                  bottom: "10px",
                  background: isActive ? GREEN_CIRCLE : "rgba(127,200,78,0.38)",
                }}
              />

              {/* 中身 */}
              <button
                onClick={item.onClick}
                className="absolute left-1/2 -translate-x-1/2 text-white"
                style={{
                  bottom: item.iconType === "none" ? "34px" : "16px",
                  width: "92px",
                }}
              >
                {item.iconType === "home" && (
                  <div className="flex justify-center mb-[4px]">
                    <svg
                      width="22"
                      height="20"
                      viewBox="0 0 22 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M11 1.5L20 8.7H17.4V18.5H12.8V12.8H9.2V18.5H4.6V8.7H2L11 1.5Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                )}

                {item.iconType === "menu" && (
                  <div className="flex justify-center mb-[5px]">
                    <div className="grid grid-cols-3 gap-[3px] w-[17px]">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className="block w-[3px] h-[3px] rounded-full bg-white"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="leading-none text-center"
                  style={{
                    fontSize: item.iconType === "none" ? "15px" : "12px",
                    fontWeight: item.iconType === "none" ? 700 : 400,
                    letterSpacing: item.iconType === "none" ? "0" : "0",
                  }}
                >
                  {item.label}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

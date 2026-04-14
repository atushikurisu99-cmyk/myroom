window.AppComponents = (() => {
  const C = window.AppConstants;

  /* =========================
   * 共通
   * ========================= */

  function Clock() {
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }, []);

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    return (
      <div
        className="font-bold tracking-[-0.05em]"
        style={{ fontSize: "68px", color: "#1f2a44" }}
      >
        {hh}：{mm}
      </div>
    );
  }

  /* =========================
   * BottomNav（完成版）
   * ========================= */

  function BottomNav({ active = "home", centerLabel = "履歴" }) {
    return (
      <div className="absolute left-0 right-0 bottom-0" style={{ height: "112px" }}>
        {/* 緑帯 */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: "0px",
            height: "70px",
            background: "#32CD32",
            borderTopLeftRadius: "26px",
            borderTopRightRadius: "26px",
          }}
        />

        {/* 3分割 */}
        <div className="absolute inset-0 grid grid-cols-3">
          {["home", "center", "menu"].map((key) => {
            const isActive = active === key;

            return (
              <div key={key} className="relative flex justify-center">

                {/* 〇 */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      width: "96px",
                      height: "96px",
                      borderRadius: "999px",
                      background: "#51BF2F",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* 中身 */}
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    zIndex: 3,
                    textAlign: "center",
                  }}
                >
                  {key === "home" && (
                    <>
                      <div style={{ fontSize: "28px" }}>🏠</div>
                      <div style={{ fontSize: "12px", color: "#fff" }}>ホーム</div>
                    </>
                  )}

                  {key === "center" && (
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "#fff",
                      }}
                    >
                      {centerLabel}
                    </div>
                  )}

                  {key === "menu" && (
                    <>
                      <div style={{ fontSize: "28px" }}>⋯</div>
                      <div style={{ fontSize: "12px", color: "#fff" }}>メニュー</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================
   * MainButton
   * ========================= */

  function MainButton({ label, type = "start", onClick }) {
    const bg =
      type === "start"
        ? "linear-gradient(180deg,#86e0b2 0%, #6dbb99 42%, #50937c 100%)"
        : type === "standby"
        ? "linear-gradient(180deg,#88c8f5 0%, #5b9bf0 44%, #3c73d8 100%)"
        : "linear-gradient(180deg,#f5d85e 0%, #ecb63c 42%, #d49326 100%)";

    return (
      <button
        onClick={onClick}
        className="relative w-full text-white rounded-[32px]"
        style={{
          height: "142px",
          background: bg,
          boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
        }}
      >
        <div className="absolute left-[18px] right-[18px] top-[10px] h-[54px] rounded-[28px] bg-white/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[34px] font-black">{label}</span>
        </div>
      </button>
    );
  }

  /* =========================
   * Header（TOP用）
   * ========================= */

  function TopHeader() {
    return (
      <>
        <div
          className="absolute left-0 right-0 bg-[#32CD32]"
          style={{ height: "346px" }}
        />

        <div
          className="absolute left-[20px] right-[20px]"
          style={{ top: "0px", height: "180px" }}
        >
          <div className="relative h-full">

            <div className="absolute right-[12px] top-[40px] text-white">
              <Clock />
            </div>

            <div className="absolute left-[16px] top-[118px] text-white text-[13px] font-bold">
              累計+未確認
            </div>

            <div className="absolute right-[96px] bottom-[5px] text-white text-[26px] font-bold">
              1,000,000
            </div>

            <div className="absolute right-[72px] bottom-[7px] text-white text-[20px] font-bold">
              円
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =========================
   * TopGraph
   * ========================= */

  function TopGraphArea() {
    return (
      <div className="grid grid-cols-2 gap-4">
        {["売上", "本数", "時間帯", "分析"].map((t) => (
          <div
            key={t}
            className="rounded-[18px] bg-white/60 p-3"
            style={{ height: "72px" }}
          >
            <div className="font-black">{t}</div>
            <div className="text-[11px] text-slate-400">グラフ</div>
          </div>
        ))}
      </div>
    );
  }

  return {
    BottomNav,
    MainButton,
    TopHeader,
    TopGraphArea,
    Clock,
  };
})();

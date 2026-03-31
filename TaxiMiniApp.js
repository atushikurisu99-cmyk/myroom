const { useTaxiAppState } = window.AppHooks;
const { OtherSheet, PaymentDialog, ViaDialog, FinishDialog } = window.AppComponents;
const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;
const FareScreen = window.AppScreens.FareScreen;
const HistoryModal = window.AppScreens.HistoryModal;

function TaxiMiniApp() {
  const { refs, state, derived, actions } = useTaxiAppState();
  const C = window.AppConstants;

  const [phase, setPhase] = React.useState("logo");
  const [startupCardOn, setStartupCardOn] = React.useState(false);
  const [startupButtonOn, setStartupButtonOn] = React.useState(false);
  const [startupOtherOn, setStartupOtherOn] = React.useState(false);

  const audioRef = React.useRef(null);

  React.useEffect(() => {
    try {
      audioRef.current = new Audio("./goanzen.wav");
      audioRef.current.volume = 0.75;
    } catch (_) {}

    // ロゴ → 白 → startup
    const t1 = setTimeout(() => setPhase("logoFade"), 1200);
    const t2 = setTimeout(() => setPhase("blank"), 1600);
    const t3 = setTimeout(() => setPhase("startup"), 2350); // ←白0.75秒

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  React.useEffect(() => {
    if (phase !== "blank") return;
    try {
      audioRef.current?.play().catch(() => {});
    } catch (_) {}
  }, [phase]);

  React.useEffect(() => {
    if (phase !== "startup") return;

    setStartupCardOn(false);
    setStartupButtonOn(false);
    setStartupOtherOn(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStartupCardOn(true);
      });
    });

    // ボタン（カード後 約0.75秒）
    const tButton = setTimeout(() => {
      setStartupButtonOn(true);
    }, 750);

    // その他（+0.2秒）
    const tOther = setTimeout(() => {
      setStartupOtherOn(true);
    }, 950);

    const tApp = setTimeout(() => {
      setPhase("app");
    }, 2000);

    return () => {
      clearTimeout(tButton);
      clearTimeout(tOther);
      clearTimeout(tApp);
    };
  }, [phase]);

  const renderClockCard = () => (
    <div className={`${C.cardClass} h-[172px] px-4 py-4`}>
      <div className="text-[40px] font-bold text-center">LOGO</div>
    </div>
  );

  const showStartup = phase === "startup";

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">

      {/* ロゴ */}
      {(phase === "logo" || phase === "logoFade") && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <div
            className={`text-[40px] font-bold transition-all duration-[400ms] ${
              phase === "logoFade" ? "opacity-0 scale-105" : "opacity-100"
            }`}
          >
            LOGO
          </div>
        </div>
      )}

      {/* 白画面 */}
      {phase === "blank" && (
        <div className="fixed inset-0 z-[9998] bg-white" />
      )}

      {/* 起動演出 */}
      {showStartup && (
        <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
          <div className="h-full flex flex-col overflow-hidden relative">

            {/* カード */}
            <div
              className="relative z-30"
              style={{
                transform: startupCardOn ? "translate3d(0,0,0)" : "translate3d(-280px,0,0)",
                transition: "transform 700ms cubic-bezier(0.2,0.8,0.2,1)"
              }}
            >
              {renderClockCard()}
            </div>

            {/* ボタン */}
            <div
              className="pt-4 relative z-20"
              style={{
                transform: startupButtonOn ? "translate3d(0,0,0)" : "translate3d(0,-140px,0)",
                opacity: startupButtonOn ? 1 : 0,
                transition: "transform 750ms cubic-bezier(0.2,0.8,0.2,1), opacity 200ms"
              }}
            >
              <button className={`${C.mainButtonBase}`}>
                <span className={C.bigButtonText}>乗務開始</span>
              </button>
            </div>

            {/* その他 */}
            <div
              className="pt-4 relative z-10"
              style={{
                transform: startupOtherOn ? "translate3d(0,0,0)" : "translate3d(0,-180px,0)",
                opacity: startupOtherOn ? 1 : 0,
                transition: "transform 850ms cubic-bezier(0.2,0.8,0.2,1), opacity 250ms"
              }}
            >
              <div className={`${C.cardClass} h-[220px] bg-white`}>
                <div className="p-4 text-sm text-slate-400">その他</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 通常画面 */}
      {phase === "app" && (
        <TopScreen />
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

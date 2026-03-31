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

  const [startupPhase, setStartupPhase] = React.useState("logo");
  // logo | prompt | animating | done
  const [startupCardOn, setStartupCardOn] = React.useState(false);
  const [startupButtonOn, setStartupButtonOn] = React.useState(false);
  const [startupOtherOn, setStartupOtherOn] = React.useState(false);

  const audioRef = React.useRef(null);
  const startupTimersRef = React.useRef([]);

  const clearStartupTimers = () => {
    startupTimersRef.current.forEach((id) => clearTimeout(id));
    startupTimersRef.current = [];
  };

  React.useEffect(() => {
    try {
      audioRef.current = new Audio("./goanzen.wav");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.75;
    } catch (_) {}

    // ロゴ＋ゆっくりフェード
    const t = setTimeout(() => {
      setStartupPhase("prompt");
    }, 3800);

    startupTimersRef.current.push(t);

    return () => {
      clearStartupTimers();
    };
  }, []);

  const renderSharedInfoSpacer = () => (
    <div className="pt-4 shrink-0">
      <div
        className="rounded-[28px] opacity-0 pointer-events-none"
        style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
      />
    </div>
  );

  const renderClockCard = (clickable = true) => (
    <div
      className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0 overflow-hidden`}
      onClick={clickable ? actions.handleCardModeNext : undefined}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="text-[15px] leading-none font-semibold text-slate-700 pt-1">
              {derived.stateLabel}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end text-[58px] leading-[0.9] font-black tracking-[-0.05em] text-slate-800">
              <span>{derived.timeParts.hh}</span>
              <span
                className={`${
                  derived.timeParts.showColon ? "opacity-100" : "opacity-0"
                } transition-opacity duration-150 mx-[-0.08em]`}
              >
                ：
              </span>
              <span>{derived.timeParts.mm}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
          <div className="text-[12px] font-medium text-slate-500">今日のペース</div>
          <div className="mt-1 text-[16px] leading-none font-normal text-[#00a676]">良好</div>
        </div>
      </div>
    </div>
  );

  const handleStartupBegin = () => {
    if (startupPhase !== "prompt") return;

    clearStartupTimers();
    setStartupPhase("animating");

    const tAudio = setTimeout(() => {
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      } catch (_) {}
    }, 250);

    const tCard = setTimeout(() => setStartupCardOn(true), 750);
    const tButton = setTimeout(() => setStartupButtonOn(true), 1250);
    const tOther = setTimeout(() => setStartupOtherOn(true), 1750);
    const tDone = setTimeout(() => setStartupPhase("done"), 2550);

    startupTimersRef.current.push(tAudio, tCard, tButton, tOther, tDone);
  };

  const showStartupOverlay = startupPhase !== "done";

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">

        {!showStartupOverlay && (
          <div className="h-full flex flex-col overflow-hidden">
            {renderClockCard(true)}

            {state.screen === "top" && (
              <TopScreen
                {...{...derived, ...actions, ...state, refs}}
                renderSharedInfoSpacer={renderSharedInfoSpacer}
              />
            )}
          </div>
        )}

        {/* 起動 */}
        {showStartupOverlay && (
          <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
            
            {startupPhase === "logo" && (
              <>
                <img
                  src="./logo.png"
                  className="w-[230px] select-none pointer-events-none"
                />

                {/* ゆっくりフェード */}
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    animation: "startupWhiteFadeIn 3800ms ease-in-out forwards",
                  }}
                />
              </>
            )}

            {startupPhase === "prompt" && (
              <button
                onClick={handleStartupBegin}
                className="text-[11px] text-[#1a1a1a] tracking-[0.08em] font-medium select-none"
                style={{
                  animation: "startupPromptPulse 2200ms ease-in-out infinite",
                }}
              >
                タップして開始
              </button>
            )}

          </div>
        )}

        <style>{`
          @keyframes startupWhiteFadeIn {
            0% { opacity: 0; }
            40% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes startupPromptPulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.6; }
            100% { opacity: 0.2; }
          }
        `}</style>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

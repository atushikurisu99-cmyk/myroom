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

    const t = setTimeout(() => {
      setStartupPhase("prompt");
    }, 2500);

    startupTimersRef.current.push(t);

    return () => {
      clearStartupTimers();
    };
  }, []);

  const handleStartupBegin = () => {
    if (startupPhase !== "prompt") return;

    clearStartupTimers();
    setStartupPhase("revealing");

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
    const tDone = setTimeout(() => setStartupPhase("done"), 2400);

    startupTimersRef.current.push(tAudio, tCard, tButton, tOther, tDone);
  };

  const startupOverlayVisible = startupPhase === "logo" || startupPhase === "prompt";
  const startupRevealing = startupPhase === "revealing";
  const startupLock = startupOverlayVisible || startupRevealing;

  const baseAnim = (on) => ({
    transform: on ? "translate3d(0,0,0)" : "translate3d(-112%,0,0)",
    opacity: on ? 1 : 0,
    transition: "transform 600ms cubic-bezier(0.22,0.78,0.18,1), opacity 160ms linear",
  });

  const renderSharedInfoSpacer = () => (
    <div className="pt-4 shrink-0">
      <div className="rounded-[28px] opacity-0 pointer-events-none" style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }} />
    </div>
  );

  const renderClockCard = (styleOverride = null) => (
    <div
      className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0`}
      style={styleOverride || undefined}
    >
      <div className="flex justify-end text-[58px] font-black">
        {derived.timeParts.hh}：{derived.timeParts.mm}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#eef3f9] flex justify-center">
      <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">

        {!startupLock && (
          <>
            <OtherSheet show={state.showOtherSheet} onClose={() => actions.setShowOtherSheet(false)} openHistoryModal={actions.openHistoryModal} />
            {state.showPaymentDialog && <PaymentDialog amount={state.amount} pickupMeta={state.pickupMeta} dropoffMeta={state.dropoffMeta} paymentCountdown={state.paymentCountdown} savingDots={state.savingDots} onCancel={actions.cancelPaymentDialog} />}
          </>
        )}

        <div
          className="h-full flex flex-col"
          style={{
            visibility: startupOverlayVisible ? "hidden" : "visible",
          }}
        >
          {renderClockCard(startupRevealing ? baseAnim(startupCardOn) : null)}

          {state.screen === 'top' && (
            <TopScreen
              {...{...derived, ...actions, ...state, refs}}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
              startupMainStyle={startupRevealing ? baseAnim(startupButtonOn) : null}
              startupOtherStyle={startupRevealing ? baseAnim(startupOtherOn) : null}
              startupLock={startupLock}
            />
          )}
        </div>

        {/* 起動UI */}
        {startupOverlayVisible && (
          <div className="absolute inset-0 bg-white flex items-center justify-center">
            {startupPhase === "logo" && (
              <img src="./logo.png" className="w-[230px]" />
            )}

            {startupPhase === "prompt" && (
              <button
                onClick={handleStartupBegin}
                className="text-[11px] text-[#1a1a1a] tracking-[0.08em] font-medium select-none"
                style={{
                  animation: "pulse 2.2s infinite",
                }}
              >
                タップして開始
              </button>
            )}
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.6; }
            100% { opacity: 0.2; }
          }
        `}</style>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TaxiMiniApp />);

const { useEffect, useMemo, useRef, useState } = React;

const { useTaxiAppState } = window.AppHooks;
const {
  AppFrame,
  OtherSheet,
  PaymentDialog,
  ViaDialog,
} = window.AppComponents;
const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;
const FareScreen = window.AppScreens.FareScreen;
const FinishCheckScreen = window.AppScreens.FinishCheckScreen;
const HistoryModal = window.AppScreens.HistoryModal;

function TaxiMiniApp() {
  const { refs, state, derived, actions } = useTaxiAppState();

  const startupAudioRef = useRef(null);
  const startupTimersRef = useRef([]);

  const [startupPhase, setStartupPhase] = useState("logo");
  const [startupStage, setStartupStage] = useState(0);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStartupPhase("logoFade"), 1500));
    timers.push(setTimeout(() => setStartupPhase("tap"), 2250));
    startupTimersRef.current = timers;
    return () => {
      timers.forEach((id) => clearTimeout(id));
      startupTimersRef.current = [];
    };
  }, []);

  const startApp = () => {
    if (startupPhase !== "tap") return;

    startupTimersRef.current.forEach((id) => clearTimeout(id));
    startupTimersRef.current = [];

    setStartupStage(0);
    setStartupPhase("tapFade");

    const timers = [];
    timers.push(
      setTimeout(() => {
        setStartupPhase("running");
      }, 180)
    );
    timers.push(
      setTimeout(() => {
        try {
          if (!startupAudioRef.current) {
            startupAudioRef.current = new Audio("./goanzen.wav");
            startupAudioRef.current.preload = "auto";
            startupAudioRef.current.volume = 0.75;
          }
          startupAudioRef.current.currentTime = 0;
          startupAudioRef.current.play().catch(() => {});
        } catch (_) {}
        setStartupStage(1);
      }, 500)
    );
    timers.push(setTimeout(() => setStartupStage(2), 1000));
    timers.push(setTimeout(() => setStartupStage(3), 1500));
    timers.push(setTimeout(() => setStartupPhase("done"), 2050));
    startupTimersRef.current = timers;
  };

  const startupLock = state.screen === "top" && startupPhase !== "done";

  const topMainStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};
    return {
      transform:
        startupStage >= 2 ? "translateX(0) scale(1)" : "translateX(-64px) scale(0.97)",
      opacity: startupStage >= 2 ? 1 : 0,
      transition:
        "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 460ms ease-out",
      willChange: "transform, opacity",
    };
  }, [state.screen, startupPhase, startupStage]);

  const topContentStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};
    return {
      transform: startupStage >= 3 ? "translateX(0)" : "translateX(-72px)",
      opacity: startupStage >= 3 ? 1 : 0,
      transition:
        "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 460ms ease-out",
      willChange: "transform, opacity",
    };
  }, [state.screen, startupPhase, startupStage]);

  const showSplash =
    state.screen === "top" &&
    ["logo", "logoFade", "tap", "tapFade"].includes(startupPhase);

  const splashStyle = useMemo(() => {
    if (startupPhase === "tapFade") {
      return {
        opacity: 0,
        transition: "opacity 180ms ease-out",
        pointerEvents: "none",
      };
    }
    return {
      opacity: 1,
      transition: "opacity 180ms ease-out",
      pointerEvents: "auto",
    };
  }, [startupPhase]);

  const navCenterLabel = state.screen === "top" || state.screen === "finishCheck" ? "経費" : "履歴";
  const activeNavArea = state.showOtherSheet
    ? "menu"
    : state.screen === "standby" || state.screen === "ride"
    ? "center"
    : "home";

  return (
    <div className="w-full h-full flex justify-center overflow-hidden">
      <audio
        ref={startupAudioRef}
        src="./goanzen.wav"
        preload="auto"
        style={{ display: "none" }}
      />

      <AppFrame>
        {state.showSaved && startupPhase === "done" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 shadow-lg">
            保存しました
          </div>
        )}

        {state.toastMessage && startupPhase === "done" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 shadow-lg">
            {state.toastMessage}
          </div>
        )}

        <OtherSheet
          show={state.showOtherSheet}
          onClose={actions.closeOtherSheet}
          openHistoryFull={actions.openHistoryFullFromMenu}
          onShowSoon={actions.showSoonToast}
        />

        {state.showPaymentDialog && (
          <PaymentDialog
            amount={state.amount}
            pickupMeta={state.pickupMeta}
            dropoffMeta={state.dropoffMeta}
            paymentCountdown={state.paymentCountdown}
            savingDots={state.savingDots}
            onCancel={actions.cancelPaymentDialog}
          />
        )}

        {state.showViaDialog && (
          <ViaDialog
            pendingViaPlace={state.pendingViaPlace}
            onCancel={actions.cancelViaDialog}
            onRecord={actions.recordVia}
          />
        )}

        <HistoryModal
          show={state.showHistoryModal}
          editingRecord={state.editingRecord}
          historyUiMode={state.historyUiMode}
          historyMode={state.historyMode}
          historyFilter={state.historyFilter}
          historySummary={derived.historySummary}
          filteredHistoryRecords={derived.filteredHistoryRecords}
          groupedHistory={derived.groupedHistory}
          expandedMonthDays={state.expandedMonthDays}
          getHistoryPeriodText={derived.getHistoryPeriodText}
          closeHistoryModal={actions.closeHistoryModal}
          setHistoryMode={actions.setHistoryMode}
          setHistoryFilter={actions.setHistoryFilter}
          moveHistoryPeriod={actions.moveHistoryPeriod}
          toggleMonthDay={actions.toggleMonthDay}
          openEditRecord={actions.openEditRecord}
          closeEditRecord={actions.closeEditRecord}
          saveEditedRecord={actions.saveEditedRecord}
          deleteEditedRecord={actions.deleteEditedRecord}
          setEditingRecord={actions.setEditingRecord}
        />

        <div className="absolute inset-0 overflow-hidden">
          {(state.screen === "top" || state.screen === "finishCheck") && (
            <TopScreen
              screen="top"
              timeParts={derived.timeParts}
              homeDisplayAmount={derived.homeDisplayAmount}
              isHomeAmountVisible={state.isHomeAmountVisible}
              toggleHomeAmountVisible={actions.toggleHomeAmountVisible}
              topMainLabel={derived.topMainLabel}
              topMainButtonDisabled={derived.topMainButtonDisabled || startupLock}
              handleTopMain={actions.handleTopMain}
              contentStyle={topContentStyle}
              mainButtonStyle={topMainStyle}
              homeEndSheetOpen={state.homeEndSheetOpen}
              toggleHomeEndSheet={actions.toggleHomeEndSheet}
              handleFinishTap={actions.handleFinishTap}
              dutyStarted={state.dutyStarted}
              isRiding={state.isRiding}
              navCenterLabel={navCenterLabel}
              navActiveArea={activeNavArea}
              onHome={actions.goHome}
              onCenter={actions.openExpenseSoon}
              onMenu={actions.openMenu}
            />
          )}

          {state.screen === "standby" && (
            <StandbyScreen
              screen={state.screen}
              timeParts={derived.timeParts}
              cardMode={state.cardMode}
              weather={state.weather}
              totalAmount={derived.totalAmount}
              recordCount={derived.recordCount}
              amount1={derived.amount1}
              amount2={derived.amount2}
              handleStartRide={actions.handleStartRide}
              navCenterLabel={navCenterLabel}
              navActiveArea={activeNavArea}
              onHome={actions.goHome}
              onCenter={actions.openHistorySimple}
              onMenu={actions.openMenu}
            />
          )}

          {state.screen === "ride" && (
            <RideScreen
              screen={state.screen}
              timeParts={derived.timeParts}
              cardMode={state.cardMode}
              weather={state.weather}
              totalAmount={derived.totalAmount}
              recordCount={derived.recordCount}
              amount1={derived.amount1}
              amount2={derived.amount2}
              pickup={state.pickup}
              rideStartAt={state.rideStartAt}
              elapsedText={derived.elapsedText}
              viaStops={state.viaStops}
              handleDropOffTap={actions.handleDropOffTap}
              navCenterLabel={navCenterLabel}
              navActiveArea={activeNavArea}
              onHome={actions.goHome}
              onCenter={actions.openHistorySimple}
              onMenu={actions.openMenu}
            />
          )}

          {state.screen === "fare" && (
            <FareScreen
              rideStartAt={state.rideStartAt}
              pickup={state.pickup}
              pickupMeta={state.pickupMeta}
              rideEndAt={state.rideEndAt}
              dropoff={state.dropoff}
              dropoffMeta={state.dropoffMeta}
              amountInputRef={refs.amountInputRef}
              formattedAmount={derived.formattedAmount}
              handleAmountChange={actions.handleAmountChange}
              selectedPassengers={state.selectedPassengers}
              handlePassengerSelect={actions.handlePassengerSelect}
              openPaymentDialog={actions.openPaymentDialog}
            />
          )}

          {state.screen === "finishCheck" && (
            <FinishCheckScreen
              finishCountdown={state.finishCountdown}
              onBack={actions.closeFinishCheck}
              onConfirm={actions.performDutyEnd}
            />
          )}
        </div>

        {showSplash && (
          <div
            className="absolute inset-0 z-[999] bg-white flex items-center justify-center"
            style={splashStyle}
          >
            {(startupPhase === "logo" || startupPhase === "logoFade") && (
              <div
                style={{
                  opacity: startupPhase === "logoFade" ? 0 : 1,
                  transition: "opacity 750ms ease",
                }}
              >
                <img
                  src="./logo.png"
                  alt="logo"
                  style={{
                    width: "250px",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}

            {startupPhase === "tap" && (
              <button
                type="button"
                onClick={startApp}
                className="bg-transparent border-none outline-none"
              >
                <span
                  className="text-[20px] text-slate-500 font-medium tracking-[0.08em]"
                  style={{ animation: "blink 1.2s infinite" }}
                >
                  タップして開始
                </span>
              </button>
            )}
          </div>
        )}
      </AppFrame>

      <style>{`
        @keyframes blink {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

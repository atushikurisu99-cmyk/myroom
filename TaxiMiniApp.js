const { useEffect, useMemo, useRef, useState } = React;

const { useTaxiAppState } = window.AppHooks;
const {
  HeaderCard,
  OtherSheet,
  PaymentDialog,
  ViaDialog,
  FinishDialog,
} = window.AppComponents;

const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;
const FareScreen = window.AppScreens.FareScreen;
const HistoryModal = window.AppScreens.HistoryModal;

function TaxiMiniApp() {
  const { refs, state, derived, actions } = useTaxiAppState();

  const startupAudioRef = useRef(null);
  const startupTimersRef = useRef([]);

  const [startupPhase, setStartupPhase] = useState("logo");
  const [startupStage, setStartupStage] = useState(0);
  const [showHomeBottomCard, setShowHomeBottomCard] = useState(false);

  useEffect(() => {
    const timers = [];
    const t1 = setTimeout(() => setStartupPhase("logoFade"), 1500);
    const t2 = setTimeout(() => setStartupPhase("tap"), 2250);
    timers.push(t1, t2);
    startupTimersRef.current = timers;

    return () => {
      timers.forEach((id) => clearTimeout(id));
      startupTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (state.screen !== "top") {
      setShowHomeBottomCard(false);
    }
  }, [state.screen]);

  const startApp = () => {
    if (startupPhase !== "tap") return;

    const oldTimers = startupTimersRef.current || [];
    oldTimers.forEach((id) => clearTimeout(id));
    startupTimersRef.current = [];

    setStartupStage(0);
    setStartupPhase("tapFade");

    const timers = [];

    const t0 = setTimeout(() => {
      setStartupPhase("running");
    }, 180);

    const t1 = setTimeout(() => {
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
    }, 500);

    const t2 = setTimeout(() => {
      setStartupStage(2);
    }, 1000);

    const t3 = setTimeout(() => {
      setStartupPhase("done");
    }, 1500);

    timers.push(t0, t1, t2, t3);
    startupTimersRef.current = timers;
  };

  const startupLock = state.screen === "top" && startupPhase !== "done";

  const headerStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};

    return {
      transform: startupStage >= 1 ? "translateX(0)" : "translateX(-140%)",
      opacity: startupStage >= 1 ? 1 : 0,
      transition:
        "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 460ms ease-out",
      willChange: "transform, opacity",
    };
  }, [state.screen, startupPhase, startupStage]);

  const mainStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};

    return {
      transform:
        startupStage >= 2
          ? "translateX(0) scale(1)"
          : "translateX(-64px) scale(0.97)",
      opacity: startupStage >= 2 ? 1 : 0,
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

  const topMainLabel = !state.dutyStarted
    ? "乗務開始"
    : state.isRiding
    ? "降車"
    : "実車";

  const handleHomeMain = () => {
    if (!state.dutyStarted) {
      actions.handleDutyStart();
      return;
    }

    if (state.isRiding) {
      actions.handleDropOffTap();
      return;
    }

    actions.handleStartRide();
  };

  return (
    <div className="w-full h-full bg-[#f7f7f7] flex justify-center overflow-hidden">
      <audio
        ref={startupAudioRef}
        src="./goanzen.wav"
        preload="auto"
        style={{ display: "none" }}
      />

      <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
        {state.showSaved && startupPhase === "done" && (
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-30 rounded-full bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 shadow-lg">
            保存しました
          </div>
        )}

        {state.toastMessage && startupPhase === "done" && (
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-30 rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 shadow-lg">
            {state.toastMessage}
          </div>
        )}

        <OtherSheet
          show={state.showOtherSheet}
          onClose={() => actions.setShowOtherSheet(false)}
          openHistoryModal={actions.openHistoryModal}
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

        {state.showFinishDialog && (
          <FinishDialog
            workDate={state.workDate}
            recordCount={derived.recordCount}
            totalAmount={derived.totalAmount}
            onCancel={() => actions.setShowFinishDialog(false)}
            onConfirm={actions.performDutyEnd}
          />
        )}

        <HistoryModal
          show={state.showHistoryModal}
          editingRecord={state.editingRecord}
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

        <div className="h-full flex flex-col overflow-hidden">
          {state.screen !== "fare" && (
            <div style={headerStyle}>
              <HeaderCard
                timeParts={derived.timeParts}
                weather={state.weather}
                totalAmount={derived.totalAmount}
                recordCount={derived.recordCount}
                subLabel={
                  state.isRiding
                    ? "乗車中ぱたん"
                    : state.dutyStarted
                    ? "乗務中ぱたん"
                    : "乗務開始ぱたん"
                }
              />
            </div>
          )}

          {state.screen === "top" && (
            <TopScreen
              topMainLabel={topMainLabel}
              topMainButtonDisabled={startupLock}
              handleTopMain={handleHomeMain}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
              openExpenseModal={() => {}}
              startupMainStyle={mainStyle}
              dutyStarted={state.dutyStarted}
              showHomeBottomCard={showHomeBottomCard}
              toggleHomeBottomCard={() => {
                if (!state.dutyStarted) return;
                setShowHomeBottomCard((prev) => !prev);
              }}
              handleFinishTap={() => {
                setShowHomeBottomCard(false);
                actions.setShowFinishDialog(true);
              }}
            />
          )}

          {state.screen === "standby" && (
            <StandbyScreen
              handleStartRide={actions.handleStartRide}
              goHome={actions.goHome}
              openHistoryModal={actions.openHistoryModal}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
            />
          )}

          {state.screen === "ride" && (
            <RideScreen
              pickup={state.pickup}
              rideStartAt={state.rideStartAt}
              elapsedText={derived.elapsedText}
              viaStops={state.viaStops}
              handleDropOffTap={actions.handleDropOffTap}
              goHome={actions.goHome}
              openHistoryModal={actions.openHistoryModal}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
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

      </div>

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

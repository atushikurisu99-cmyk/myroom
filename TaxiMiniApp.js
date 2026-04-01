const { useEffect, useMemo, useState } = React;

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
  const C = window.AppConstants;

  const [startupPhase, setStartupPhase] = useState("logo");
  const [startupStage, setStartupStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStartupPhase("logoFade"), 1500);
    const t2 = setTimeout(() => setStartupPhase("tap"), 2250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const startApp = () => {
    if (startupPhase !== "tap") return;

    setStartupPhase("running");

    setTimeout(() => {
      const audio = new Audio("./goanzen.wav");
      audio.volume = 0.75;
      audio.play().catch(() => {});
      setStartupStage(1);
    }, 500);

    setTimeout(() => setStartupStage(2), 1000);
    setTimeout(() => setStartupStage(3), 1500);
    setTimeout(() => setStartupPhase("done"), 1900);
  };

  const startupLock = startupPhase !== "done";

  const headerStyle = useMemo(() => {
    if (startupPhase === "done") return {};

    return {
      transform: startupStage >= 1 ? "translateX(0)" : "translateX(-120%)",
      opacity: startupStage >= 1 ? 1 : 0,
      transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
    };
  }, [startupPhase, startupStage]);

  const mainStyle = useMemo(() => {
    if (startupPhase === "done") return {};

    return {
      transform:
        startupStage >= 2
          ? "translateX(0) scale(1)"
          : "translateX(-40px) scale(0.96)",
      opacity: startupStage >= 2 ? 1 : 0,
      transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
    };
  }, [startupPhase, startupStage]);

  const otherStyle = useMemo(() => {
    if (startupPhase === "done") return {};

    return {
      transform: startupStage >= 3 ? "translateX(0)" : "translateX(-56px)",
      opacity: startupStage >= 3 ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
    };
  }, [startupPhase, startupStage]);

  const renderSharedInfoSpacer = () => (
    <div
      className="pt-4 shrink-0"
      style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
    >
      <div className="h-full rounded-[28px] opacity-0 pointer-events-none" />
    </div>
  );

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
        {state.showSaved && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 shadow-lg">
            保存しました
          </div>
        )}

        {state.toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 shadow-lg">
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
            <div style={headerStyle} onClick={actions.handleCardModeNext}>
              <HeaderCard
                timeParts={derived.timeParts}
                cardMode={state.cardMode}
                weather={state.weather}
                totalAmount={derived.totalAmount}
                recordCount={derived.recordCount}
                amount1={derived.amount1}
                amount2={derived.amount2}
              />
            </div>
          )}

          {state.screen === "top" && (
            <TopScreen
              topMainLabel={derived.topMainLabel}
              topMainButtonDisabled={derived.topMainButtonDisabled || startupLock}
              handleTopMain={actions.handleTopMain}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
              openHistoryModal={actions.openHistoryModal}
              previewRecords={derived.previewRecords}
              startupMainStyle={mainStyle}
              startupOtherStyle={otherStyle}
            />
          )}

          {state.screen === "standby" && (
            <StandbyScreen
              handleStartRide={actions.handleStartRide}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
              handleFinishTap={actions.handleFinishTap}
              isFinishVisible={derived.isFinishVisible}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
              openHistoryModal={actions.openHistoryModal}
              previewRecords={derived.previewRecords}
              standbySheetOffset={state.standbySheetOffset}
              beginStandbySheetDrag={actions.beginStandbySheetDrag}
              toggleStandbySheet={actions.toggleStandbySheet}
              dragging={refs.sheetDragRef?.current?.dragging || false}
              isStandbySheetOpened={derived.isStandbySheetOpened}
            />
          )}

          {state.screen === "ride" && (
            <RideScreen
              pickup={state.pickup}
              rideStartAt={state.rideStartAt}
              elapsedText={derived.elapsedText}
              viaStops={state.viaStops}
              handleDropOffTap={actions.handleDropOffTap}
              openOtherSheet={() => actions.setShowOtherSheet(true)}
              openHistoryModal={actions.openHistoryModal}
              previewRecords={derived.previewRecords}
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

        {startupPhase !== "done" && (
          <div className="absolute inset-0 z-[999] bg-white flex items-center justify-center">
            {(startupPhase === "logo" || startupPhase === "logoFade") && (
              <div
                style={{
                  opacity: startupPhase === "logoFade" ? 0 : 1,
                  transition: "opacity 0.75s ease",
                }}
              >
                <div className="text-center">
                  <div className="text-[18px] tracking-[0.3em] text-slate-500">
                    PROJECT
                  </div>
                  <div className="text-[56px] font-black text-slate-800 mt-2">
                    ARTS
                  </div>
                </div>
              </div>
            )}

            {startupPhase === "tap" && (
              <button type="button" onClick={startApp}>
                <span
                  className="text-[20px] text-slate-500"
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

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
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    audioRef.current = new Audio("./goanzen.wav");
    audioRef.current.volume = 0.65;

    const t1 = setTimeout(() => setPhase("logoFade"), 2000);
    const t2 = setTimeout(() => setPhase("white"), 3500);

    const t3 = setTimeout(() => {
      setPhase("card");
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (_) {}
    }, 4000);

    const t4 = setTimeout(() => setPhase("button"), 4500);
    const t5 = setTimeout(() => setPhase("other"), 5000);
    const t6 = setTimeout(() => setPhase("app"), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
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

  const renderClockCard = () => (
    <div className={`${C.cardClass} h-[172px] px-4 py-4`}>
      <div className="h-full flex items-center justify-between gap-3">
        <div className="shrink-0 flex items-center gap-4 pl-1">
          <div className="w-[42px] text-center">
            <div className="text-[12px] font-semibold text-slate-500 leading-none">今</div>
            <div className="mt-2 text-[28px] leading-none">
              {derived.weatherNowIcon}
            </div>
          </div>

          <div className="w-[42px] text-center">
            <div className="text-[12px] font-semibold text-slate-500 leading-none">翌日</div>
            <div className="mt-2 text-[28px] leading-none">
              {derived.weatherTomorrowIcon}
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center min-w-0">
          <div className="text-[58px] font-black text-slate-800 tracking-[-0.04em] leading-none">
            {derived.timeParts.hh}
            <span className={derived.timeParts.showColon ? "opacity-100" : "opacity-20"}>:</span>
            {derived.timeParts.mm}
          </div>
        </div>
      </div>
    </div>
  );

  const paymentLabel =
    state.pendingPaymentType === "cash"
      ? "現金"
      : state.pendingPaymentType === "cardQr"
      ? "カード・QR"
      : state.pendingPaymentType === "receipt"
      ? "領収証発行"
      : "";

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      {(phase === "logo" || phase === "logoFade") && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <img
            src="./logo.png"
            className={`w-[220px] transition-all duration-[1500ms] ${
              phase === "logoFade" ? "opacity-0 scale-[1.05]" : "opacity-100"
            }`}
          />
        </div>
      )}

      {phase === "white" && (
        <div className="fixed inset-0 z-[9998] bg-white" />
      )}

      {(phase === "card" || phase === "button" || phase === "other") && (
        <div className="w-full max-w-sm h-full px-4 pt-4 pb-3">
          <div className="flex flex-col">
            {phase !== "white" && renderClockCard()}

            {(phase === "button" || phase === "other") && (
              <div className="pt-4 transition-all duration-500">
                <button className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)]`}>
                  <span className={C.bigButtonText}>乗務開始</span>
                </button>
              </div>
            )}

            {phase === "other" && (
              <div className="pt-4 transition-all duration-500">
                {renderSharedInfoSpacer()}
                <div className={`${C.cardClass} h-[220px] flex items-center justify-center text-slate-400`}>
                  読み込み中…
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "app" && (
        <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
          <OtherSheet
            show={state.showOtherSheet}
            onClose={() => actions.setShowOtherSheet(false)}
            openHistoryModal={actions.openHistoryModal}
          />

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

          {state.showPaymentDialog && (
            <PaymentDialog
              amount={state.amount}
              pickupMeta={state.pickupMeta}
              dropoffMeta={state.dropoffMeta}
              paymentCountdown={state.paymentCountdown}
              paymentLabel={paymentLabel}
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

          <div className="h-full flex flex-col overflow-hidden">
            {renderClockCard()}

            {state.screen === "top" && (
              <TopScreen
                topMainLabel={derived.topMainLabel}
                topMainButtonDisabled={derived.topMainButtonDisabled}
                handleTopMain={actions.handleTopMain}
                renderSharedInfoSpacer={renderSharedInfoSpacer}
                topScrollRef={refs.topScrollRef}
                openOtherSheet={() => actions.setShowOtherSheet(true)}
                openHistoryModal={actions.openHistoryModal}
                previewRecords={derived.previewRecords}
                totalAmount={derived.totalAmount}
              />
            )}

            {state.screen === "standby" && (
              <StandbyScreen
                handleStartRide={actions.handleStartRide}
                renderSharedInfoSpacer={renderSharedInfoSpacer}
                handleFinishTap={actions.handleFinishTap}
                openOtherSheet={() => actions.setShowOtherSheet(true)}
                openHistoryModal={actions.openHistoryModal}
                previewRecords={derived.previewRecords}
                toggleStandbySheet={actions.toggleStandbySheet}
                isStandbySheetOpened={derived.isStandbySheetOpened}
                standbySheetOffset={state.standbySheetOffset}
                beginStandbySheetDrag={actions.beginStandbySheetDrag}
                totalAmount={derived.totalAmount}
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
                totalAmount={derived.totalAmount}
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
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

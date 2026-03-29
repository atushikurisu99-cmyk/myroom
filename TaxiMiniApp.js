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
  const audioUnlockedRef = React.useRef(false);

  React.useEffect(() => {
    try {
      audioRef.current = new Audio("./goanzen.wav");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.75;
    } catch (_) {}

    const tryPlayStartupAudio = () => {
      if (!audioRef.current || audioUnlockedRef.current) return;
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => {
              audioUnlockedRef.current = true;
            })
            .catch(() => {});
        } else {
          audioUnlockedRef.current = true;
        }
      } catch (_) {}
    };

    tryPlayStartupAudio();

    const unlockOnFirstGesture = () => {
      if (!audioRef.current || audioUnlockedRef.current) return;
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => {
              audioUnlockedRef.current = true;
            })
            .catch(() => {});
        } else {
          audioUnlockedRef.current = true;
        }
      } catch (_) {}
    };

    window.addEventListener("pointerdown", unlockOnFirstGesture, { passive: true });
    window.addEventListener("touchstart", unlockOnFirstGesture, { passive: true });

    const t1 = setTimeout(() => setPhase("logoFade"), 1500);
    const t2 = setTimeout(() => setPhase("blank"), 2000);
    const t3 = setTimeout(() => setPhase("card"), 2500);
    const t4 = setTimeout(() => setPhase("button"), 3720);
    const t5 = setTimeout(() => setPhase("other"), 3920);
    const t6 = setTimeout(() => setPhase("app"), 4820);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      window.removeEventListener("pointerdown", unlockOnFirstGesture);
      window.removeEventListener("touchstart", unlockOnFirstGesture);
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
            className={`w-[220px] transition-all duration-[500ms] ease-out ${
              phase === "logoFade"
                ? "opacity-0 scale-[1.02]"
                : "opacity-100 scale-100"
            }`}
          />
        </div>
      )}

      {phase === "blank" && (
        <div className="fixed inset-0 z-[9998] bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)]" />
      )}

      {(phase === "card" || phase === "button" || phase === "other") && (
        <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
          <div className="h-full flex flex-col overflow-hidden relative">
            <div
              className={`relative z-30 transition-all duration-[720ms] ease-out ${
                phase === "card" || phase === "button" || phase === "other"
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-[120px] opacity-0"
              }`}
            >
              {renderClockCard()}
            </div>

            {(phase === "button" || phase === "other") && (
              <div
                className={`pt-4 relative z-20 transition-all duration-[600ms] ease-out ${
                  phase === "button" || phase === "other"
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-[70px] opacity-0"
                }`}
              >
                <button
                  className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)]`}
                >
                  <span className={C.bigButtonText}>乗務開始</span>
                </button>
              </div>
            )}

            {phase === "other" && (
              <div
                className={`pt-4 relative z-10 transition-all duration-[900ms] ease-out ${
                  phase === "other"
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-[110px] opacity-0"
                }`}
              >
                {renderSharedInfoSpacer()}

                <div className={`${C.cardClass} h-[220px] bg-white overflow-hidden`}>
                  <div className="h-full flex flex-col">
                    <div className="px-4 pt-3 pb-2 shrink-0 bg-white">
                      <div className="relative flex items-center justify-center h-[22px]">
                        <div className="w-14 h-1.5 rounded-full bg-slate-200" />
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-400">その他</div>
                        <div className="text-[18px] font-extrabold text-slate-800">売上 ¥0</div>
                      </div>
                    </div>

                    <div className="flex-1 px-4 py-8 text-sm text-slate-400 bg-white">
                      まだ履歴はありません
                    </div>
                  </div>
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
                maxPassengers={state.maxPassengers}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

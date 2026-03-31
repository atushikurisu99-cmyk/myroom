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

  const [startupPhase, setStartupPhase] = React.useState("logo"); // logo | logoFade | blank | done
  const [startupOverlayFadeOut, setStartupOverlayFadeOut] = React.useState(false);

  const audioRef = React.useRef(null);
  const audioUnlockedRef = React.useRef(false);

  React.useEffect(() => {
    try {
      audioRef.current = new Audio("./goanzen.wav");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.75;
    } catch (_) {}

    const unlockAudio = () => {
      if (!audioRef.current || audioUnlockedRef.current) return;
      try {
        audioRef.current.currentTime = 0;
        const p = audioRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            try {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              audioUnlockedRef.current = true;
            } catch (_) {}
          }).catch(() => {});
        }
      } catch (_) {}
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    const t1 = setTimeout(() => setStartupPhase("logoFade"), 1200);
    const t2 = setTimeout(() => setStartupPhase("blank"), 1600); // ロゴ消え切り＋白画面開始

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  React.useEffect(() => {
    if (startupPhase !== "blank") return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (_) {}

    const tFade = setTimeout(() => {
      setStartupOverlayFadeOut(true);
    }, 750); // 白画面 約0.75秒

    const tDone = setTimeout(() => {
      setStartupPhase("done");
    }, 1080);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tDone);
    };
  }, [startupPhase]);

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

  const showStartupOverlay = startupPhase !== "done";
  const showLogoLayer = startupPhase === "logo" || startupPhase === "logoFade";
  const showBlankLayer = startupPhase === "blank";

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
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

        <div
          className="h-full flex flex-col overflow-hidden"
          style={{
            touchAction: showStartupOverlay ? "none" : "auto",
            overscrollBehavior: showStartupOverlay ? "none" : "auto",
          }}
        >
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
              startupPhase={startupPhase}
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
              startupButtonOn={false}
              startupOtherOn={false}
              startupPhase={startupPhase}
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
              startupPhase={startupPhase}
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
              startupPhase={startupPhase}
            />
          )}
        </div>
      </div>

      {showStartupOverlay && (
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-[320ms] ${
            startupOverlayFadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            touchAction: "none",
            overscrollBehavior: "none",
          }}
        >
          {showLogoLayer && (
            <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
              <img
                src="./logo.png"
                className={`w-[220px] transition-all duration-[400ms] ease-out ${
                  startupPhase === "logoFade"
                    ? "opacity-0 scale-[1.02]"
                    : "opacity-100 scale-100"
                }`}
                alt=""
              />
            </div>
          )}

          {showBlankLayer && (
            <div className="absolute inset-0 bg-white overflow-hidden" />
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

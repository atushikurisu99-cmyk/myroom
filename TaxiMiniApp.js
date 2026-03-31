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

    const t1 = setTimeout(() => {
      setStartupPhase("prompt");
    }, 2500); // ロゴ1.75秒 + フェード0.75秒

    startupTimersRef.current.push(t1);

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

        {state.cardMode === 1 ? (
          <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-slate-500">売上合計</div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div className="text-[16px] leading-none font-normal text-slate-600">
                {window.AppUtils.formatMoney(derived.totalAmount)}
              </div>
              <div className="text-[12px] leading-none font-normal text-slate-500">
                {derived.recordCount}件
              </div>
            </div>
          </div>
        ) : state.cardMode === 2 ? (
          <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-slate-500">売上目標達成率</div>
            <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">-- %</div>
          </div>
        ) : state.cardMode === 3 ? (
          <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-slate-500">今日のペース</div>
            <div className="mt-1 text-[16px] leading-none font-normal text-[#00a676]">良好</div>
          </div>
        ) : state.cardMode === 4 ? (
          <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-slate-500">① 売上</div>
            <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
              {window.AppUtils.formatMoney(derived.amount1)}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
            <div className="text-[12px] font-medium text-slate-500">② 売上</div>
            <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
              {window.AppUtils.formatMoney(derived.amount2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleStartupBegin = () => {
    if (startupPhase !== "prompt") return;

    clearStartupTimers();
    setStartupPhase("animating");
    setStartupCardOn(false);
    setStartupButtonOn(false);
    setStartupOtherOn(false);

    const tAudio = setTimeout(() => {
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      } catch (_) {}
    }, 250);

    const tCard = setTimeout(() => {
      setStartupCardOn(true);
    }, 750);

    const tButton = setTimeout(() => {
      setStartupButtonOn(true);
    }, 1250);

    const tOther = setTimeout(() => {
      setStartupOtherOn(true);
    }, 1750);

    const tDone = setTimeout(() => {
      setStartupPhase("done");
    }, 2500);

    startupTimersRef.current.push(tAudio, tCard, tButton, tOther, tDone);
  };

  const showStartupOverlay = startupPhase !== "done";
  const showLogo = startupPhase === "logo";
  const showPrompt = startupPhase === "prompt";
  const showAnimating = startupPhase === "animating";

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
          {(state.screen === "top" ||
            state.screen === "standby" ||
            state.screen === "ride" ||
            state.screen === "fare") &&
            renderClockCard(true)}

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
              dragging={refs.sheetDragRef.current.dragging}
              isStandbySheetOpened={derived.isStandbySheetOpened}
            />
          )}

          {state.screen === "ride" && (
            <RideScreen
              pickup={state.pickup}
              pickupMeta={state.pickupMeta}
              rideStartAt={state.rideStartAt}
              selectedPassengers={state.selectedPassengers}
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
              passengerDisplayCount={derived.passengerDisplayCount}
              selectedPassengers={state.selectedPassengers}
              handlePassengerSelect={actions.handlePassengerSelect}
              openPaymentDialog={actions.openPaymentDialog}
            />
          )}
        </div>
      </div>

      {showStartupOverlay && (
        <div className="fixed inset-0 z-[9999] bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
          <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
            {showLogo && (
              <div
                className="absolute inset-0 bg-white flex items-center justify-center"
                style={{
                  animation: "startupLogoFade 2500ms ease forwards",
                }}
              >
                <img
                  src="./logo.png"
                  alt=""
                  className="w-[220px] select-none pointer-events-none"
                />
              </div>
            )}

            {showPrompt && (
              <div className="absolute inset-0 bg-white flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleStartupBegin}
                  className="text-[11px] text-slate-400 tracking-[0.08em] font-medium select-none"
                  style={{
                    animation: "startupPromptPulse 2200ms ease-in-out infinite",
                  }}
                >
                  タップして開始
                </button>
              </div>
            )}

            {showAnimating && (
              <div className="h-full flex flex-col overflow-hidden">
                {renderClockCard(false)}

                <div
                  className="pt-4 shrink-0"
                  style={{
                    height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
                    transform: startupButtonOn
                      ? "translate3d(0,0,0)"
                      : "translate3d(-115%,0,0)",
                    opacity: startupButtonOn ? 1 : 0,
                    transition:
                      "transform 600ms cubic-bezier(0.2,0.8,0.2,1), opacity 180ms linear",
                    willChange: "transform, opacity",
                  }}
                >
                  <button
                    type="button"
                    className={`${C.mainButtonBase} ${C.mainButtonShine} ${
                      !state.dutyStarted
                        ? "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
                        : "bg-[linear-gradient(180deg,#ffdf6b,#ffb100,#cc7900)] text-white"
                    }`}
                  >
                    <span className={C.bigButtonText}>{derived.topMainLabel}</span>
                  </button>
                </div>

                <div
                  style={{
                    transform: startupCardOn
                      ? "translate3d(0,0,0)"
                      : "translate3d(-115%,0,0)",
                    opacity: startupCardOn ? 1 : 0,
                    transition:
                      "transform 600ms cubic-bezier(0.2,0.8,0.2,1), opacity 180ms linear",
                    willChange: "transform, opacity",
                  }}
                >
                  {renderSharedInfoSpacer()}
                </div>

                <div
                  className="flex-1 min-h-0 overflow-hidden"
                  style={{
                    transform: startupOtherOn
                      ? "translate3d(0,0,0)"
                      : "translate3d(-115%,0,0)",
                    opacity: startupOtherOn ? 1 : 0,
                    transition:
                      "transform 600ms cubic-bezier(0.2,0.8,0.2,1), opacity 180ms linear",
                    willChange: "transform, opacity",
                  }}
                >
                  <TopScreen
                    topMainLabel={derived.topMainLabel}
                    topMainButtonDisabled={derived.topMainButtonDisabled}
                    handleTopMain={() => {}}
                    renderSharedInfoSpacer={() => null}
                    topScrollRef={refs.topScrollRef}
                    openOtherSheet={() => {}}
                    openHistoryModal={() => {}}
                    previewRecords={derived.previewRecords}
                  />
                </div>
              </div>
            )}
          </div>

          <style>{`
            @keyframes startupLogoFade {
              0% { opacity: 1; }
              70% { opacity: 1; }
              100% { opacity: 0; }
            }

            @keyframes startupPromptPulse {
              0% { opacity: 0.25; }
              50% { opacity: 0.6; }
              100% { opacity: 0.25; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

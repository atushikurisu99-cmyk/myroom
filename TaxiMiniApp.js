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

  const [startupPhase, setStartupPhase] = React.useState("logo"); // logo | logoFade | blank | startup | done
  const [startupCardOn, setStartupCardOn] = React.useState(false);
  const [startupButtonOn, setStartupButtonOn] = React.useState(false);
  const [startupOtherOn, setStartupOtherOn] = React.useState(false);
  const [startupOverlayFadeOut, setStartupOverlayFadeOut] = React.useState(false);

  const audioRef = React.useRef(null);
  const audioUnlockTriedRef = React.useRef(false);

  React.useEffect(() => {
    try {
      audioRef.current = new Audio("./goanzen.wav");
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.75;
    } catch (_) {}

    const unlockAudio = () => {
      if (!audioRef.current || audioUnlockTriedRef.current) return;
      audioUnlockTriedRef.current = true;
      try {
        audioRef.current.currentTime = 0;
        const p = audioRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            try {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            } catch (_) {}
          }).catch(() => {
            audioUnlockTriedRef.current = false;
          });
        }
      } catch (_) {
        audioUnlockTriedRef.current = false;
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    const t1 = setTimeout(() => setStartupPhase("logoFade"), 1200);
    const t2 = setTimeout(() => setStartupPhase("blank"), 1600);   // ロゴ消え切り
    const t3 = setTimeout(() => setStartupPhase("startup"), 2350); // 白画面 約0.75秒

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  React.useEffect(() => {
    if (startupPhase !== "blank") return;
    try {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch (_) {}
  }, [startupPhase]);

  React.useEffect(() => {
    if (startupPhase !== "startup") return;

    setStartupCardOn(false);
    setStartupButtonOn(false);
    setStartupOtherOn(false);
    setStartupOverlayFadeOut(false);

    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setStartupCardOn(true);
      });
    });

    // カードが収まってから少し置いて主ボタン
    const tButton = setTimeout(() => {
      setStartupButtonOn(true);
    }, 1450);

    // 主ボタンの少し後にその他
    const tOther = setTimeout(() => {
      setStartupOtherOn(true);
    }, 1650);

    // 起動演出オーバーレイを消す
    const tFade = setTimeout(() => {
      setStartupOverlayFadeOut(true);
    }, 3200);

    const tDone = setTimeout(() => {
      setStartupPhase("done");
    }, 3560);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(tButton);
      clearTimeout(tOther);
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
  const showStartupLayer = startupPhase === "startup";

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      {/* 本画面は最初から描画しておく */}
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
              startupButtonOn={false}
              startupOtherOn={false}
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

      {/* 起動演出オーバーレイ */}
      {showStartupOverlay && (
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-[320ms] ${
            startupOverlayFadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {showLogoLayer && (
            <div className="absolute inset-0 bg-white flex items-center justify-center">
              <img
                src="./logo.png"
                className={`w-[220px] transition-all duration-[400ms] ease-out ${
                  startupPhase === "logoFade"
                    ? "opacity-0 scale-[1.02]"
                    : "opacity-100 scale-100"
                }`}
              />
            </div>
          )}

          {showBlankLayer && (
            <div className="absolute inset-0 bg-white" />
          )}

          {showStartupLayer && (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
              <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
                <div className="relative h-full">
                  {/* カード */}
                  <div
                    className="absolute left-4 right-4 z-30"
                    style={{
                      top: "16px",
                      transform: startupCardOn
                        ? "translate3d(0,0,0)"
                        : "translate3d(-280px,0,0)",
                      transition: "transform 700ms cubic-bezier(0.2,0.8,0.2,1)",
                      willChange: "transform",
                    }}
                  >
                    {renderClockCard()}
                  </div>

                  {/* 主ボタン */}
                  <div
                    className="absolute left-4 right-4 z-20"
                    style={{
                      top: "204px",
                      transform: startupButtonOn
                        ? "translate3d(0,0,0)"
                        : "translate3d(0,-145px,0)",
                      opacity: startupButtonOn ? 1 : 0,
                      transition:
                        "transform 760ms cubic-bezier(0.2,0.8,0.2,1), opacity 180ms linear",
                      willChange: "transform, opacity",
                    }}
                  >
                    <button
                      className={`${C.mainButtonBase} ${C.mainButtonShine} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)]`}
                    >
                      <span className={C.bigButtonText}>乗務開始</span>
                    </button>
                  </div>

                  {/* その他 */}
                  <div
                    className="absolute left-4 right-4 z-10"
                    style={{
                      top: "316px",
                      transform: startupOtherOn
                        ? "translate3d(0,0,0)"
                        : "translate3d(0,-220px,0)",
                      opacity: startupOtherOn ? 1 : 0,
                      transition:
                        "transform 860ms cubic-bezier(0.2,0.8,0.2,1), opacity 220ms linear",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className={`${C.cardClass} h-[220px] bg-white overflow-hidden`}>
                      <div className="h-full flex flex-col">
                        <div className="px-4 pt-3 pb-2 shrink-0 bg-white">
                          <div className="relative flex items-center justify-center h-[22px]">
                            <div className="w-14 h-1.5 rounded-full bg-slate-200" />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-400">その他</div>
                            <div className="text-[18px] font-extrabold text-slate-800">
                              売上 ¥0
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 px-4 py-8 text-sm text-slate-400 bg-white">
                          まだ履歴はありません
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

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
    audioRef.current.volume = 0.6;

    const t1 = setTimeout(() => setPhase("logoFade"), 1500); // ロゴ表示
    const t2 = setTimeout(() => setPhase("white"), 3000); // ロゴフェード（1.5秒）
    const t3 = setTimeout(() => {
      setPhase("card");
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }, 3500); // 白→音
    const t4 = setTimeout(() => setPhase("button"), 3800);
    const t5 = setTimeout(() => setPhase("other"), 4100);
    const t6 = setTimeout(() => setPhase("app"), 4400);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  const renderSharedInfoSpacer = () => (
    <div className="pt-4 shrink-0">
      <div
        className="rounded-[28px] opacity-0 pointer-events-none"
        style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">

      {/* ロゴ */}
      {(phase === "logo" || phase === "logoFade") && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <img
            src="./logo.png"
            className={`w-[220px] transition-all duration-[1500ms] ${
              phase === "logoFade" ? "opacity-0 scale-105" : "opacity-100"
            }`}
          />
        </div>
      )}

      {/* 白画面 */}
      {phase === "white" && (
        <div className="fixed inset-0 z-[9998] bg-white" />
      )}

      {/* メインUI */}
      {(phase === "card" ||
        phase === "button" ||
        phase === "other" ||
        phase === "app") && (
        <div
          className="w-full max-w-sm min-h-screen px-4 pt-4 relative"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
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

          <div className="min-h-screen flex flex-col">

            {/* カード */}
            {(phase !== "white") && (
              <div
                className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0 transition-all duration-300 ${
                  phase === "card" || phase === "button" || phase === "other" || phase === "app"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <div className="flex justify-between">
                  <div className="text-[15px] font-semibold text-slate-700">
                    {derived.stateLabel}
                  </div>
                  <div className="text-[58px] font-black text-slate-800">
                    {derived.timeParts.hh}:{derived.timeParts.mm}
                  </div>
                </div>
              </div>
            )}

            {/* メインボタン */}
            {(phase === "button" || phase === "other" || phase === "app") && (
              <div className="pt-4 transition-all duration-300">
                <button
                  onClick={actions.handleTopMain}
                  className={`${C.mainButtonBase} ${C.mainButtonShine}`}
                >
                  <span className={C.bigButtonText}>
                    {derived.topMainLabel}
                  </span>
                </button>
              </div>
            )}

            {/* その他 */}
            {(phase === "other" || phase === "app") && (
              <div className="pt-4 transition-all duration-300">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

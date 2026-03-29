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

  const [showSplash, setShowSplash] = React.useState(true);
  const [showUI, setShowUI] = React.useState(false);

  React.useEffect(() => {
    // ロゴ表示（1.5秒）
    const t1 = setTimeout(() => {
      setShowUI(true);
    }, 1500);

    // 完全に消す
    const t2 = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      
      {/* スプラッシュ（ロゴ） */}
      {showSplash && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500">
          <img
            src="./logo.png"
            alt="logo"
            className={`w-[220px] transition-all duration-700 ${
              showUI ? "opacity-0 scale-110" : "opacity-100 scale-100"
            }`}
          />
        </div>
      )}

      {/* メインUI */}
      <div
        className={`w-full max-w-sm min-h-screen px-4 pt-4 relative transition-opacity duration-700 ${
          showUI ? "opacity-100" : "opacity-0"
        }`}
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
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

        <div className="min-h-screen flex flex-col">

          {/* 状態カード */}
          <div
            className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0 transition-all duration-500 ${
              showUI ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-start justify-between">
                <div className="text-[15px] font-semibold text-slate-700">
                  {derived.stateLabel}
                </div>
                <div className="text-[58px] font-black text-slate-800">
                  {derived.timeParts.hh}:{derived.timeParts.mm}
                </div>
              </div>
            </div>
          </div>

          {/* メインボタン */}
          <div
            className={`pt-4 transition-all duration-500 delay-100 ${
              showUI ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={actions.handleTopMain}
              className={`${C.mainButtonBase} ${C.mainButtonShine}`}
            >
              <span className={C.bigButtonText}>
                {derived.topMainLabel}
              </span>
            </button>
          </div>

          {/* その他 */}
          <div
            className={`pt-4 transition-all duration-500 delay-200 ${
              showUI ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
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

        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

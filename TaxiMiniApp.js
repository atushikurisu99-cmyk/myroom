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
            <div onClick={actions.handleCardModeNext}>
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
              topMainButtonDisabled={derived.topMainButtonDisabled}
              handleTopMain={actions.handleTopMain}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
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
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

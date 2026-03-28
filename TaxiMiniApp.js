const useTaxiAppState =
  window.AppHooks?.useTaxiAppState || window.useTaxiAppState;

const OtherSheet =
  window.AppComponents?.OtherSheet || window.OtherSheet;
const PaymentDialog =
  window.AppComponents?.PaymentDialog || window.PaymentDialog;
const ViaDialog =
  window.AppComponents?.ViaDialog || window.ViaDialog;
const FinishDialog =
  window.AppComponents?.FinishDialog || window.FinishDialog;

const TopScreen =
  window.AppScreens?.TopScreen || window.TopScreen;
const StandbyScreen =
  window.AppScreens?.StandbyScreen || window.StandbyScreen;
const RideScreen =
  window.AppScreens?.RideScreen || window.RideScreen;
const FareScreen =
  window.AppScreens?.FareScreen || window.FareScreen;
const HistoryModal =
  window.AppScreens?.HistoryModal || window.HistoryModal;

function TaxiMiniApp() {
  if (!useTaxiAppState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#eef3f9] text-slate-700 text-base font-semibold px-6 text-center">
        useTaxiAppState が読み込めていません
      </div>
    );
  }

  const { refs, state, derived, actions } = useTaxiAppState();
  const C = window.AppConstants;

  const renderSharedInfoSpacer = () => (
    <div className="pt-4 shrink-0">
      <div
        className="rounded-[28px] opacity-0 pointer-events-none"
        style={{ height: `${C.SHARED_INFO_SLOT_HEIGHT}px` }}
      />
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

        {OtherSheet ? (
          <OtherSheet
            show={state.showOtherSheet}
            onClose={() => actions.setShowOtherSheet(false)}
            openHistoryModal={actions.openHistoryModal}
          />
        ) : null}

        {state.showPaymentDialog && PaymentDialog ? (
          <PaymentDialog
            amount={state.amount}
            pickupMeta={state.pickupMeta}
            dropoffMeta={state.dropoffMeta}
            paymentCountdown={state.paymentCountdown}
            savingDots={state.savingDots}
            onCancel={actions.cancelPaymentDialog}
          />
        ) : null}

        {state.showViaDialog && ViaDialog ? (
          <ViaDialog
            pendingViaPlace={state.pendingViaPlace}
            onCancel={actions.cancelViaDialog}
            onRecord={actions.recordVia}
          />
        ) : null}

        {state.showFinishDialog && FinishDialog ? (
          <FinishDialog
            workDate={state.workDate}
            recordCount={derived.recordCount}
            totalAmount={derived.totalAmount}
            onCancel={() => actions.setShowFinishDialog(false)}
            onConfirm={actions.performDutyEnd}
          />
        ) : null}

        {HistoryModal ? (
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
        ) : null}

        <div className="h-full flex flex-col overflow-hidden">
          {(state.screen === "top" ||
            state.screen === "standby" ||
            state.screen === "ride" ||
            state.screen === "fare") && (
            <div
              className={`${C.cardClass} h-[172px] px-4 py-4 shrink-0 overflow-hidden`}
              onClick={actions.handleCardModeNext}
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
                    <div className="mt-1 text-[16px] leading-none font-normal text-slate-600">
                      -- %
                    </div>
                  </div>
                ) : state.cardMode === 3 ? (
                  <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
                    <div className="text-[12px] font-medium text-slate-500">今日のペース</div>
                    <div className="mt-1 text-[16px] leading-none font-normal text-[#00a676]">
                      良好
                    </div>
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
          )}

          {state.screen === "top" && TopScreen ? (
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
          ) : null}

          {state.screen === "standby" && StandbyScreen ? (
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
          ) : null}

          {state.screen === "ride" && RideScreen ? (
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
          ) : null}

          {state.screen === "fare" && FareScreen ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

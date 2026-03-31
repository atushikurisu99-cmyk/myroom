window.TaxiMiniApp = (() => {
  const { useTaxiAppState } = window.AppHooks;
  const { OtherSheet, PaymentDialog, ViaDialog, FinishDialog } = window.AppComponents;

  const TopScreen = window.AppScreens.TopScreen;
  const StandbyScreen = window.AppScreens.StandbyScreen;
  const RideScreen = window.AppScreens.RideScreen;
  const FareScreen = window.AppScreens.FareScreen;
  const HistoryModal = window.AppScreens.HistoryModal;

  return function TaxiMiniApp() {
    const state = useTaxiAppState();

    const {
      currentScreen,

      // handlers
      handleStartDuty,
      handleStartRide,
      handleDropOff,

      // UI helpers
      renderSharedInfoSpacer,

      // finish
      handleFinishTap,
      isFinishVisible,

      // other
      openOtherSheet,
      closeOtherSheet,

      // history
      openHistoryModal,
      closeHistoryModal,
      previewRecords,

      // standby sheet
      standbySheetOffset,
      beginStandbySheetDrag,
      toggleStandbySheet,
      dragging,
      isStandbySheetOpened,

      // dialogs
      isPaymentOpen,
      closePayment,
      isViaOpen,
      closeVia,
      isFinishDialogOpen,
      closeFinishDialog,
      confirmFinish,

    } = state;

    return (
      <div className="w-full h-screen overflow-hidden flex flex-col">

        {/* ===== メイン画面 ===== */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

          {currentScreen === "top" && (
            <TopScreen
              handleStartDuty={handleStartDuty}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
            />
          )}

          {currentScreen === "standby" && (
            <StandbyScreen
              handleStartRide={handleStartRide}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
              handleFinishTap={handleFinishTap}
              isFinishVisible={isFinishVisible}
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
              standbySheetOffset={standbySheetOffset}
              beginStandbySheetDrag={beginStandbySheetDrag}
              toggleStandbySheet={toggleStandbySheet}
              dragging={dragging}
              isStandbySheetOpened={isStandbySheetOpened}
            />
          )}

          {currentScreen === "ride" && (
            <RideScreen
              handleDropOff={handleDropOff}
              renderSharedInfoSpacer={renderSharedInfoSpacer}
              openOtherSheet={openOtherSheet}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          )}

          {currentScreen === "fare" && (
            <FareScreen />
          )}
        </div>

        {/* ===== モーダル群 ===== */}
        {state.isOtherOpen && (
          <OtherSheet onClose={closeOtherSheet} />
        )}

        {state.isHistoryOpen && (
          <HistoryModal onClose={closeHistoryModal} />
        )}

        {isPaymentOpen && (
          <PaymentDialog onClose={closePayment} />
        )}

        {isViaOpen && (
          <ViaDialog onClose={closeVia} />
        )}

        {isFinishDialogOpen && (
          <FinishDialog
            onClose={closeFinishDialog}
            onConfirm={confirmFinish}
          />
        )}
      </div>
    );
  };
})();

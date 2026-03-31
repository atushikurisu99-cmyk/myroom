window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      topMainLabel,
      topMainButtonDisabled,
      handleTopMain,
      renderSharedInfoSpacer,
      topScrollRef,
      openOtherSheet,
      openHistoryModal,
      previewRecords,
      totalAmount,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="pt-4 shrink-0" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            type="button"
            onClick={handleTopMain}
            disabled={topMainButtonDisabled}
            className={`${C.mainButtonBase} ${C.mainButtonShine} ${
              topMainButtonDisabled
                ? "bg-[linear-gradient(180deg,#d5dbe3,#bcc6d2,#97a3b2)] text-white"
                : "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
            }`}
          >
            <span className={C.bigButtonText}>{topMainLabel}</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div ref={topScrollRef} className="flex-1 min-h-0 overflow-hidden">
          <BottomCard
            movable={false}
            standbySheetOffset={0}
            openOtherSheet={openOtherSheet}
            openHistoryModal={openHistoryModal}
            previewRecords={previewRecords}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    );
  };
})();

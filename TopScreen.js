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
      openOtherSheet,
      openHistoryModal,
      previewRecords,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className="pt-4 shrink-0"
          style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={handleTopMain}
            disabled={topMainButtonDisabled}
            className={`${C.mainButtonBase} ${C.mainButtonShine} ${
              topMainLabel === "乗務終了"
                ? "bg-[linear-gradient(180deg,#ffdf6b,#ffb100,#cc7900)] text-white"
                : "bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white"
            }`}
          >
            <span className={C.bigButtonText}>{topMainLabel}</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="pt-4 shrink-0">
          <BottomCard
            movable={false}
            openOtherSheet={openOtherSheet}
            openHistoryModal={openHistoryModal}
            previewRecords={previewRecords}
          />
        </div>
      </div>
    );
  };
})();

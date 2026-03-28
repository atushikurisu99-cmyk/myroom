window.StandbyScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const {
    SHARED_INFO_SLOT_HEIGHT,
    MAIN_BUTTON_SLOT_HEIGHT,
    STANDBY_OTHER_MOVE_RANGE,
    mainButtonBase,
    mainButtonShine,
    bigButtonText,
    endDutyButtonClass,
  } = window.AppConstants;

  function StandbyScreen(props) {
    const {
      handleStartRide,
      handleFinishTap,
      standbySheetOffset,
      setStandbySheetOffset,
      sheetDragRef,
      previewRecords,
      setShowOtherSheet,
      openHistoryModal,
      renderSharedInfoSpacer,
      isFinishVisible,
    } = props;

    const STANDBY_REVEAL_TOP = SHARED_INFO_SLOT_HEIGHT + 18;
    const STANDBY_REVEAL_PANEL_HEIGHT = 206;
    const HANDLE_BOTTOM = 14;
    const HANDLE_SNAP_THRESHOLD = STANDBY_OTHER_MOVE_RANGE * 0.5;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const isOpened = standbySheetOffset >= HANDLE_SNAP_THRESHOLD;

    const beginStandbySheetDrag = (clientY) => {
      sheetDragRef.current = {
        dragging: true,
        startY: clientY,
        startOffset: standbySheetOffset,
      };
    };

    const updateStandbySheetDrag = (clientY) => {
      if (!sheetDragRef.current.dragging) return;
      const delta = clientY - sheetDragRef.current.startY;
      const nextOffset = clamp(
        sheetDragRef.current.startOffset + delta,
        0,
        STANDBY_OTHER_MOVE_RANGE
      );
      setStandbySheetOffset(nextOffset);
    };

    const endStandbySheetDrag = () => {
      if (!sheetDragRef.current.dragging) return;
      sheetDragRef.current.dragging = false;
      setStandbySheetOffset((prev) =>
        prev >= HANDLE_SNAP_THRESHOLD ? STANDBY_OTHER_MOVE_RANGE : 0
      );
    };

    const toggleStandbySheet = () => {
      setStandbySheetOffset((prev) =>
        prev >= HANDLE_SNAP_THRESHOLD ? 0 : STANDBY_OTHER_MOVE_RANGE
      );
    };

    React.useEffect(() => {
      const handleMouseMove = (e) => updateStandbySheetDrag(e.clientY);
      const handleMouseUp = () => endStandbySheetDrag();

      const handleTouchMove = (e) => {
        if (!sheetDragRef.current.dragging) return;
        if (e.cancelable) e.preventDefault();
        updateStandbySheetDrag(e.touches[0].clientY);
      };

      const handleTouchEnd = () => endStandbySheetDrag();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("touchcancel", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
      };
    }, [standbySheetOffset]);

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="pt-4 shrink-0" style={{ height: `${MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            type="button"
            onClick={handleStartRide}
            className={`${mainButtonBase} ${mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}
          >
            <span className={bigButtonText}>実車</span>
          </button>
        </div>

        {renderSharedInfoSpacer()}

        <div className="flex-1 min-h-0 relative overflow-hidden">
          <div
            className="absolute inset-x-0 z-10 px-1"
            style={{
              top: `${STANDBY_REVEAL_TOP}px`,
              height: `${STANDBY_REVEAL_PANEL_HEIGHT}px`,
            }}
          >
            <div className="h-full rounded-[30px] bg-[#eef3f9] border border-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] px-2 pt-3 pb-3">
              <div className="w-full h-full rounded-[26px] bg-[linear-gradient(180deg,#edf2f8,#e6edf5)] flex items-center justify-center px-2">
                <button
                  type="button"
                  onClick={handleFinishTap}
                  disabled={!isFinishVisible}
                  className={`${endDutyButtonClass} transition-opacity duration-160 ${
                    isFinishVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{ width: "100%" }}
                >
                  乗務終了
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 z-30">
            <BottomCard
              movable={true}
              standbySheetOffset={standbySheetOffset}
              dragging={sheetDragRef.current.dragging}
              isFinishVisible={isFinishVisible}
              beginDrag={beginStandbySheetDrag}
              openOtherSheet={() => setShowOtherSheet(true)}
              openHistoryModal={openHistoryModal}
              previewRecords={previewRecords}
            />
          </div>

          <div
            className="absolute inset-x-0 z-40 flex justify-center"
            style={{ bottom: `${HANDLE_BOTTOM}px` }}
          >
            <button
              type="button"
              onClick={toggleStandbySheet}
              onMouseDown={(e) => beginStandbySheetDrag(e.clientY)}
              onTouchStart={(e) => beginStandbySheetDrag(e.touches[0].clientY)}
              className="flex flex-col items-center justify-center py-2 px-6 active:opacity-80"
            >
              <div className="w-14 h-1.5 rounded-full bg-slate-300 mb-2"></div>
              <div className="text-[13px] font-semibold text-slate-400">
                {isOpened ? "↑ 隠す" : "↓ 下へ"}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return StandbyScreen;
})();

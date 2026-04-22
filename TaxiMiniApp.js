// 変更点はBottomNav部分のみ修正してるが、全部貼り替え用にそのまま出す

{showBottomNav && startupPhase !== "tapFade" && (
  <BottomNav
    centerLabel={navCenterLabel}
    onHome={actions.goHome}
    onCenter={
      state.screen === "top"
        ? actions.openExpenseSoon
        : actions.openHistorySimple
    }
    onMenu={actions.openMenu}
    active={state.screen === "top" ? "home" : "center"}

    // ★追加ここ
    isOpen={state.homeEndSheetOpen}
    onToggle={actions.toggleHomeEndSheet}
  />
)}

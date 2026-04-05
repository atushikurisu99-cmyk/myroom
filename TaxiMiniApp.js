function TaxiMiniApp() {
  const { state, actions } = useTaxiAppState();

  if (state.screen === "top") {
    return (
      <TopScreen
        dutyStarted={state.dutyStarted}
        isRiding={state.isRiding}
        startDuty={actions.handleDutyStart}
        startRide={actions.handleStartRide}
        drop={actions.handleDropOffTap}
        showBottom={state.showBottom}
        setShowBottom={actions.setShowBottom}
        finish={actions.performDutyEnd}
      />
    );
  }

  if (!state.isRiding) {
    return <StandbyScreen startRide={actions.handleStartRide} />;
  }

  return <RideScreen drop={actions.handleDropOffTap} />;
}

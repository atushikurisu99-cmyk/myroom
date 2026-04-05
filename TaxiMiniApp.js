const { useTaxiAppState } = window.AppHooks;
const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;

function TaxiMiniApp() {
  const { state, actions } = useTaxiAppState();

  return (
    <div className="h-full bg-slate-100">

      {state.screen === "top" && (
        <TopScreen
          mainLabel="乗務開始"
          handleMain={actions.handleMain}
          showBottom={state.showBottom}
          setShowBottom={actions.setShowBottom}
          handleFinish={actions.handleFinish}
        />
      )}

      {state.screen === "standby" && (
        <StandbyScreen handleStartRide={actions.handleMain} />
      )}

      {state.screen === "ride" && (
        <RideScreen handleDropOffTap={actions.handleMain} />
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

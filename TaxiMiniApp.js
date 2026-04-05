const { useTaxiAppState } = window.AppHooks;

const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;

function App() {
  const { state, actions } = useTaxiAppState();

  const [bottomOpen, setBottomOpen] = React.useState(false);

  const commonProps = {
    timeParts: state.timeParts,
    weather: state.weather,
    totalAmount: state.totalAmount,
    recordCount: state.recordCount,
  };

  if (state.screen === "home") {
    return (
      <TopScreen
        {...commonProps}
        bottomOpen={bottomOpen}
        setBottomOpen={setBottomOpen}
        startDuty={actions.startDuty}
        finishDuty={actions.finishDuty}
      />
    );
  }

  if (!state.isRiding) {
    return (
      <StandbyScreen
        {...commonProps}
        startRide={actions.startRide}
      />
    );
  }

  return (
    <RideScreen
      {...commonProps}
      drop={actions.drop}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

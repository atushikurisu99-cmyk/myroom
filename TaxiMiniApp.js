const { useState } = React;

function TaxiMiniApp() {
  const { Shell } = window.__AppShared;
  const [screen, setScreen] = useState('top');

  return (
    <Shell>
      {screen === 'top' && <TopScreen onAdvance={() => setScreen('standby')} />}
      {screen === 'standby' && <StandbyScreen onAdvance={() => setScreen('ride')} />}
      {screen === 'ride' && <RideScreen onAdvance={() => setScreen('fare')} />}
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TaxiMiniApp />);


const { useState } = React;

function TaxiMiniApp() {
  const [screen, setScreen] = useState("top");

  if (screen === "top") return <TopScreen onNext={()=>setScreen("standby")} />;
  if (screen === "standby") return <StandbyScreen onNext={()=>setScreen("ride")} />;
  if (screen === "ride") return <RideScreen onNext={()=>setScreen("top")} />;

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

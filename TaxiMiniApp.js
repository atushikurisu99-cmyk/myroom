const{useTaxiAppState}=window.AppHooks;
const TopScreen=window.AppScreens.TopScreen;
const StandbyScreen=window.AppScreens.StandbyScreen;
const RideScreen=window.AppScreens.RideScreen;

function App(){

const{state,actions}=useTaxiAppState();

return(
<div className="h-full">

{state.screen==="top"&&(
<TopScreen
mainLabel="乗務開始"
onMain={actions.handleMain}
showBottom={state.showBottom}
setShowBottom={actions.setShowBottom}
onFinish={actions.handleFinish}
/>
)}

{state.screen==="standby"&&(
<StandbyScreen onStart={actions.handleMain}/>
)}

{state.screen==="ride"&&(
<RideScreen onDrop={actions.handleMain}/>
)}

</div>
);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

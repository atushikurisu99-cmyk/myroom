const{useTaxiAppState}=window.AppHooks;
const TopScreen=window.AppScreens.TopScreen;
const StandbyScreen=window.AppScreens.StandbyScreen;
const RideScreen=window.AppScreens.RideScreen;

function App(){

const{state,actions}=useTaxiAppState();

if(state.screen==="home"){
return <TopScreen state={state} actions={actions}/>;
}

if(!state.isRiding){
return <StandbyScreen actions={actions}/>;
}

return <RideScreen actions={actions}/>;

}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

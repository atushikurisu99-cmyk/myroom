window.AppScreens=window.AppScreens||{};
window.AppScreens.TopScreen=(()=>{

const{HeaderArea,MainButton,BottomNav,BottomCard,GraphEntry}=window.AppComponents;

return function TopScreen({state,actions}){

const label=state.isRiding?"降車":"実車";

return(
<div style={{height:"100%",position:"relative"}}>

<HeaderArea>
<div style={{color:"#fff",fontSize:"40px"}}>12:00</div>
</HeaderArea>

<div style={{padding:"16px"}}>
<MainButton
label={state.screen==="home"?"乗務開始":label}
onClick={()=>{
if(state.screen==="home")actions.startDuty();
else if(!state.isRiding)actions.startRide();
else actions.drop();
}}
color="#32cd32"
/>
</div>

<GraphEntry/>

<button
onClick={()=>actions.setBottomOpen(!state.bottomOpen)}
style={{
position:"absolute",
right:"20px",
bottom:"120px"
}}
>
▲
</button>

<BottomCard
show={state.bottomOpen}
onClose={()=>actions.setBottomOpen(false)}
onFinish={actions.finish}
/>

<BottomNav
mode="home"
onHome={()=>{}}
onCenter={()=>{}}
onMenu={()=>{}}
/>

</div>
);
};

})();

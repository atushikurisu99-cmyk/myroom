window.AppScreens.StandbyScreen=(()=>{

const{HeaderArea,MainButton,BottomNav}=window.AppComponents;

return function StandbyScreen({actions}){

return(
<div style={{height:"100%"}}>

<HeaderArea>
<div style={{color:"#fff",fontSize:"40px"}}>12:00</div>
</HeaderArea>

<div style={{padding:"16px"}}>
<MainButton label="実車" onClick={actions.startRide} color="#0072d9"/>
</div>

<BottomNav mode="ride" onHome={()=>{}} onCenter={()=>{}} onMenu={()=>{}}/>

</div>
);
};

})();

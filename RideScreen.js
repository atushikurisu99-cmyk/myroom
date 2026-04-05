window.AppScreens.RideScreen=(()=>{

const{HeaderArea,MainButton,BottomNav}=window.AppComponents;

return function RideScreen({actions}){

return(
<div style={{height:"100%"}}>

<HeaderArea>
<div style={{color:"#fff",fontSize:"40px"}}>12:00</div>
</HeaderArea>

<div style={{padding:"16px"}}>
<MainButton label="降車" onClick={actions.drop} color="#ffaa00"/>
</div>

<BottomNav mode="ride" onHome={()=>{}} onCenter={()=>{}} onMenu={()=>{}}/>

</div>
);
};

})();

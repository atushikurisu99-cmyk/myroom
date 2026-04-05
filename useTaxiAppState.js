window.AppHooks=(()=>{

const{useState}=React;

function useTaxiAppState(){

const[screen,setScreen]=useState("home");
const[isRiding,setIsRiding]=useState(false);
const[bottomOpen,setBottomOpen]=useState(false);

const startDuty=()=>setScreen("standby");
const startRide=()=>setIsRiding(true);
const drop=()=>setIsRiding(false);

const finish=()=>{
setScreen("home");
setIsRiding(false);
setBottomOpen(false);
};

return{
state:{screen,isRiding,bottomOpen},
actions:{
startDuty,
startRide,
drop,
finish,
setBottomOpen
}
};

}

return{useTaxiAppState};

})();

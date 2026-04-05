window.AppComponents=(()=>{

function HeaderArea({children}){
return(
<div style={{
background:"#32cd32",
padding:"16px",
borderRadius:"0 0 24px 24px"
}}>
{children}
</div>
);
}

function MainButton({label,onClick,color}){
return(
<button
onClick={onClick}
style={{
width:"100%",
height:"120px",
borderRadius:"24px",
background:color,
color:"#fff",
fontSize:"28px",
fontWeight:"bold"
}}
>
{label}
</button>
);
}

function BottomNav({mode,onHome,onCenter,onMenu}){

const centerLabel=mode==="home"?"経費":"履歴";

return(
<div style={{
position:"absolute",
bottom:0,
left:0,
right:0,
height:"80px",
background:"#32cd32",
display:"flex"
}}>
<button style={{flex:1}} onClick={onHome}>ホーム</button>
<button style={{flex:1}} onClick={onCenter}>{centerLabel}</button>
<button style={{flex:1}} onClick={onMenu}>メニュー</button>
</div>
);
}

function BottomCard({show,onClose,onFinish}){

if(!show)return null;

return(
<div
onClick={onClose}
style={{
position:"absolute",
bottom:"80px",
left:0,
right:0,
background:"#fff",
padding:"16px"
}}
>
<button
onClick={onFinish}
style={{
width:"100%",
height:"60px",
background:"#444",
color:"#fff"
}}
>
本日の乗務を終了
</button>
</div>
);
}

function GraphEntry(){
return(
<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"10px",
padding:"16px"
}}>
{[1,2,3,4,5,6].map(i=>(
<div key={i} style={{
height:"80px",
background:"#f2f2f2",
borderRadius:"16px"
}}/>
))}
</div>
);
}

return{
HeaderArea,
MainButton,
BottomNav,
BottomCard,
GraphEntry
};

})();

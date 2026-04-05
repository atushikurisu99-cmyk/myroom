window.AppScreens=window.AppScreens||{};
window.AppScreens.TopScreen=(()=>{

const {BottomCard}=window.AppComponents;

return function TopScreen(props){

const{
mainLabel,
onMain,
showBottom,
setShowBottom,
onFinish
}=props;

return(
<div className="flex-1 flex flex-col">

<div className="p-4 h-[140px]">
<button
onClick={onMain}
className="w-full h-full bg-blue-500 text-white text-xl rounded-2xl"
>
{mainLabel}
</button>
</div>

{/* ▲ */}
<button
onClick={()=>setShowBottom(v=>!v)}
className="absolute bottom-20 right-4 text-3xl"
>
▲
</button>

<BottomCard
show={showBottom}
onClose={()=>setShowBottom(false)}
onFinish={onFinish}
/>

</div>
);
};

})();

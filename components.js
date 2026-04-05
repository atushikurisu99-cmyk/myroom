window.AppComponents=(()=>{

function BottomCard({show,onClose,onFinish}){

if(!show)return null;

return(
<div className="absolute inset-0 z-30 flex items-end bg-black/30"
onClick={onClose}>

<div
className="w-full bg-white rounded-t-[28px] p-4"
onClick={(e)=>e.stopPropagation()}
style={{
transform:"translateY(0)",
transition:"transform 200ms ease-out"
}}
>

<button
onClick={onFinish}
className="w-full h-[60px] rounded-2xl bg-slate-800 text-white text-lg font-bold"
>
本日の乗務を終了
</button>

</div>
</div>
);
}

return{BottomCard};

})();

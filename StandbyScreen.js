window.AppScreens.StandbyScreen=(()=>{

return function StandbyScreen({onStart}){

return(
<div className="flex-1 p-4">

<button
onClick={onStart}
className="w-full h-[140px] bg-blue-500 text-white text-xl rounded-2xl"
>
実車
</button>

</div>
);
};

})();

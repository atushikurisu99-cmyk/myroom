window.AppScreens.RideScreen=(()=>{

return function RideScreen({onDrop}){

return(
<div className="flex-1 p-4">

<button
onClick={onDrop}
className="w-full h-[140px] bg-yellow-500 text-white text-xl rounded-2xl"
>
降車
</button>

</div>
);
};

})();

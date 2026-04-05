window.AppScreens.RideScreen = (() => {
  const { BottomNav } = window.AppComponents;

  return function RideScreen({ drop }) {
    return (
      <div className="h-full relative pb-[90px]">

        <div className="p-4">
          <button
            onClick={drop}
            className="w-full h-[120px] bg-orange-400 text-white text-2xl rounded-2xl"
          >
            降車
          </button>
        </div>

        <BottomNav isHome={false} />
      </div>
    );
  };
})();

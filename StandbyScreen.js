window.AppScreens.StandbyScreen = (() => {
  const { BottomNav } = window.AppComponents;

  return function StandbyScreen({ startRide }) {
    return (
      <div className="h-full relative pb-[90px]">

        <div className="p-4">
          <button
            onClick={startRide}
            className="w-full h-[120px] bg-blue-500 text-white text-2xl rounded-2xl"
          >
            実車
          </button>
        </div>

        <BottomNav isHome={false} />
      </div>
    );
  };
})();

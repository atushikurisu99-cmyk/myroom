window.AppScreens.TopScreen = (() => {
  const { BottomCard, GraphEntryGrid, BottomNav } = window.AppComponents;

  return function TopScreen(props) {
    const {
      dutyStarted,
      isRiding,
      startDuty,
      startRide,
      drop,
      showBottom,
      setShowBottom,
      finish,
    } = props;

    let label = "乗務開始";
    if (dutyStarted && !isRiding) label = "実車";
    if (isRiding) label = "降車";

    return (
      <div className="h-full relative pb-[90px]">

        {/* 主ボタン */}
        <div className="p-4">
          <button
            onClick={() => {
              if (!dutyStarted) return startDuty();
              if (!isRiding) return startRide();
              return drop();
            }}
            className="w-full h-[120px] bg-[#32cd32] text-white text-2xl rounded-2xl"
          >
            {label}
          </button>
        </div>

        {/* グラフ入口 */}
        <GraphEntryGrid />

        {/* ▲ */}
        {dutyStarted && (
          <button
            onClick={() => setShowBottom(!showBottom)}
            style={{
              position: "absolute",
              right: 16,
              bottom: 110,
              fontSize: 24,
            }}
          >
            ▲
          </button>
        )}

        <BottomCard show={showBottom} onFinish={finish} />

        <BottomNav
          isHome={true}
          onHome={() => {}}
          onCenter={() => {}}
          onMenu={() => {}}
        />
      </div>
    );
  };
})();

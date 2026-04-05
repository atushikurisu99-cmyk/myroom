window.AppScreens.StandbyScreen = (() => {
  const { HeaderCard, BottomNav } = window.AppComponents;

  return function StandbyScreen(props) {
    const {
      timeParts,
      weather,
      totalAmount,
      recordCount,
      startRide,
    } = props;

    return (
      <div style={{ height: "100%", position: "relative" }}>
        <HeaderCard
          timeParts={timeParts}
          weather={weather}
          totalAmount={totalAmount}
          recordCount={recordCount}
        />

        <div style={{ padding: "16px" }}>
          <button
            onClick={startRide}
            style={{
              width: "100%",
              height: "120px",
              borderRadius: "24px",
              background: "#0072d9",
              color: "#fff",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            実車
          </button>
        </div>

        <BottomNav isHome={false} />
      </div>
    );
  };
})();

window.AppScreens.RideScreen = (() => {
  const { HeaderCard, BottomNav } = window.AppComponents;

  return function RideScreen(props) {
    const {
      timeParts,
      weather,
      totalAmount,
      recordCount,
      drop,
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
            onClick={drop}
            style={{
              width: "100%",
              height: "120px",
              borderRadius: "24px",
              background: "#ffaa00",
              color: "#fff",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            降車
          </button>
        </div>

        <BottomNav isHome={false} />
      </div>
    );
  };
})();

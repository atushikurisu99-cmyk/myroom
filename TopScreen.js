window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { HeaderCard, BottomCard, ToggleButton, GraphEntry, BottomNav } =
    window.AppComponents;

  return function TopScreen(props) {
    const {
      timeParts,
      weather,
      totalAmount,
      recordCount,
      isRiding,
      bottomOpen,
      setBottomOpen,
      startDuty,
      startRide,
      drop,
      finishDuty,
    } = props;

    const label = isRiding ? "降車" : "実車";

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
            onClick={() => {
              if (!startDuty) return;
              if (!isRiding && startDuty) startDuty();
            }}
            style={{
              width: "100%",
              height: "120px",
              borderRadius: "24px",
              background: "#32cd32",
              color: "#fff",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            乗務開始
          </button>
        </div>

        <GraphEntry />

        <ToggleButton onClick={() => setBottomOpen(!bottomOpen)} />

        <BottomCard
          show={bottomOpen}
          onClose={() => setBottomOpen(false)}
          onFinish={finishDuty}
        />

        <BottomNav isHome={true} />
      </div>
    );
  };
})();

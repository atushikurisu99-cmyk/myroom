window.AppScreens = window.AppScreens || {};
window.AppScreens.RideScreen = (() => {
  const { MainButton, RideInfoCard } = window.AppComponents;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  return function RideScreen(props) {
    const {
      pickup,
      rideStartAt,
      elapsedText,
      viaStops,
      handleDropOffTap,
    } = props;

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 bg-[#32CD32]"
          style={{ height: `${L.LINE_5_GREEN_BOTTOM}px` }}
        />

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
          }}
        >
          <MainButton
            label="降車"
            type="ride"
            onClick={handleDropOffTap}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
          }}
        >
          <RideInfoCard
            pickup={pickup}
            rideStartAt={rideStartAt}
            elapsedText={elapsedText}
            viaStops={viaStops || []}
          />
        </div>
      </div>
    );
  };
})();

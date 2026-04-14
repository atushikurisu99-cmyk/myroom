window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { MainButton } = window.AppComponents;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  return function StandbyScreen(props) {
    const {
      handleStartRide,
    } = props;

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
            zIndex: 6,
          }}
        >
          <MainButton
            label="実車"
            type="standby"
            onClick={handleStartRide}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
            height: `${L.CONTENT_PLACEHOLDER_H}px`,
            zIndex: 4,
          }}
        >
          <div style={{ height: "100%" }} />
        </div>
      </div>
    );
  };
})();

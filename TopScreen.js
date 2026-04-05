window.AppScreens = window.AppScreens || {};
window.AppScreens.TopScreen = (() => {
  const { BottomCard, FloatingToggle } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen({
    handleTopMain,
    showBottom,
    setShowBottom,
    handleFinishTap,
  }) {
    return (
      <div className="flex-1 relative">
        <div className="pt-4">
          <button
            onClick={() => {
              setShowBottom(false);
              handleTopMain();
            }}
            className={`${C.mainButtonBase}`}
            style={{
              height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px`,
              background: "linear-gradient(180deg,#5dffcf,#008a6a)",
            }}
          >
            乗務開始
          </button>
        </div>

        <FloatingToggle
          open={showBottom}
          toggle={() => setShowBottom(!showBottom)}
        />

        <BottomCard
          open={showBottom}
          onClose={() => setShowBottom(false)}
          onFinish={handleFinishTap}
        />
      </div>
    );
  };
})();

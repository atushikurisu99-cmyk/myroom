window.AppScreens.TopScreen = (() => {
  const { BottomCard } = window.AppComponents;
  const C = window.AppConstants;

  return function TopScreen(props) {
    const {
      mainLabel,
      handleMain,
      showBottom,
      setShowBottom,
      handleFinish,
    } = props;

    return (
      <div className="flex-1 flex flex-col relative">

        <div className="pt-4" style={{ height: `${C.MAIN_BUTTON_SLOT_HEIGHT}px` }}>
          <button
            onClick={handleMain}
            className={`${C.mainButtonBase} bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)]`}
          >
            <span className={C.bigButtonText}>{mainLabel}</span>
          </button>
        </div>

        {/* ▲ */}
        <button
          onClick={() => setShowBottom((v) => !v)}
          className="absolute right-4 bottom-[90px] text-[28px] text-slate-400"
        >
          ▲
        </button>

        <BottomCard
          show={showBottom}
          onClose={() => setShowBottom(false)}
          onFinish={handleFinish}
        />

      </div>
    );
  };
})();

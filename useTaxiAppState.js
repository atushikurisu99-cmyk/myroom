window.AppHooks = (() => {
  const { useState } = React;

  function useTaxiAppState() {
    const [screen, setScreen] = useState("top");
    const [showBottom, setShowBottom] = useState(false);

    const handleTopMain = () => setScreen("standby");
    const handleFinishTap = () => setScreen("top");

    const now = new Date();
    const timeParts = {
      hh: String(now.getHours()).padStart(2, "0"),
      mm: String(now.getMinutes()).padStart(2, "0"),
      showColon: true,
    };

    return {
      state: { screen, showBottom, timeParts },
      actions: {
        setShowBottom,
        handleTopMain,
        handleFinishTap,
      },
    };
  }

  return { useTaxiAppState };
})();

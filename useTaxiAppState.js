window.AppHooks = (() => {
  const { useState } = React;

  function useTaxiAppState() {
    const [screen, setScreen] = useState("top");
    const [showBottom, setShowBottom] = useState(false);

    const handleMain = () => {
      if (screen === "top") setScreen("standby");
      else if (screen === "standby") setScreen("ride");
      else if (screen === "ride") setScreen("standby");
    };

    const handleFinish = () => {
      setScreen("top");
      setShowBottom(false);
    };

    return {
      state: { screen, showBottom },
      actions: { handleMain, handleFinish, setShowBottom },
    };
  }

  return { useTaxiAppState };
})();

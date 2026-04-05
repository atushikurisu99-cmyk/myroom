const { useTaxiAppState } = window.AppHooks;
const { HeaderCard } = window.AppComponents;
const TopScreen = window.AppScreens.TopScreen;

function TaxiMiniApp() {
  const { state, actions } = useTaxiAppState();

  return (
    <div className="w-full h-full bg-gray-200 flex justify-center">
      <div className="w-full max-w-sm h-full px-4 pt-4 relative">
        <HeaderCard timeParts={state.timeParts} />

        {state.screen === "top" && (
          <TopScreen
            handleTopMain={actions.handleTopMain}
            showBottom={state.showBottom}
            setShowBottom={actions.setShowBottom}
            handleFinishTap={actions.handleFinishTap}
          />
        )}

        <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-green-400 flex justify-around items-center">
          <div>ホーム</div>
          <div>経費</div>
          <div>メニュー</div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

const { useTaxiAppState } = window.AppHooks;
const Screens = window.AppScreens;
const { BottomNav, TopHeader } = window.AppComponents;

function TaxiMiniApp() {
  const state = useTaxiAppState();

  const {
    screen,

    // header
    timeParts,
    cardMode,
    weather,
    totalAmount,
    amount1,
    amount2,
    handleCardModeNext,

    // top
    topMainLabel,
    topMainButtonDisabled,
    handleTopMain,
    startupMainStyle,
    startupOtherStyle,
    homeEndSheetOpen,
    toggleHomeEndSheet,
    handleFinishTap,
    dutyStarted,

    // ride
    pickup,
    rideStartAt,
    elapsedText,
    viaStops,
    handleDropOffTap,

    // standby
    handleStartRide,

  } = state;

  /* =========================
   * 画面切替
   * ========================= */

  let CurrentScreen = null;

  if (screen === "top") {
    CurrentScreen = (
      <Screens.TopScreen
        topMainLabel={topMainLabel}
        topMainButtonDisabled={topMainButtonDisabled}
        handleTopMain={handleTopMain}
        startupMainStyle={startupMainStyle}
        startupOtherStyle={startupOtherStyle}
        homeEndSheetOpen={homeEndSheetOpen}
        toggleHomeEndSheet={toggleHomeEndSheet}
        handleFinishTap={handleFinishTap}
        dutyStarted={dutyStarted}
      />
    );
  }

  if (screen === "standby") {
    CurrentScreen = (
      <Screens.StandbyScreen
        timeParts={timeParts}
        cardMode={cardMode}
        weather={weather}
        totalAmount={totalAmount}
        amount1={amount1}
        amount2={amount2}
        handleCardModeNext={handleCardModeNext}
        handleStartRide={handleStartRide}
      />
    );
  }

  if (screen === "ride") {
    CurrentScreen = (
      <Screens.RideScreen
        timeParts={timeParts}
        cardMode={cardMode}
        weather={weather}
        totalAmount={totalAmount}
        amount1={amount1}
        amount2={amount2}
        handleCardModeNext={handleCardModeNext}
        pickup={pickup}
        rideStartAt={rideStartAt}
        elapsedText={elapsedText}
        viaStops={viaStops}
        handleDropOffTap={handleDropOffTap}
      />
    );
  }

  if (screen === "fare") {
    CurrentScreen = <Screens.FareScreen {...state} />;
  }

  /* =========================
   * ナビ状態
   * ========================= */

  let navActive = "home";
  let centerLabel = "履歴";

  if (screen === "top") {
    navActive = "home";
    centerLabel = "経費";
  }

  if (screen === "standby" || screen === "ride") {
    navActive = "center";
    centerLabel = "履歴";
  }

  /* =========================
   * 描画
   * ========================= */

  return (
    <div className="w-full h-full flex justify-center bg-[#dfe5ee] overflow-hidden">
      <div className="w-full max-w-[430px] h-full relative overflow-hidden">

        {/* 上部（TOPだけ特別） */}
        {screen === "top" && <TopHeader />}

        {/* メイン画面 */}
        {CurrentScreen}

        {/* 下ナビ */}
        <BottomNav
          active={navActive}
          centerLabel={centerLabel}
        />

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

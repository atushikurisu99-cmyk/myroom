window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { MainButton } = window.AppComponents;

  function HeaderCardStandby({
    timeParts,
    cardMode,
    weather,
    totalAmount,
    amount1,
    amount2,
    onTap,
  }) {
    const hh = timeParts?.hh || "05";
    const mm = timeParts?.mm || "45";

    const renderBottom = () => {
      if (cardMode === 1) {
        return (
          <>
            <div className="absolute left-[16px] top-[8px] text-[13px] font-bold text-[#6e7a93]">
              合計
            </div>
            <div className="absolute right-[18px] bottom-0 text-[26px] font-bold text-[#1f2a44] leading-none">
              {Number(totalAmount || 0).toLocaleString("ja-JP")}
            </div>
            <div className="absolute right-0 bottom-[1px] text-[20px] font-bold text-[#1f2a44] leading-none">
              円
            </div>
          </>
        );
      }

      if (cardMode === 4) {
        return (
          <>
            <div className="absolute left-[16px] top-[8px] text-[13px] font-bold text-[#6e7a93]">
              ①
            </div>
            <div className="absolute right-[18px] bottom-0 text-[26px] font-bold text-[#1f2a44] leading-none">
              {Number(amount1 || 0).toLocaleString("ja-JP")}
            </div>
            <div className="absolute right-0 bottom-[1px] text-[20px] font-bold text-[#1f2a44] leading-none">
              円
            </div>
          </>
        );
      }

      if (cardMode === 5) {
        return (
          <>
            <div className="absolute left-[16px] top-[8px] text-[13px] font-bold text-[#6e7a93]">
              ②
            </div>
            <div className="absolute right-[18px] bottom-0 text-[26px] font-bold text-[#1f2a44] leading-none">
              {Number(amount2 || 0).toLocaleString("ja-JP")}
            </div>
            <div className="absolute right-0 bottom-[1px] text-[20px] font-bold text-[#1f2a44] leading-none">
              円
            </div>
          </>
        );
      }

      return (
        <>
          <div className="absolute left-[16px] top-[8px] text-[13px] font-bold text-[#6e7a93]">
            今日のペース
          </div>
          <div className="absolute left-[16px] bottom-[9px] w-[10px] h-[10px] rounded-full bg-[#28a26b]" />
          <div className="absolute left-[34px] bottom-[5px] text-[18px] font-bold text-[#28a26b] leading-none">
            良好
          </div>
        </>
      );
    };

    return (
      <button
        type="button"
        onClick={onTap}
        className="absolute bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
        style={{
          left: "20px",
          right: "20px",
          top: "0px",
          height: "180px",
          borderRadius: "8px",
        }}
      >
        <div className="absolute left-[31px] top-[49px] text-[11px] font-semibold text-[#7a869f] leading-none">
          4/11
        </div>
        <div className="absolute left-[28px] top-[84px] text-[22px] leading-none">
          ☀️
        </div>

        <div className="absolute left-[74px] top-[49px] text-[11px] font-semibold text-[#7a869f] leading-none">
          4/12
        </div>
        <div className="absolute left-[71px] top-[84px] text-[22px] leading-none">
          ⛅
        </div>

        <div className="absolute right-[12px] top-[40px] text-[#1f2a44] text-[68px] font-bold tracking-[-0.05em] leading-none">
          {hh}：{mm}
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            top: "118px",
            height: "50px",
          }}
        >
          <div className="absolute left-[16px] right-[16px] bottom-[4px] h-[26px]">
            {renderBottom()}
          </div>
        </div>
      </button>
    );
  }

  return function StandbyScreen(props) {
    const {
      timeParts,
      cardMode,
      weather,
      totalAmount,
      amount1,
      amount2,
      handleCardModeNext,
      handleStartRide,
    } = props;

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 bg-[#32CD32]"
          style={{ height: "346px" }}
        />

        <HeaderCardStandby
          timeParts={timeParts}
          cardMode={cardMode}
          weather={weather}
          totalAmount={totalAmount}
          amount1={amount1}
          amount2={amount2}
          onTap={handleCardModeNext}
        />

        <div
          className="absolute"
          style={{
            left: "20px",
            right: "20px",
            top: "196px",
            height: "142px",
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
            left: "20px",
            right: "20px",
            top: "354px",
          }}
        >
          <div style={{ height: "124px" }} />
        </div>
      </div>
    );
  };
})();

window.TopScreen = ({ onAdvance }) => {
  const { StartHeader, MainButton, TopGraphArea, BottomNav } = window.__AppShared;

  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[100dvh] bg-[#dfe5ee] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[346px] bg-[#32CD32]" />

        <div className="relative px-5 pt-0 h-full">
          <StartHeader time="05：45" amount="¥0" />

          <div className="absolute left-5 right-5 top-[260px]">
            <MainButton label="乗務開始" variant="start" onClick={onAdvance} />
          </div>

          <div className="absolute left-5 right-5 top-[406px] bottom-[142px] overflow-hidden">
            <TopGraphArea />
          </div>

          <div className="absolute right-[26px] bottom-[118px] text-[28px] font-black text-[#a7adb7] leading-none">▲</div>
        </div>

        <BottomNav center="経費" active="home" />
      </div>
    </>
  );
};

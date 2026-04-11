window.AppComponents = (() => {

  function Clock({ time = '05：45', dark = false }) {
    return (
      <div
        className={`font-black tracking-[-0.05em] leading-none ${dark ? 'text-[#1f2a44]' : 'text-white'}`}
        style={{ fontSize: '68px' }}
      >
        {time}
      </div>
    );
  }

  function WhiteHeaderCard({ time = '05：45' }) {
    return (
      <div className="rounded-[34px] bg-[#f8fafc] px-5 pt-5 pb-4 h-[182px]">
        <div className="flex justify-between">
          <div>天気</div>
          <Clock time={time} dark />
        </div>
        <div className="mt-8">良好</div>
      </div>
    );
  }

  function TopHeader() {
    return (
      <div className="text-white mt-10">
        <div className="text-[15px] font-semibold">当月達成売上</div>
        <div className="mt-2 text-[28px] font-black">¥0</div>
      </div>
    );
  }

  function MainButton({ label, variant = 'start', onClick }) {
    return (
      <button
        onClick={onClick}
        className="w-full h-[142px] rounded-[32px] text-white text-[34px] font-black"
      >
        {label}
      </button>
    );
  }

  function TopGraphArea() {
    return <div className="h-[200px] bg-white/50 rounded-[28px]" />;
  }

  function RideInfoCard() {
    return <div className="h-[124px] bg-white rounded-[28px]" />;
  }

  function BottomNav() {
    return <div className="absolute bottom-0 h-[112px] w-full bg-[#32CD32]" />;
  }

  function FixedTopLayout({ type, buttonLabel, onClick, children }) {
    const isTop = type === "top";

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">

        <div className="absolute inset-x-0 top-0 h-[396px] bg-[#32CD32]" />

        <div className="relative px-5 pt-5 h-full">

          {/* 時計 */}
          <div className="flex justify-end">
            <Clock time="05：45" dark={!isTop} />
          </div>

          {/* ヘッダー */}
          <div className="mt-4">
            {isTop ? <TopHeader /> : <WhiteHeaderCard />}
          </div>

          {/* ボタン */}
          <div className="mt-4">
            <MainButton label={buttonLabel} onClick={onClick} />
          </div>

          {/* 下 */}
          <div className="mt-4">
            {children}
          </div>

        </div>

        <BottomNav />
      </div>
    );
  }

  window.__AppShared = {
    Clock,
    WhiteHeaderCard,
    TopHeader,
    MainButton,
    TopGraphArea,
    RideInfoCard,
    BottomNav,
    FixedTopLayout
  };

})();

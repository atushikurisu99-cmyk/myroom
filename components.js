window.AppComponents = (() => {
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  function Shell({ children }) {
    return (
      <div className="w-full h-full flex justify-center bg-[#dfe5ee] overflow-hidden">
        <div
          className="relative h-full w-full max-w-[430px] overflow-hidden bg-[#dfe5ee]"
          style={{ minHeight: '100dvh' }}
        >
          {children}
        </div>
      </div>
    );
  }

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

  function WeatherBlock({ hidden = false }) {
    return (
      <div className={`flex gap-6 items-start ${hidden ? 'opacity-0 pointer-events-none' : ''}`}>
        <div>
          <div className="text-[12px] font-semibold text-[#7a869f] leading-none">4/11</div>
          <div className="mt-2 text-[26px] leading-none">🌞</div>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-[#7a869f] leading-none">4/12</div>
          <div className="mt-2 text-[26px] leading-none">🌤️</div>
        </div>
      </div>
    );
  }

  function WhiteHeaderCardBody() {
    return (
      <>
        <div className="text-[14px] font-semibold text-[#6e7a93]">今日のペース</div>
        <div className="mt-1 text-[16px] font-bold text-[#28a26b] leading-none">良好</div>
      </>
    );
  }

  function TopHeaderBody({ amount = '¥0' }) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold text-white leading-none">当月達成売上</div>
          <div className="mt-3 text-[26px] font-black text-white leading-none">{amount}</div>
        </div>
        <div className="pt-[18px] text-[30px] leading-none text-white">◉</div>
      </div>
    );
  }

  function MainButton({ label, variant = 'start', onClick }) {
    let bg = 'linear-gradient(180deg,#86e0b2 0%, #6dbb99 42%, #50937c 100%)';

    if (variant === 'standby') {
      bg = 'linear-gradient(180deg,#88c8f5 0%, #5b9bf0 44%, #3c73d8 100%)';
    } else if (variant === 'ride') {
      bg = 'linear-gradient(180deg,#f5d85e 0%, #ecb63c 42%, #d49326 100%)';
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className="relative w-full rounded-[32px] shadow-[0_10px_22px_rgba(0,0,0,0.14)] overflow-hidden"
        style={{ height: `${L.BUTTON_H}px`, background: bg }}
      >
        <div className="absolute left-[18px] right-[18px] top-[10px] h-[54px] rounded-[28px] bg-[rgba(255,255,255,0.28)]" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-[34px] font-black tracking-[-0.03em]">
          {label}
        </div>
      </button>
    );
  }

  function GraphCard({ title, sub }) {
    return (
      <div className="h-[118px] rounded-[28px] bg-[rgba(248,250,252,0.56)] px-4 py-4 border border-[rgba(255,255,255,0.14)] overflow-hidden">
        <div className="text-[18px] font-black text-[#445673]">{title}</div>
        <div className="mt-1 text-[12px] font-semibold text-[#98a6bc]">{sub}</div>
      </div>
    );
  }

  function TopGraphArea() {
    return (
      <div className="grid grid-cols-2 gap-x-[14px] gap-y-[16px]">
        <GraphCard title="売上" sub="グラフ" />
        <GraphCard title="本数" sub="推移" />
        <GraphCard title="時間帯" sub="動き" />
        <GraphCard title="分析" sub="入口" />
      </div>
    );
  }

  function RideInfoCard() {
    return (
      <div className="rounded-[28px] bg-[#f8fafc] shadow-[0_8px_22px_rgba(0,0,0,0.08)] px-5 py-4 h-[124px]">
        <div className="text-[18px] font-black text-[#1f2a44]">取得中...</div>

        <div className="mt-4 flex justify-between items-end gap-4">
          <div>
            <div className="text-[12px] font-semibold text-[#6e7a93]">乗車時刻</div>
            <div className="mt-1 text-[18px] font-black text-[#1f2a44] leading-none">05:45</div>
          </div>

          <div className="text-right">
            <div className="text-[12px] font-semibold text-[#6e7a93]">経過時間</div>
            <div className="mt-1 text-[18px] font-black text-[#1f2a44] leading-none">0分</div>
          </div>
        </div>
      </div>
    );
  }

  function HomeIcon() {
    return (
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M12 29.5L32 12L52 29.5" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 28.5V51H29V39H35V51H45V28.5" fill="white" />
      </svg>
    );
  }

  function GridIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        {[10, 24, 38].map(x =>
          [10, 24, 38].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="white" />
          ))
        )}
      </svg>
    );
  }

  function BottomNav({ center = '履歴', active = 'home' }) {
    const circleLeft = active === 'home' ? '16.6667%' : active === 'center' ? '50%' : '83.3333%';

    return (
      <div className="absolute left-0 right-0 bottom-0 h-[112px]">
        <div className="absolute inset-x-0 bottom-0 h-[70px] rounded-t-[26px] bg-[#32CD32]" />

        <div
          className="absolute top-[8px] h-[92px] w-[92px] rounded-full bg-[#33CC6D]"
          style={{ left: circleLeft, transform: 'translateX(-50%)' }}
        />

        <div className="absolute inset-0 grid grid-cols-3">
          <div className="relative">
            <div className="absolute left-1/2 top-[26px] -translate-x-1/2 flex flex-col items-center">
              <HomeIcon />
              <div className="mt-[7px] text-[11px] font-bold text-white">ホーム</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-[38px] -translate-x-1/2 text-[16px] font-black tracking-[0.03em] text-white">
              {center}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-[28px] -translate-x-1/2 flex flex-col items-center">
              <GridIcon />
              <div className="mt-[8px] text-[11px] font-bold text-white">メニュー</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function FareScreenView() {
    return (
      <div className="px-5 pt-5 pb-[120px]">
        <div className="rounded-[28px] bg-[#f8fafc] shadow-[0_8px_22px_rgba(0,0,0,0.08)] px-5 py-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-[15px] font-black text-[#1f2a44]">05:45</div>
              <div className="mt-2 text-[14px] font-bold text-[#445673]">船越南三丁目</div>
              <div className="mt-1 text-[11px] font-semibold text-[#a0adbe]">精度：55m</div>
            </div>

            <div className="text-[22px] text-[#98a6bc]">→</div>

            <div className="text-right">
              <div className="text-[15px] font-black text-[#1f2a44]">05:45</div>
              <div className="mt-2 text-[14px] font-bold text-[#445673]">船越南三丁目</div>
              <div className="mt-1 text-[11px] font-semibold text-[#a0adbe]">精度：55m</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] bg-[#f8fafc] shadow-[0_8px_22px_rgba(0,0,0,0.08)] px-5 py-4 flex justify-between items-center">
          <div className="text-[22px] font-black text-[#1f2a44]">¥ 1,200</div>
          <div className="text-[14px] font-bold text-[#445673]">乗車人員 1名</div>
        </div>

        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((n, idx) => (
            <div
              key={n}
              className={`h-[58px] w-[58px] rounded-full flex items-center justify-center text-[30px] font-black ${
                idx === 0 ? 'bg-[#9aa09a] text-white' : 'bg-[#ececf0] text-[#7c7f85]'
              }`}
            >
              {n}
            </div>
          ))}
        </div>

        <div className="mt-5 h-[72px] rounded-[22px] bg-[linear-gradient(180deg,#5d5af4,#4a47eb)] shadow-[0_8px_18px_rgba(76,71,235,0.35)] flex items-center justify-center text-[26px] font-black text-[#0f1222]">
          現金
        </div>

        <div className="mt-4 h-[72px] rounded-[22px] bg-[linear-gradient(180deg,#84ec88,#6fe77d)] shadow-[0_8px_18px_rgba(84,214,106,0.28)] flex items-center justify-center text-[24px] font-black text-[#0f1222]">
          カード・QR
        </div>

        <div className="mt-4 h-[72px] rounded-[22px] bg-[linear-gradient(180deg,#f5f54d,#eceb48)] shadow-[0_8px_18px_rgba(210,210,50,0.22)] flex items-center justify-center text-[22px] font-black text-[#0f1222]">
          領収証発行
        </div>
      </div>
    );
  }

  function HeaderZone({ screen = 'top', time = '05：45', amount = '¥0' }) {
    const darkClock = screen !== 'top';

    return (
      <div
        className="absolute"
        style={{
          left: `${L.SIDE}px`,
          right: `${L.SIDE}px`,
          top: `${L.LINE_2_HEADER_BOTTOM - L.HEADER_H}px`,
          height: `${L.HEADER_H}px`,
        }}
      >
        {screen === 'top' ? (
          <div className="relative h-full">
            <div className="absolute left-0 top-0">
              <WeatherBlock hidden={true} />
            </div>

            <div className="absolute left-0 right-0 bottom-0">
              <TopHeaderBody amount={amount} />
            </div>
          </div>
        ) : (
          <div className="relative h-full rounded-[34px] bg-[#f8fafc] shadow-[0_8px_22px_rgba(0,0,0,0.08)] px-5 pt-5 pb-4">
            <div className="absolute left-5 top-5">
              <WeatherBlock />
            </div>

            <div className="absolute left-5 right-5 bottom-4">
              <WhiteHeaderCardBody />
            </div>
          </div>
        )}

        <div
          className="absolute"
          style={{
            top: `${L.LINE_1_CLOCK_TOP - (L.LINE_2_HEADER_BOTTOM - L.HEADER_H)}px`,
            right: '0px',
          }}
        >
          <Clock time={time} dark={darkClock} />
        </div>
      </div>
    );
  }

  function FixedTopLayout({
    screen = 'top',
    time = '05：45',
    amount = '¥0',
    buttonLabel,
    buttonVariant,
    onAdvance,
    bottomNavCenter = '履歴',
    bottomNavActive = 'center',
    content = null,
    showArrow = false,
  }) {
    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 bg-[#32CD32]"
          style={{ height: `${L.LINE_5_GREEN_BOTTOM}px` }}
        />

        <HeaderZone screen={screen} time={time} amount={amount} />

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
          }}
        >
          <MainButton
            label={buttonLabel}
            variant={buttonVariant}
            onClick={onAdvance}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
          }}
        >
          {content}
        </div>

        {showArrow ? (
          <div className="absolute right-[26px] bottom-[118px] text-[28px] font-black text-[#a7adb7] leading-none">
            ▲
          </div>
        ) : null}

        <BottomNav center={bottomNavCenter} active={bottomNavActive} />
      </div>
    );
  }

  window.__AppShared = {
    Shell,
    Clock,
    WeatherBlock,
    MainButton,
    TopGraphArea,
    RideInfoCard,
    BottomNav,
    FareScreenView,
    FixedTopLayout,
  };
})();

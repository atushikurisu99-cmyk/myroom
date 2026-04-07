function BottomNav({
  centerLabel,
  onHome,
  onCenter,
  onMenu,
  activeArea = "home",
}) {
  const safeInset = "env(safe-area-inset-bottom, 0px)";

  // -------------------------
  // 完全固定値
  // -------------------------
  const navHeight = 94;
  const bandHeight = 56;

  const bubbleSize = 78;
  const bubbleBottom = 22;

  const slotWidth = "33.3333%";

  // ユニット基準
  const sideUnitWidth = 60;
  const sideIconBox = 28;
  const sideLabelFont = 12;
  const sideGap = 3;

  const centerUnitWidth = 72;
  const centerLabelFont = 16;

  // 帯の中の基準線
  const sideUnitTop = 8;
  const centerUnitTop = 22;

  const centerMap = {
    home: "16.6667%",
    center: "50%",
    menu: "83.3333%",
  };

  const activeCenter = centerMap[activeArea] || centerMap.home;

  const homeStrong = activeArea === "home";
  const centerStrong = activeArea === "center";
  const menuStrong = activeArea === "menu";

  return (
    <div
      className="relative overflow-visible"
      style={{
        height: `calc(${navHeight}px + ${safeInset})`,
      }}
    >
      {/* 帯：絶対固定 */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px]"
        style={{
          height: `calc(${bandHeight}px + ${safeInset})`,
          background: GREEN_MAIN,
        }}
      />

      {/* 選択丸：ユニット中心に合わせるだけ */}
      <div
        className="absolute z-10 rounded-full transition-[left] duration-220 ease-out"
        style={{
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          left: activeCenter,
          bottom: `calc(${bubbleBottom}px + ${safeInset})`,
          transform: "translateX(-50%)",
          background: GREEN_CIRCLE,
          boxShadow: "0 8px 14px rgba(0,0,0,0.05)",
        }}
      />

      {/* ホーム */}
      <button
        type="button"
        onClick={onHome}
        className="absolute left-0 top-0 z-20 text-white active:opacity-85"
        style={{
          width: slotWidth,
          height: `${navHeight}px`,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${sideUnitTop}px`,
            width: `${sideUnitWidth}px`,
            height: `${sideIconBox + sideGap + sideLabelFont}px`,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              top: 0,
              width: `${sideIconBox}px`,
              height: `${sideIconBox}px`,
            }}
          >
            <HomeFilledIcon className="w-[28px] h-[28px]" />
          </div>

          <div
            className={`absolute left-1/2 -translate-x-1/2 leading-none whitespace-nowrap ${
              homeStrong ? "font-bold" : "font-semibold"
            }`}
            style={{
              top: `${sideIconBox + sideGap}px`,
              fontSize: `${sideLabelFont}px`,
            }}
          >
            ホーム
          </div>
        </div>
      </button>

      {/* 中央 */}
      <button
        type="button"
        onClick={onCenter}
        className="absolute left-1/2 top-0 -translate-x-1/2 z-20 text-white active:opacity-85"
        style={{
          width: slotWidth,
          height: `${navHeight}px`,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${centerUnitTop}px`,
            width: `${centerUnitWidth}px`,
            height: `${centerLabelFont}px`,
          }}
        >
          <div
            className={`absolute left-1/2 -translate-x-1/2 leading-none whitespace-nowrap ${
              centerStrong ? "font-bold" : "font-semibold"
            }`}
            style={{
              top: 0,
              fontSize: `${centerLabelFont}px`,
              letterSpacing: "0.01em",
            }}
          >
            {centerLabel}
          </div>
        </div>
      </button>

      {/* メニュー */}
      <button
        type="button"
        onClick={onMenu}
        className="absolute right-0 top-0 z-20 text-white active:opacity-85"
        style={{
          width: slotWidth,
          height: `${navHeight}px`,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${sideUnitTop}px`,
            width: `${sideUnitWidth}px`,
            height: `${sideIconBox + sideGap + sideLabelFont}px`,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              top: 0,
              width: `${sideIconBox}px`,
              height: `${sideIconBox}px`,
            }}
          >
            <MenuDotsFilledIcon className="w-[26px] h-[26px]" />
          </div>

          <div
            className={`absolute left-1/2 -translate-x-1/2 leading-none whitespace-nowrap ${
              menuStrong ? "font-bold" : "font-semibold"
            }`}
            style={{
              top: `${sideIconBox + sideGap}px`,
              fontSize: `${sideLabelFont}px`,
            }}
          >
            メニュー
          </div>
        </div>
      </button>
    </div>
  );
}

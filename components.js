function BottomNav({
  centerLabel,
  onHome,
  onCenter,
  onMenu,
  activeArea = "home",
}) {
  const slot = {
    home: "16.6667%",
    center: "50%",
    menu: "83.3333%",
  };

  const activeLeft = slot[activeArea] || slot.home;

  // ===== 基準ライン =====
  const NAV_HEIGHT = 100;
  const BAND_HEIGHT = 60;

  const CIRCLE_SIZE = 58;
  const CIRCLE_CENTER_Y = 30;

  const ICON_Y = 32;
  const LABEL_Y = 82;

  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ height: NAV_HEIGHT }}>
      
      {/* 帯 */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px]"
        style={{
          height: BAND_HEIGHT,
          background: GREEN_MAIN,
        }}
      />

      {/* 丸（center基準） */}
      <div
        className="absolute rounded-full transition-all duration-200"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          left: activeLeft,
          top: CIRCLE_CENTER_Y,
          transform: "translate(-50%, -50%)",
          background: GREEN_CIRCLE,
        }}
      />

      {/* ===== 表示（座標固定）===== */}

      {/* ホーム */}
      <div
        className="absolute text-white pointer-events-none"
        style={{
          left: slot.home,
          top: ICON_Y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="text-[20px] leading-none">🏠</div>
      </div>

      <div
        className="absolute text-white text-[12px] pointer-events-none"
        style={{
          left: slot.home,
          top: LABEL_Y,
          transform: "translate(-50%, -100%)",
        }}
      >
        ホーム
      </div>

      {/* 中央 */}
      <div
        className="absolute text-white pointer-events-none"
        style={{
          left: slot.center,
          top: ICON_Y + 2,
          transform: "translate(-50%, -50%)",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        {centerLabel}
      </div>

      {/* メニュー */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: slot.menu,
          top: ICON_Y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="grid grid-cols-3 gap-[4px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-[6px] h-[6px] bg-white rounded-full" />
          ))}
        </div>
      </div>

      <div
        className="absolute text-white text-[12px] pointer-events-none"
        style={{
          left: slot.menu,
          top: LABEL_Y,
          transform: "translate(-50%, -100%)",
        }}
      >
        メニュー
      </div>

      {/* ===== タップ領域（既存維持）===== */}
      <button onClick={onHome} className="absolute left-0 top-0 w-1/3 h-full" />
      <button onClick={onCenter} className="absolute left-1/3 top-0 w-1/3 h-full" />
      <button onClick={onMenu} className="absolute right-0 top-0 w-1/3 h-full" />
    </div>
  );
}

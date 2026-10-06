window.AppScreens = window.AppScreens || {};
window.AppScreens.StandbyScreen = (() => {
  const { useMemo } = React;
  const { MainButton } = window.AppComponents;
  const L = window.AppConstants.TOP_LAYOUT;

  function toDateTime(event) {
    return new Date(`${event.date}T${event.start || "00:00"}:00+09:00`);
  }

  function eventVisibleUntil(event) {
    const start = toDateTime(event);
    if (event.endEstimate) {
      let end = new Date(`${event.date}T${event.endEstimate}:00+09:00`);
      if (!Number.isNaN(end.getTime())) {
        if (end < start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
        return new Date(end.getTime() + 60 * 60 * 1000);
      }
    }

    // 終了時刻が取れない場合も、開始後すぐ消さない。
    const fallbackMinutes = event.category === "sport" ? 180 : 200;
    return new Date(start.getTime() + fallbackMinutes * 60 * 1000);
  }

  function pickUpcoming(events, category) {
    const now = new Date();
    return (events || [])
      .filter((e) => e.category === category && eventVisibleUntil(e) >= now)
      .sort((a, b) => toDateTime(a) - toDateTime(b))[0] || null;
  }

  function EventMiniCard({ type, event }) {
    const isLive = type === "live";
    const label = isLive ? "ライブ" : "スポーツ";
    const fallback = isLive ? "予定なし" : "予定なし";
    const title = event?.title || fallback;
    const time = event ? `${event.start || "--:--"}｜${event.endEstimate ? `～${event.endEstimate}` : ""}` : "—";
    const venue = event?.venue || "—";

    return (
      <div
        style={{
          height: "136px",
          borderRadius: "12px",
          background: "#ffffff",
          boxShadow: "0 7px 18px rgba(0,0,0,0.08)",
          padding: "12px 13px 10px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <div style={{ fontSize: "var(--tx-xs)", fontWeight: 900, color: "#334155", whiteSpace: "nowrap" }}>{label}</div>
          <div style={{ fontSize: "var(--tx-xs)", fontWeight: 800, color: "#7a869f", whiteSpace: "nowrap" }}>
            {event ? event.date.slice(5).replace("-", "/") : ""}
          </div>
        </div>
        <div
          style={{
            marginTop: "12px",
            fontSize: "var(--tx-md)",
            lineHeight: 1.05,
            fontWeight: 900,
            color: "#1f2a44",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: "9px",
            fontSize: "var(--tx-xs)",
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#6e7a93",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          {venue}
        </div>
        <div style={{ marginTop: "8px", fontSize: "var(--tx-xs)", fontWeight: 900, color: "#445673", whiteSpace: "nowrap" }}>
          {time}
        </div>
      </div>
    );
  }

  return function StandbyScreen(props) {
    const {
      events = [],
      handleStartRide,
      homeEndSheetOpen = false,
      handleFinishTap = () => {},
    } = props;

    const liveEvent = useMemo(() => pickUpcoming(events, "live"), [events]);
    const sportEvent = useMemo(() => pickUpcoming(events, "sport"), [events]);

    const endSheetHeight = 88;
    const endSheetBottom = L.NAV_H - 6;
    const endSheetVisibleY = 0;
    const endSheetHiddenY = endSheetHeight + 14;

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_3_BUTTON_TOP}px`,
            height: `${L.BUTTON_H}px`,
            zIndex: 6,
          }}
        >
          <MainButton label="実車" type="standby" onClick={handleStartRide} />
        </div>

        <div
          className="absolute"
          style={{
            left: `${L.SIDE}px`,
            right: `${L.SIDE}px`,
            top: `${L.LINE_6_CONTENT_TOP}px`,
            height: `${L.CONTENT_PLACEHOLDER_H}px`,
            zIndex: 4,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", height: "100%" }}>
            <EventMiniCard type="live" event={liveEvent} />
            <EventMiniCard type="sport" event={sportEvent} />
          </div>
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            bottom: `${endSheetBottom}px`,
            height: `${endSheetHeight}px`,
            zIndex: 18,
            pointerEvents: homeEndSheetOpen ? "auto" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${L.SIDE}px`,
              right: `${L.SIDE}px`,
              bottom: "0px",
              transform: `translateY(${homeEndSheetOpen ? endSheetVisibleY : endSheetHiddenY}px)`,
              opacity: homeEndSheetOpen ? 1 : 0,
              transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 180ms ease",
            }}
          >
            <button
              type="button"
              onClick={handleFinishTap}
              style={{
                width: "100%",
                height: "64px",
                borderRadius: "22px",
                background: "linear-gradient(180deg,#ffffff 0%, #f3f5f8 100%)",
                color: "#2d3748",
                fontSize: "24px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                border: "1px solid rgba(140,150,170,0.22)",
              }}
            >
              本日の乗務を終了
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

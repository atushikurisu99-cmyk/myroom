const { useEffect, useMemo, useRef, useState } = React;

const { useTaxiAppState } = window.AppHooks;
const {
  HeaderCard,
  BottomNav,
  OtherSheet,
  ReportTemplateSettingsSheet,
  DutyStartDialog,
  PaymentDialog,
  ViaDialog,
  FinishDialog,
} = window.AppComponents;
const TopScreen = window.AppScreens.TopScreen;
const StandbyScreen = window.AppScreens.StandbyScreen;
const RideScreen = window.AppScreens.RideScreen;
const FareScreen = window.AppScreens.FareScreen;
const HistoryModal = window.AppScreens.HistoryModal;

function SalesNotificationLayer({ events = [] }) {
  const [now, setNow] = useState(new Date());
  const [dismissed, setDismissed] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("salesNavDismissedAlerts") || "[]")); }
    catch (_) { return new Set(); }
  });

  useEffect(() => {
    const clockTimer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const toTime = (date, time = "00:00") =>
    new Date(`${date}T${time || "00:00"}:00+09:00`);

  const alerts = useMemo(() => {
    const today = dateKey(now);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const conventions = events
      .filter((e) => e.category === "convention")
      .filter((e) => e.date === today)
      .sort((a, b) => toTime(a.date, a.start) - toTime(b.date, b.start));

    let conventionAlert = null;
    if (conventions.length) {
      const timed = conventions.find((e) => e.start);
      const first = timed || conventions[0];
      const title = conventions.length > 1
        ? `コンベンション ${conventions.length}件`
        : "コンベンション";
      const detail = conventions.length > 1
        ? `${first.title} ほか`
        : first.title;
      const sub = first.start
        ? `${first.start}${first.endEstimate ? `〜${first.endEstimate}` : ""}｜${first.venue}`
        : `本日｜${first.venue}`;
      conventionAlert = {
        key: `convention-${today}`,
        kind: "convention",
        title,
        detail,
        sub,
      };
    }

    const cruises = events
      .filter((e) => e.category === "cruise")
      .map((e) => {
        const arrive = toTime(e.date, e.start);
        const depart = toTime(e.departureDate || e.date, e.endEstimate || "23:59");
        return { e, arrive, depart };
      })
      .filter((x) => x.depart >= now)
      .sort((a, b) => a.arrive - b.arrive);

    let cruiseAlert = null;
    const active = cruises.find((x) => x.arrive <= now && x.depart >= now);
    const next = active || cruises.find((x) => x.arrive <= next48h);
    if (next) {
      const isActive = next.arrive <= now && next.depart >= now;
      const e = next.e;
      cruiseAlert = {
        key: `cruise-${e.id}-${isActive ? "active" : "upcoming"}`,
        kind: "cruise",
        title: isActive ? "大型客船・停泊中" : "大型客船",
        detail: e.ship || e.title,
        sub: isActive
          ? `出港 ${e.departureDate !== e.date ? e.departureDate.slice(5).replace("-", "/") + " " : ""}${e.endEstimate || "--:--"}｜${e.venue}`
          : `${e.date.slice(5).replace("-", "/")} ${e.start || "--:--"}入港｜${e.venue}`,
      };
    }

    return [conventionAlert, cruiseAlert].filter(Boolean);
  }, [events, now]);

  const visible = alerts.filter((a) => !dismissed.has(a.key)).slice(0, 2);

  const dismiss = (key) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(key);
      try { sessionStorage.setItem("salesNavDismissedAlerts", JSON.stringify([...next])); } catch (_) {}
      return next;
    });
  };

  if (!visible.length) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "12px",
        right: "12px",
        top: "8px",
        zIndex: 36,
        display: "grid",
        gap: "7px",
        pointerEvents: "none",
      }}
    >
      {visible.map((alert) => (
        <SalesNotificationBanner key={alert.key} alert={alert} onDismiss={() => dismiss(alert.key)} />
      ))}
    </div>
  );
}

function SalesNotificationBanner({ alert, onDismiss }) {
  const startX = useRef(null);
  return (
    <div
      onTouchStart={(e) => { startX.current = e.touches?.[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        const endX = e.changedTouches?.[0]?.clientX ?? null;
        if (startX.current != null && endX != null && Math.abs(endX - startX.current) >= 58) onDismiss();
        startX.current = null;
      }}
      style={{
        pointerEvents: "auto",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 8px 22px rgba(0,0,0,0.16)",
        padding: "9px 12px 10px",
        border: alert.kind === "cruise" ? "1px solid rgba(37,99,235,0.18)" : "1px solid rgba(124,58,237,0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
        <div style={{ fontSize: "17px", lineHeight: 1 }}>{alert.kind === "cruise" ? "🚢" : "🏢"}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "12px", fontWeight: 900, color: "#24324a", lineHeight: 1.1 }}>
            {alert.title}
          </div>
          <div style={{
            marginTop: "3px",
            fontSize: "13px",
            fontWeight: 900,
            color: "#172033",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {alert.detail}
          </div>
          <div style={{
            marginTop: "2px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#68758a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {alert.sub}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaxiMiniApp() {
  const { refs, state, derived, actions } = useTaxiAppState();
  const C = window.AppConstants;

  const startupAudioRef = useRef(null);
  const startupTimersRef = useRef([]);

  const [startupPhase, setStartupPhase] = useState("logo");
  const [startupStage, setStartupStage] = useState(0);
  const [showReportTemplateSettings, setShowReportTemplateSettings] = useState(false);
  const [reportTemplate, setReportTemplate] = useState(() => {
    try {
      return localStorage.getItem("taxiReportTemplate") || "hiroshima-sogo";
    } catch (_) {
      return "hiroshima-sogo";
    }
  });
  const [businessProfile, setBusinessProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taxiBusinessProfile") || "{}");
    } catch (_) {
      return {};
    }
  });

  const [eventFeed, setEventFeed] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("taxiSalesEventFeed") || "null");
      return Array.isArray(cached?.events) ? cached.events : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    let alive = true;

    const loadEventFeed = () => {
      fetch("./data/events.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("events fetch failed"))))
        .then((data) => {
          if (!alive) return;
          const next = Array.isArray(data?.events) ? data.events : [];
          setEventFeed(next);
          try {
            localStorage.setItem("taxiSalesEventFeed", JSON.stringify({
              generatedAt: data?.generatedAt || null,
              savedAt: Date.now(),
              events: next,
            }));
          } catch (_) {}
        })
        .catch(() => {});
    };

    // 起動画面を見ている間に先読み。前回キャッシュがあれば即時表示し、
    // 最新データだけバックグラウンドで差し替える。
    loadEventFeed();

    const timer = setInterval(loadEventFeed, 5 * 60 * 1000);
    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") loadEventFeed();
    };
    const refreshOnFocus = () => loadEventFeed();
    const refreshOnOnline = () => loadEventFeed();

    document.addEventListener("visibilitychange", refreshOnVisible);
    window.addEventListener("focus", refreshOnFocus);
    window.addEventListener("online", refreshOnOnline);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshOnVisible);
      window.removeEventListener("focus", refreshOnFocus);
      window.removeEventListener("online", refreshOnOnline);
    };
  }, []);

  useEffect(() => {
    const timers = [];

    const t1 = setTimeout(() => setStartupPhase("logoFade"), 1500);
    const t2 = setTimeout(() => setStartupPhase("tap"), 2250);

    timers.push(t1, t2);
    startupTimersRef.current = timers;

    return () => {
      timers.forEach((id) => clearTimeout(id));
      startupTimersRef.current = [];
    };
  }, []);

  const startApp = () => {
    if (startupPhase !== "tap") return;

    const oldTimers = startupTimersRef.current || [];
    oldTimers.forEach((id) => clearTimeout(id));
    startupTimersRef.current = [];

    setStartupStage(0);
    setStartupPhase("tapFade");

    const timers = [];

    const t0 = setTimeout(() => {
      setStartupPhase("running");
    }, 180);

    const t1 = setTimeout(() => {
      try {
        if (!startupAudioRef.current) {
          startupAudioRef.current = new Audio("./goanzen.wav");
          startupAudioRef.current.preload = "auto";
          startupAudioRef.current.volume = 0.75;
        }
        startupAudioRef.current.currentTime = 0;
        startupAudioRef.current.play().catch(() => {});
      } catch (_) {}

      setStartupStage(1);
    }, 500);

    const t2 = setTimeout(() => {
      setStartupStage(2);
    }, 1000);

    const t3 = setTimeout(() => {
      setStartupStage(3);
    }, 1500);

    const t4 = setTimeout(() => {
      setStartupPhase("done");
    }, 2050);

    timers.push(t0, t1, t2, t3, t4);
    startupTimersRef.current = timers;
  };

  const startupLock = state.screen === "top" && startupPhase !== "done";

  const mainStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};

    return {
      transform:
        startupStage >= 2
          ? "translateX(0) scale(1)"
          : "translateX(-64px) scale(0.97)",
      opacity: startupStage >= 2 ? 1 : 0,
      transition:
        "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 460ms ease-out",
      willChange: "transform, opacity",
    };
  }, [state.screen, startupPhase, startupStage]);

  const otherStyle = useMemo(() => {
    if (state.screen !== "top" || startupPhase === "done") return {};

    return {
      transform: startupStage >= 3 ? "translateX(0)" : "translateX(-72px)",
      opacity: startupStage >= 3 ? 1 : 0,
      transition:
        "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 460ms ease-out",
      willChange: "transform, opacity",
    };
  }, [state.screen, startupPhase, startupStage]);

  const showSplash =
    state.screen === "top" &&
    ["logo", "logoFade", "tap", "tapFade"].includes(startupPhase);

  const splashStyle = useMemo(() => {
    if (startupPhase === "tapFade") {
      return {
        opacity: 0,
        transition: "opacity 180ms ease-out",
        pointerEvents: "none",
      };
    }

    return {
      opacity: 1,
      transition: "opacity 180ms ease-out",
      pointerEvents: "auto",
    };
  }, [startupPhase]);

  const showBottomNav =
    state.screen === "top" ||
    state.screen === "standby" ||
    state.screen === "ride";

  const navCenterLabel = state.screen === "top" ? "経費" : "履歴";

  return (
    <div className="w-full h-full flex justify-center bg-[#dfe5ee] overflow-hidden">
      <audio
        ref={startupAudioRef}
        src="./goanzen.wav"
        preload="auto"
        style={{ display: "none" }}
      />

      <div className="w-full max-w-[430px] h-full relative overflow-hidden bg-[#dfe5ee]">
        {state.showSaved && startupPhase === "done" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 shadow-lg">
            保存しました
          </div>
        )}

        {state.toastMessage && startupPhase === "done" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 shadow-lg">
            {state.toastMessage}
          </div>
        )}

        {startupPhase === "done" && (state.screen === "standby" || state.screen === "ride") && (
          <SalesNotificationLayer events={eventFeed} />
        )}

        <OtherSheet
          show={state.showOtherSheet}
          onClose={actions.closeOtherSheet}
          openHistoryFull={actions.openHistoryFullFromMenu}
          onShowSoon={actions.showSoonToast}
          onOpenSettings={() => {
            actions.closeOtherSheet();
            setShowReportTemplateSettings(true);
          }}
        />

        <ReportTemplateSettingsSheet
          show={showReportTemplateSettings}
          onClose={() => setShowReportTemplateSettings(false)}
          selectedTemplate={reportTemplate}
          records={state.records}
          businessProfile={businessProfile}
          onBusinessProfileChange={(key, value) => {
            setBusinessProfile((prev) => {
              const next = { ...prev, [key]: value };
              try {
                localStorage.setItem("taxiBusinessProfile", JSON.stringify(next));
              } catch (_) {}
              return next;
            });
          }}
          onSelectTemplate={(templateId) => {
            setReportTemplate(templateId);
            try {
              localStorage.setItem("taxiReportTemplate", templateId);
            } catch (_) {}
          }}
        />

        <DutyStartDialog
          show={state.showDutyStartDialog}
          date={new Date()}
          odometer={state.dutyStartOdometer}
          alcoholChecked={state.alcoholChecked}
          onOdometerChange={actions.setDutyStartOdometer}
          onAlcoholToggle={() => actions.setAlcoholChecked(!state.alcoholChecked)}
          onCancel={actions.cancelDutyStartDialog}
          onConfirm={actions.confirmDutyStart}
        />

        {state.showPaymentDialog && (
          <PaymentDialog
            amount={state.amount}
            pickupMeta={state.pickupMeta}
            dropoffMeta={state.dropoffMeta}
            paymentCountdown={state.paymentCountdown}
            savingDots={state.savingDots}
            onCancel={actions.cancelPaymentDialog}
          />
        )}

        {state.showViaDialog && (
          <ViaDialog
            pendingViaPlace={state.pendingViaPlace}
            onCancel={actions.cancelViaDialog}
            onRecord={actions.recordVia}
          />
        )}

        {state.showFinishDialog && (
          <FinishDialog
            workDate={state.workDate}
            recordCount={derived.recordCount}
            totalAmount={derived.totalAmount}
            onCancel={() => actions.setShowFinishDialog(false)}
            onConfirm={actions.performDutyEnd}
          />
        )}

        <HistoryModal
          show={state.showHistoryModal}
          editingRecord={state.editingRecord}
          historyUiMode={state.historyUiMode}
          historyMode={state.historyMode}
          historyFilter={state.historyFilter}
          historySummary={derived.historySummary}
          filteredHistoryRecords={derived.filteredHistoryRecords}
          groupedHistory={derived.groupedHistory}
          expandedMonthDays={state.expandedMonthDays}
          getHistoryPeriodText={derived.getHistoryPeriodText}
          closeHistoryModal={actions.closeHistoryModal}
          setHistoryMode={actions.setHistoryMode}
          setHistoryFilter={actions.setHistoryFilter}
          moveHistoryPeriod={actions.moveHistoryPeriod}
          toggleMonthDay={actions.toggleMonthDay}
          openEditRecord={actions.openEditRecord}
          closeEditRecord={actions.closeEditRecord}
          saveEditedRecord={actions.saveEditedRecord}
          deleteEditedRecord={actions.deleteEditedRecord}
          setEditingRecord={actions.setEditingRecord}
        />

        {(state.screen === "standby" || state.screen === "ride") && (
          <>
            <div
              className="absolute inset-x-0 top-0 bg-[#32CD32]"
              style={{ height: `${C.TOP_LAYOUT.LINE_5_GREEN_BOTTOM}px`, zIndex: 1 }}
            />

            <div onClick={actions.handleCardModeNext}>
              <HeaderCard
                timeParts={derived.timeParts}
                cardMode={state.cardMode}
                weather={state.weather}
                totalAmount={derived.totalAmount}
                amount1={derived.amount1}
                amount2={derived.amount2}
              />
            </div>
          </>
        )}

        {state.screen === "top" && (
          <TopScreen
            topMainLabel={derived.topMainLabel}
            topMainButtonDisabled={startupLock}
            handleTopMain={actions.handleTopMain}
            startupMainStyle={mainStyle}
            startupOtherStyle={otherStyle}
            homeEndSheetOpen={state.homeEndSheetOpen}
            toggleHomeEndSheet={actions.toggleHomeEndSheet}
            handleFinishTap={actions.handleFinishTap}
            dutyStarted={state.dutyStarted}
            timeParts={derived.timeParts}
            totalAmount={derived.totalAmount}
          />
        )}

        {state.screen === "standby" && (
          <StandbyScreen
            events={eventFeed}
            handleStartRide={actions.handleStartRide}
            homeEndSheetOpen={state.homeEndSheetOpen}
            handleFinishTap={actions.handleFinishTap}
          />
        )}

        {state.screen === "ride" && (
          <RideScreen
            pickup={state.pickup}
            rideStartAt={state.rideStartAt}
            elapsedText={derived.elapsedText}
            viaStops={state.viaStops}
            handleDropOffTap={actions.handleDropOffTap}
          />
        )}

        {state.screen === "fare" && (
          <FareScreen
            rideStartAt={state.rideStartAt}
            pickup={state.pickup}
            pickupMeta={state.pickupMeta}
            rideEndAt={state.rideEndAt}
            dropoff={state.dropoff}
            dropoffMeta={state.dropoffMeta}
            amountInputRef={refs.amountInputRef}
            formattedAmount={derived.formattedAmount}
            handleAmountChange={actions.handleAmountChange}
            selectedPassengers={state.selectedPassengers}
            handlePassengerSelect={actions.handlePassengerSelect}
            openPaymentDialog={actions.openPaymentDialog}
          />
        )}

        {showBottomNav && startupPhase !== "tapFade" && (
          <BottomNav
            centerLabel={navCenterLabel}
            onHome={actions.goHome}
            onCenter={
              state.screen === "top"
                ? actions.openExpenseSoon
                : actions.openHistorySimple
            }
            onMenu={actions.openMenu}
            active={state.screen === "top" ? "home" : "center"}
            isOpen={state.homeEndSheetOpen}
            onToggle={actions.toggleHomeEndSheet}
          />
        )}

        {showSplash && (
          <div
            className="absolute inset-0 z-[999] bg-white flex items-center justify-center"
            style={splashStyle}
          >
            {(startupPhase === "logo" || startupPhase === "logoFade") && (
              <div
                style={{
                  opacity: startupPhase === "logoFade" ? 0 : 1,
                  transition: "opacity 750ms ease",
                }}
              >
                <img
                  src="./logo.png"
                  alt="logo"
                  style={{
                    width: "250px",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}

            {startupPhase === "tap" && (
              <button
                type="button"
                onClick={startApp}
                className="bg-transparent border-none outline-none"
              >
                <span
                  className="text-[20px] text-slate-500 font-medium tracking-[0.08em]"
                  style={{ animation: "blink 1.2s infinite" }}
                >
                  タップして開始
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);
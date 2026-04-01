window.AppHooks = (() => {
  const { useEffect, useMemo, useRef, useState } = React;
  const Utils = window.AppUtils;
  const Geo = window.AppGeo;
  const Constants = window.AppConstants;

  function useTaxiAppState() {
    const [screen, setScreen] = useState("top");
    const [dutyStarted, setDutyStarted] = useState(false);
    const [isRiding, setIsRiding] = useState(false);

    const [rideStartAt, setRideStartAt] = useState(null);
    const [rideEndAt, setRideEndAt] = useState(null);

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [pickupMeta, setPickupMeta] = useState(null);
    const [dropoffMeta, setDropoffMeta] = useState(null);

    const [amount, setAmount] = useState("");
    const [selectedPassengers, setSelectedPassengers] = useState(null);

    const [records, setRecords] = useState([]);
    const [showSaved, setShowSaved] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showOtherSheet, setShowOtherSheet] = useState(false);

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [pendingPaymentType, setPendingPaymentType] = useState(null);
    const [paymentCountdown, setPaymentCountdown] = useState(2.5);
    const [savingDots, setSavingDots] = useState(4);

    const [showViaDialog, setShowViaDialog] = useState(false);
    const [pendingViaPlace, setPendingViaPlace] = useState("");
    const [viaStops, setViaStops] = useState([]);

    const [showFinishDialog, setShowFinishDialog] = useState(false);

    const [historyMode, setHistoryMode] = useState("day");
    const [historyFilter, setHistoryFilter] = useState("all");
    const [historyBaseDate, setHistoryBaseDate] = useState(new Date());
    const [expandedMonthDays, setExpandedMonthDays] = useState({});
    const [editingRecord, setEditingRecord] = useState(null);

    const [cardMode, setCardMode] = useState(3);
    const [workDate, setWorkDate] = useState(null);

    const [standbySheetOffset, setStandbySheetOffset] = useState(0);
    const [toastMessage, setToastMessage] = useState("");
    const [now, setNow] = useState(new Date());

    const [weather, setWeather] = useState({
      nowKind: "unknown",
      tomorrowKind: "unknown",
      fetchedAt: null,
      dateKey: null,
    });

    const amountInputRef = useRef(null);
    const savedTimerRef = useRef(null);
    const paymentTimerRef = useRef(null);
    const paymentCountdownRef = useRef(null);
    const toastTimerRef = useRef(null);
    const clockTimerRef = useRef(null);
    const dropTapRef = useRef({ lastTapAt: 0 });
    const paymentTypeRef = useRef(null);
    const sheetDragRef = useRef({ dragging: false, startY: 0, startOffset: 0 });

    useEffect(() => {
      clockTimerRef.current = setInterval(() => setNow(new Date()), 600);
      return () => {
        if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      };
    }, []);

    // ★追加：起動時に天気取得
    useEffect(() => {
      ensureWeatherFresh();
    }, []);

    useEffect(() => {
      if (screen === "fare") {
        const timer = setTimeout(() => amountInputRef.current?.focus(), 120);
        return () => clearTimeout(timer);
      }
    }, [screen]);

    useEffect(() => {
      return () => {
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
        if (paymentCountdownRef.current) clearInterval(paymentCountdownRef.current);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      };
    }, []);

    useEffect(() => {
      if (screen !== "standby") setStandbySheetOffset(0);
    }, [screen]);

    const isFinishVisible = standbySheetOffset >= Constants.FINISH_ENABLE_OFFSET;
    const isStandbySheetOpened =
      standbySheetOffset >= Constants.STANDBY_OTHER_MOVE_RANGE * 0.65;

    const ensureWeatherFresh = async (coords = null) => {
      if (!Geo.shouldRefreshWeather(weather.fetchedAt, weather.dateKey)) return;

      let latitude = coords?.latitude ?? null;
      let longitude = coords?.longitude ?? null;

      if (latitude == null || longitude == null) {
        const best = await Geo.getBestCurrentPlace();
        latitude = best.latitude;
        longitude = best.longitude;
      }

      if (latitude == null || longitude == null) return;

      const nextWeather = await Geo.fetchWeatherSnapshot(latitude, longitude);
      setWeather(nextWeather);
    };

    return {
      state: {
        screen,
        dutyStarted,
        isRiding,
        weather,
      },
      actions: {
        ensureWeatherFresh,
      },
    };
  }

  return { useTaxiAppState };
})();

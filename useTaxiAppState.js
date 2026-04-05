window.AppHooks = (() => {
  const { useEffect, useMemo, useRef, useState } = React;
  const Utils = window.AppUtils;
  const Geo = window.AppGeo;

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
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showHomeBottomCard, setShowHomeBottomCard] = useState(false);

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [pendingPaymentType, setPendingPaymentType] = useState(null);
    const [paymentCountdown, setPaymentCountdown] = useState(2.5);
    const [savingDots, setSavingDots] = useState(4);

    const [showViaDialog, setShowViaDialog] = useState(false);
    const [pendingViaPlace, setPendingViaPlace] = useState("");
    const [viaStops, setViaStops] = useState([]);

    const [showFinishDialog, setShowFinishDialog] = useState(false);

    const [historyViewType, setHistoryViewType] = useState("full");
    const [historyMode, setHistoryMode] = useState("day");
    const [historyFilter, setHistoryFilter] = useState("all");
    const [historyBaseDate, setHistoryBaseDate] = useState(new Date());
    const [expandedMonthDays, setExpandedMonthDays] = useState({});
    const [editingRecord, setEditingRecord] = useState(null);

    const [cardMode, setCardMode] = useState(3);
    const [workDate, setWorkDate] = useState(null);

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

    useEffect(() => {
      clockTimerRef.current = setInterval(() => setNow(new Date()), 600);
      return () => {
        if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      };
    }, []);

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
      if (screen !== "top") setShowHomeBottomCard(false);
    }, [screen]);

    const vibrateTap = () => {
      if (navigator.vibrate) navigator.vibrate(18);
    };

    const vibrateVia = () => {
      if (navigator.vibrate) navigator.vibrate(120);
    };

    const showToast = (text) => {
      setToastMessage(text);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToastMessage(""), 900);
    };

    const timeParts = useMemo(() => {
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const showColon = Math.floor(now.getTime() / 600) % 2 === 0;
      return { hh, mm, showColon };
    }, [now]);

    const elapsedText = useMemo(() => {
      if (!rideStartAt) return "0分";
      const diffMs = now.getTime() - rideStartAt.getTime();
      const diffMin = Math.max(0, Math.floor(diffMs / 1000 / 60));
      return `${diffMin}分`;
    }, [rideStartAt, now]);

    const totalAmount = useMemo(
      () => records.reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0),
      [records]
    );

    const recordCount = useMemo(() => records.length, [records]);

    const amount1 = useMemo(
      () =>
        records
          .filter((record) => record.payment === "cash" && !record.receipt)
          .reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0),
      [records]
    );

    const amount2 = useMemo(
      () =>
        records
          .filter((record) => !(record.payment === "cash" && !record.receipt))
          .reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0),
      [records]
    );

    const topMainLabel = useMemo(() => {
      if (!dutyStarted) return "乗務開始";
      if (isRiding) return "降車";
      return "実車";
    }, [dutyStarted, isRiding]);

    const topMainButtonDisabled = false;

    const formattedAmount = useMemo(
      () => (amount ? Number(amount).toLocaleString("ja-JP") : ""),
      [amount]
    );

    const historyModeForFilter = historyViewType === "simple" ? "day" : historyMode;

    const filteredHistoryRecords = useMemo(() => {
      let list = [...records];

      if (historyFilter === "1") {
        list = list.filter((record) => Utils.recordType(record) === "1");
      } else if (historyFilter === "2") {
        list = list.filter((record) => Utils.recordType(record) === "2");
      }

      if (historyModeForFilter === "day") {
        list = list.filter((record) =>
          Utils.isSameDay(Utils.getHistoryTargetDate(record), historyBaseDate)
        );
      } else if (historyModeForFilter === "week") {
        const start = Utils.getWeekStart(historyBaseDate);
        const end = Utils.getWeekEnd(historyBaseDate);
        list = list.filter((record) =>
          Utils.isInRange(Utils.getHistoryTargetDate(record), start, end)
        );
      } else if (historyModeForFilter === "month") {
        const start = Utils.getMonthStart(historyBaseDate);
        const end = Utils.getMonthEnd(historyBaseDate);
        list = list.filter((record) =>
          Utils.isInRange(Utils.getHistoryTargetDate(record), start, end)
        );
      }

      return list.sort((a, b) => new Date(b.乗車時刻) - new Date(a.乗車時刻));
    }, [records, historyFilter, historyModeForFilter, historyBaseDate]);

    const historySummary = useMemo(() => {
      const total = filteredHistoryRecords.reduce(
        (sum, record) => sum + Number(record.金額 || 0),
        0
      );
      return { total, count: filteredHistoryRecords.length };
    }, [filteredHistoryRecords]);

    const groupedHistory = useMemo(() => {
      const map = new Map();

      filteredHistoryRecords.forEach((record) => {
        const keyDate = Utils.getHistoryTargetDate(record);
        const key = `${keyDate.getFullYear()}-${String(keyDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(keyDate.getDate()).padStart(2, "0")}`;

        if (!map.has(key)) {
          map.set(key, {
            key,
            date: new Date(keyDate.getFullYear(), keyDate.getMonth(), keyDate.getDate()),
            records: [],
            total: 0,
            count: 0,
          });
        }

        const group = map.get(key);
        group.records.push(record);
        group.total += Number(record.金額 || 0);
        group.count += 1;
      });

      return Array.from(map.values()).sort((a, b) => b.date - a.date);
    }, [filteredHistoryRecords]);

    useEffect(() => {
      if (!showHistoryModal || historyViewType === "simple" || historyMode !== "month") return;

      const nextExpanded = {};
      groupedHistory.forEach((group, index) => {
        if (expandedMonthDays[group.key] === true) nextExpanded[group.key] = true;
        else if (index === 0) nextExpanded[group.key] = true;
      });
      setExpandedMonthDays(nextExpanded);
    }, [showHistoryModal, historyViewType, historyMode, groupedHistory]);

    const getHistoryPeriodText = () => {
      if (historyViewType === "simple") return Utils.formatFullDate(historyBaseDate);
      if (historyMode === "day") return Utils.formatFullDate(historyBaseDate);
      if (historyMode === "week") {
        const start = Utils.getWeekStart(historyBaseDate);
        const end = Utils.getWeekEnd(historyBaseDate);
        return `${Utils.formatShortDate(start)}〜${Utils.formatShortDate(end)}`;
      }
      return Utils.formatMonthText(historyBaseDate);
    };

    const resetHistoryView = (viewType) => {
      setHistoryViewType(viewType);
      setHistoryMode(viewType === "simple" ? "day" : "day");
      setHistoryFilter("all");
      setHistoryBaseDate(workDate ? new Date(workDate) : new Date());
      setExpandedMonthDays({});
    };

    const openSimpleHistory = () => {
      setShowOtherSheet(false);
      setShowExpenseModal(false);
      setShowHomeBottomCard(false);
      resetHistoryView("simple");
      setEditingRecord(null);
      setShowHistoryModal(true);
    };

    const openFullHistory = () => {
      setShowOtherSheet(false);
      setShowExpenseModal(false);
      setShowHomeBottomCard(false);
      resetHistoryView("full");
      setEditingRecord(null);
      setShowHistoryModal(true);
    };

    const closeHistoryModal = () => {
      setEditingRecord(null);
      setShowHistoryModal(false);
    };

    const moveHistoryPeriod = (diff) => {
      const next = new Date(historyBaseDate);
      const effectiveMode = historyViewType === "simple" ? "day" : historyMode;
      if (effectiveMode === "day") next.setDate(next.getDate() + diff);
      else if (effectiveMode === "week") next.setDate(next.getDate() + diff * 7);
      else next.setMonth(next.getMonth() + diff);
      setHistoryBaseDate(next);
    };

    const toggleMonthDay = (key) => {
      setExpandedMonthDays((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const openEditRecord = (record) => {
      setEditingRecord({
        ...record,
        金額入力: String(record.金額 ?? ""),
        乗車時刻入力: Utils.formatDateTimeLocal(record.乗車時刻),
        降車時刻入力: Utils.formatDateTimeLocal(record.降車時刻),
        乗車地入力: record.乗車地 || "",
        降車地入力: record.降車地 || "",
        区分入力: Utils.recordType(record),
        人数入力: record.人数 || "",
        備考入力: record.備考 || "",
      });
    };

    const closeEditRecord = () => setEditingRecord(null);

    const saveEditedRecord = () => {
      if (!editingRecord) return;

      const numericAmount = Number(String(editingRecord.金額入力 || "").replace(/[^\d]/g, ""));
      if (!numericAmount || numericAmount <= 0) return alert("正しい金額を入力してください");
      if (!editingRecord.乗車時刻入力 || !editingRecord.降車時刻入力) {
        return alert("時刻を入力してください");
      }

      const nextStartAt = new Date(editingRecord.乗車時刻入力);
      const nextEndAt = new Date(editingRecord.降車時刻入力);

      if (Number.isNaN(nextStartAt.getTime()) || Number.isNaN(nextEndAt.getTime())) {
        return alert("時刻の形式が正しくありません");
      }
      if (nextEndAt.getTime() < nextStartAt.getTime()) {
        return alert("降車時刻は乗車時刻より後にしてください");
      }

      const nextPayment = editingRecord.区分入力 === "1" ? "cash" : "cardQr";
      const nextReceipt = false;

      const updatedRecord = {
        ...editingRecord,
        id: editingRecord.id,
        乗務日: editingRecord.乗務日 || editingRecord.乗車時刻,
        乗車時刻: nextStartAt,
        降車時刻: nextEndAt,
        金額: numericAmount,
        決済方法: nextPayment,
        payment: nextPayment,
        領収証: nextReceipt,
        receipt: nextReceipt,
        乗車地: (editingRecord.乗車地入力 || "").trim() || "未取得",
        降車地: (editingRecord.降車地入力 || "").trim() || "未取得",
        人数: editingRecord.人数入力 === "" ? "" : Number(editingRecord.人数入力 || ""),
        備考: (editingRecord.備考入力 || "").trim(),
      };

      setRecords((prev) =>
        prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
      );
      setEditingRecord(null);
    };

    const deleteEditedRecord = () => {
      if (!editingRecord) return;
      const ok = window.confirm("この履歴を削除しますか？\n削除すると元に戻せません。");
      if (!ok) return;
      setRecords((prev) => prev.filter((record) => record.id !== editingRecord.id));
      setEditingRecord(null);
    };

    const handleCardModeNext = () => setCardMode((prev) => (prev >= 5 ? 1 : prev + 1));

    const handleDutyStart = async () => {
      vibrateTap();
      const startDutyDate = new Date();

      setDutyStarted(true);
      setIsRiding(false);
      setRideStartAt(null);
      setRideEndAt(null);
      setPickup("");
      setDropoff("");
      setPickupMeta(null);
      setDropoffMeta(null);
      setAmount("");
      setSelectedPassengers(null);
      setViaStops([]);
      setScreen("standby");
      setWorkDate(startDutyDate);
      setShowHomeBottomCard(false);

      ensureWeatherFresh();
    };

    const performDutyEnd = () => {
      setDutyStarted(false);
      setIsRiding(false);
      setRideStartAt(null);
      setRideEndAt(null);
      setPickup("");
      setDropoff("");
      setPickupMeta(null);
      setDropoffMeta(null);
      setAmount("");
      setSelectedPassengers(null);
      setViaStops([]);
      setShowHistoryModal(false);
      setShowOtherSheet(false);
      setShowExpenseModal(false);
      setShowFinishDialog(false);
      setShowHomeBottomCard(false);
      setEditingRecord(null);
      setShowSaved(false);
      setWorkDate(null);
      setCardMode(3);
      setScreen("top");
    };

    const handleFinishTap = () => {
      setShowHomeBottomCard(false);
      setShowFinishDialog(true);
    };

    const handleTopMain = async () => {
      if (!dutyStarted) {
        await handleDutyStart();
        return;
      }

      if (isRiding) {
        await openNormalDropoff();
        return;
      }

      await handleStartRide();
    };

    const handleStartRide = async () => {
      vibrateTap();
      const start = new Date();

      setRideStartAt(start);
      setRideEndAt(null);
      setIsRiding(true);
      setPickup("取得中…");
      setDropoff("");
      setPickupMeta(null);
      setDropoffMeta(null);
      setSelectedPassengers(null);
      setViaStops([]);
      setShowHomeBottomCard(false);
      setScreen("ride");

      const best = await Geo.getBestCurrentPlace();
      setPickup(best.label || "未取得");
      setPickupMeta(best);
      ensureWeatherFresh(best);
    };

    const openNormalDropoff = async () => {
      vibrateTap();
      const end = new Date();

      setRideEndAt(end);
      setAmount("");
      setDropoff("取得中…");
      setDropoffMeta(null);
      setShowHomeBottomCard(false);
      setScreen("fare");

      const best = await Geo.getBestCurrentPlace();
      setDropoff(best.label || "未取得");
      setDropoffMeta(best);
    };

    const handleDropOffTap = async () => {
      const nowTap = Date.now();
      const diff = nowTap - dropTapRef.current.lastTapAt;
      dropTapRef.current.lastTapAt = nowTap;

      if (diff > 0 && diff < 320) {
        vibrateVia();
        const best = await Geo.getBestCurrentPlace();
        setPendingViaPlace(best.label || "未取得");
        setShowViaDialog(true);
        dropTapRef.current.lastTapAt = 0;
        return;
      }

      setTimeout(() => {
        if (dropTapRef.current.lastTapAt === nowTap) openNormalDropoff();
      }, 340);
    };

    const handleAmountChange = (e) => setAmount(e.target.value.replace(/[^\d]/g, ""));

    const handlePassengerSelect = (count) => {
      setSelectedPassengers(count);
      amountInputRef.current?.blur();
    };

    const clearPaymentCountdown = () => {
      if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
      if (paymentCountdownRef.current) clearInterval(paymentCountdownRef.current);
      paymentTimerRef.current = null;
      paymentCountdownRef.current = null;
    };

    const confirmPaymentSave = async (forcedType = null) => {
      const activeType = forcedType || pendingPaymentType;
      if (!rideStartAt || !rideEndAt || !activeType) return;

      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) return alert("正しい金額を入力してください");

      const finalPassengers = selectedPassengers || 1;
      let payment = "cash";
      let receipt = false;

      if (activeType === "cardQr") payment = "cardQr";
      if (activeType === "receipt") {
        payment = "cardQr";
        receipt = true;
      }

      const viaText = viaStops.length > 0 ? `経由：${viaStops.join(" → ")}` : "";
      const newRecord = {
        id: Date.now(),
        乗務日: workDate,
        乗車時刻: rideStartAt,
        降車時刻: rideEndAt,
        乗車地: pickup.trim() || "未取得",
        降車地: dropoff.trim() || "未取得",
        人数: finalPassengers,
        金額: numericAmount,
        決済方法: payment,
        payment,
        領収証: receipt,
        receipt,
        天気: weather.nowKind || "",
        乗車位置精度: pickupMeta?.accuracy ?? null,
        降車位置精度: dropoffMeta?.accuracy ?? null,
        乗車緯度: pickupMeta?.latitude ?? null,
        乗車経度: pickupMeta?.longitude ?? null,
        降車緯度: dropoffMeta?.latitude ?? null,
        降車経度: dropoffMeta?.longitude ?? null,
        備考: viaText,
      };

      clearPaymentCountdown();
      setShowPaymentDialog(false);
      setPendingPaymentType(null);
      setPaymentCountdown(2.5);
      setSavingDots(4);
      setRecords((prev) => [newRecord, ...prev]);

      setIsRiding(false);
      setRideStartAt(null);
      setRideEndAt(null);
      setPickup("");
      setDropoff("");
      setPickupMeta(null);
      setDropoffMeta(null);
      setAmount("");
      setSelectedPassengers(null);
      setViaStops([]);
      setScreen("standby");

      setShowSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setShowSaved(false), 2200);

      ensureWeatherFresh(dropoffMeta);
    };

    const openPaymentDialog = (type) => {
      if (selectedPassengers === null) return;

      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) return alert("正しい金額を入力してください");

      clearPaymentCountdown();
      setPendingPaymentType(type);
      setPaymentCountdown(2.5);
      setSavingDots(4);
      setShowPaymentDialog(true);

      paymentCountdownRef.current = setInterval(() => {
        setPaymentCountdown((prev) => {
          const next = prev - 0.5;
          return next <= 0 ? 0 : next;
        });
        setSavingDots((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 500);

      paymentTimerRef.current = setTimeout(() => confirmPaymentSave(type), 2500);
    };

    const cancelPaymentDialog = () => {
      setShowPaymentDialog(false);
      clearPaymentCountdown();
      setPendingPaymentType(null);
      setPaymentCountdown(2.5);
      setSavingDots(4);
    };

    const recordVia = () => {
      setViaStops((prev) => [...prev, pendingViaPlace || "未取得"]);
      setShowViaDialog(false);
      setPendingViaPlace("");
      showToast("記録しました");
    };

    const cancelViaDialog = () => {
      setShowViaDialog(false);
      setPendingViaPlace("");
      showToast("キャンセルします");
    };

    const goHome = () => {
      setScreen("top");
      setShowHomeBottomCard(false);
      setShowOtherSheet(false);
      setShowExpenseModal(false);
    };

    const toggleHomeBottomCard = () => {
      if (!dutyStarted) return;
      setShowHomeBottomCard((prev) => !prev);
    };

    const openExpenseModal = () => {
      setShowOtherSheet(false);
      setShowExpenseModal(true);
    };

    const openOtherSheet = () => {
      setShowExpenseModal(false);
      setShowOtherSheet(true);
    };

    return {
      refs: {
        amountInputRef,
      },
      state: {
        screen,
        dutyStarted,
        isRiding,
        rideStartAt,
        rideEndAt,
        pickup,
        dropoff,
        pickupMeta,
        dropoffMeta,
        amount,
        selectedPassengers,
        records,
        showSaved,
        showHistoryModal,
        showOtherSheet,
        showExpenseModal,
        showHomeBottomCard,
        showPaymentDialog,
        pendingPaymentType,
        paymentCountdown,
        savingDots,
        showViaDialog,
        pendingViaPlace,
        viaStops,
        showFinishDialog,
        historyViewType,
        historyMode,
        historyFilter,
        historyBaseDate,
        expandedMonthDays,
        editingRecord,
        cardMode,
        workDate,
        toastMessage,
        now,
        weather,
      },
      derived: {
        timeParts,
        elapsedText,
        totalAmount,
        recordCount,
        amount1,
        amount2,
        topMainLabel,
        topMainButtonDisabled,
        formattedAmount,
        filteredHistoryRecords,
        historySummary,
        groupedHistory,
        getHistoryPeriodText,
      },
      actions: {
        setShowOtherSheet,
        setShowExpenseModal,
        setShowFinishDialog,
        setShowHistoryModal,
        setEditingRecord,
        setHistoryMode,
        setHistoryFilter,
        setCardMode,
        handleCardModeNext,
        handleDutyStart,
        performDutyEnd,
        handleFinishTap,
        handleTopMain,
        handleStartRide,
        handleDropOffTap,
        handleAmountChange,
        handlePassengerSelect,
        openPaymentDialog,
        cancelPaymentDialog,
        recordVia,
        cancelViaDialog,
        openSimpleHistory,
        openFullHistory,
        closeHistoryModal,
        moveHistoryPeriod,
        toggleMonthDay,
        openEditRecord,
        closeEditRecord,
        saveEditedRecord,
        deleteEditedRecord,
        goHome,
        toggleHomeBottomCard,
        openExpenseModal,
        openOtherSheet,
      },
    };
  }

  return { useTaxiAppState };
})();

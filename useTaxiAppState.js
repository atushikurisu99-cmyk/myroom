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
    const [historyUiMode, setHistoryUiMode] = useState("simple");

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [pendingPaymentType, setPendingPaymentType] = useState(null);
    const [paymentCountdown, setPaymentCountdown] = useState(2.5);
    const [savingDots, setSavingDots] = useState(4);

    const [showViaDialog, setShowViaDialog] = useState(false);
    const [pendingViaPlace, setPendingViaPlace] = useState("");
    const [viaStops, setViaStops] = useState([]);

    const [homeEndSheetOpen, setHomeEndSheetOpen] = useState(false);

    const [historyMode, setHistoryMode] = useState("day");
    const [historyFilter, setHistoryFilter] = useState("all");
    const [historyBaseDate, setHistoryBaseDate] = useState(new Date());
    const [expandedMonthDays, setExpandedMonthDays] = useState({});
    const [editingRecord, setEditingRecord] = useState(null);

    const [cardMode, setCardMode] = useState(3);
    const [workDate, setWorkDate] = useState(null);

    const [toastMessage, setToastMessage] = useState("");
    const [now, setNow] = useState(new Date());

    const [finishForm, setFinishForm] = useState({
      totalDistance: "",
      note: "",
    });

    const [weather, setWeather] = useState({
      nowKind: "unknown",
      tomorrowKind: "unknown",
      fetchedAt: null,
      dateKey: null,
    });

    const [isHomeAmountVisible, setIsHomeAmountVisible] = useState(true);

    const amountInputRef = useRef(null);
    const savedTimerRef = useRef(null);
    const paymentTimerRef = useRef(null);
    const paymentCountdownRef = useRef(null);
    const toastTimerRef = useRef(null);
    const clockTimerRef = useRef(null);
    const dropTapRef = useRef({ lastTapAt: 0 });
    const paymentTypeRef = useRef(null);

    const pickupTaskIdRef = useRef(0);
    const dropoffTaskIdRef = useRef(0);
    const pickupProgressTimerRef = useRef(null);
    const dropoffProgressTimerRef = useRef(null);
    const pickupPromiseRef = useRef(Promise.resolve(null));
    const dropoffPromiseRef = useRef(Promise.resolve(null));

    useEffect(() => {
      try {
        const raw = window.localStorage.getItem("taxi_home_amount_visible");
        if (raw === "0") setIsHomeAmountVisible(false);
        if (raw === "1") setIsHomeAmountVisible(true);
      } catch (_) {}
    }, []);

    useEffect(() => {
      try {
        window.localStorage.setItem(
          "taxi_home_amount_visible",
          isHomeAmountVisible ? "1" : "0"
        );
      } catch (_) {}
    }, [isHomeAmountVisible]);

    const ensureWeatherFresh = async (coords = null) => {
      if (!Geo.shouldRefreshWeather(weather.fetchedAt, weather.dateKey)) return;

      let latitude = coords?.latitude ?? null;
      let longitude = coords?.longitude ?? null;

      if (latitude == null || longitude == null) {
        const best = await getReliablePlace();
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
        if (pickupProgressTimerRef.current) clearInterval(pickupProgressTimerRef.current);
        if (dropoffProgressTimerRef.current) clearInterval(dropoffProgressTimerRef.current);
      };
    }, []);

    useEffect(() => {
      if (screen !== "top") setHomeEndSheetOpen(false);
    }, [screen]);

    const vibrateTap = () => {
      if (navigator.vibrate) navigator.vibrate(18);
    };

    const vibrateVia = () => {
      if (navigator.vibrate) navigator.vibrate(120);
    };

    const vibrateStrong = () => {
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    };

    const showToast = (text) => {
      setToastMessage(text);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToastMessage(""), 1000);
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

    const passengerCount = useMemo(
      () => records.reduce((sum, record) => sum + Number(record.人数 || 0), 0),
      [records]
    );

    const businessKm = useMemo(() => {
      const raw = String(finishForm.totalDistance || "").replace(/[^\d]/g, "");
      return raw ? Number(raw) : 0;
    }, [finishForm.totalDistance]);

    const finishSummary = useMemo(
      () => ({
        amount1,
        amount2,
        totalAmount,
        businessKm,
        recordCount,
        passengerCount,
      }),
      [amount1, amount2, totalAmount, businessKm, recordCount, passengerCount]
    );

    const homeDisplayAmount = useMemo(() => {
      if (!workDate) return totalAmount;

      const base = new Date(workDate);
      const workYear = base.getFullYear();
      const workMonth = base.getMonth();
      const workDay = base.getDate();

      let cumulative = 0;
      let dutyPart = 0;

      records.forEach((record) => {
        const target = Utils.getHistoryTargetDate(record);
        if (target.getFullYear() !== workYear || target.getMonth() !== workMonth) return;

        const amountValue = Number(record.金額 || record.amount || 0);

        if (target.getDate() < workDay) cumulative += amountValue;
        else if (target.getDate() === workDay) dutyPart += amountValue;
      });

      return cumulative + dutyPart;
    }, [records, workDate, totalAmount]);

    const topMainLabel = !dutyStarted ? "乗務開始" : isRiding ? "降車" : "実車";
    const topMainButtonDisabled = false;

    const formattedAmount = useMemo(
      () => (amount ? Number(amount).toLocaleString("ja-JP") : ""),
      [amount]
    );

    const filteredHistoryRecords = useMemo(() => {
      let list = [...records];

      if (historyFilter === "1") {
        list = list.filter((record) => Utils.recordType(record) === "1");
      } else if (historyFilter === "2") {
        list = list.filter((record) => Utils.recordType(record) === "2");
      }

      if (historyMode === "day") {
        list = list.filter((record) =>
          Utils.isSameDay(Utils.getHistoryTargetDate(record), historyBaseDate)
        );
      } else if (historyMode === "week") {
        const start = Utils.getWeekStart(historyBaseDate);
        const end = Utils.getWeekEnd(historyBaseDate);
        list = list.filter((record) =>
          Utils.isInRange(Utils.getHistoryTargetDate(record), start, end)
        );
      } else if (historyMode === "month") {
        const start = Utils.getMonthStart(historyBaseDate);
        const end = Utils.getMonthEnd(historyBaseDate);
        list = list.filter((record) =>
          Utils.isInRange(Utils.getHistoryTargetDate(record), start, end)
        );
      }

      return list.sort((a, b) => new Date(b.乗車時刻) - new Date(a.乗車時刻));
    }, [records, historyFilter, historyMode, historyBaseDate]);

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
        const key = `${keyDate.getFullYear()}-${String(
          keyDate.getMonth() + 1
        ).padStart(2, "0")}-${String(keyDate.getDate()).padStart(2, "0")}`;

        if (!map.has(key)) {
          map.set(key, {
            key,
            date: new Date(
              keyDate.getFullYear(),
              keyDate.getMonth(),
              keyDate.getDate()
            ),
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
      if (!showHistoryModal || historyMode !== "month" || historyUiMode !== "full") {
        return;
      }

      setExpandedMonthDays((prev) => {
        const nextExpanded = {};
        groupedHistory.forEach((group, index) => {
          if (prev[group.key] === true) nextExpanded[group.key] = true;
          else if (index === 0) nextExpanded[group.key] = true;
        });
        return nextExpanded;
      });
    }, [showHistoryModal, historyMode, groupedHistory, historyUiMode]);

    const getHistoryPeriodText = () => {
      if (historyMode === "day") return Utils.formatFullDate(historyBaseDate);
      if (historyMode === "week") {
        const start = Utils.getWeekStart(historyBaseDate);
        const end = Utils.getWeekEnd(historyBaseDate);
        return `${Utils.formatShortDate(start)}〜${Utils.formatShortDate(end)}`;
      }
      return Utils.formatMonthText(historyBaseDate);
    };

    const resetHistoryView = (uiMode = "simple") => {
      setHistoryUiMode(uiMode);
      setHistoryMode("day");
      setHistoryFilter("all");
      setHistoryBaseDate(workDate ? new Date(workDate) : new Date());
      setExpandedMonthDays({});
    };

    const openHistorySimple = () => {
      setShowOtherSheet(false);
      resetHistoryView("simple");
      setEditingRecord(null);
      setShowHistoryModal(true);
    };

    const openHistoryFull = () => {
      setShowOtherSheet(false);
      resetHistoryView("full");
      setEditingRecord(null);
      setShowHistoryModal(true);
    };

    const openHistoryModalWithFilter = (filterValue = "all") => {
      setShowOtherSheet(false);
      resetHistoryView("simple");
      setHistoryFilter(filterValue);
      setEditingRecord(null);
      setShowHistoryModal(true);
    };

    const closeHistoryModal = () => {
      setEditingRecord(null);
      setShowHistoryModal(false);
    };

    const moveHistoryPeriod = (diff) => {
      const next = new Date(historyBaseDate);
      if (historyMode === "day") next.setDate(next.getDate() + diff);
      else if (historyMode === "week") next.setDate(next.getDate() + diff * 7);
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

      const numericAmount = Number(
        String(editingRecord.金額入力 || "").replace(/[^\d]/g, "")
      );
      if (!numericAmount || numericAmount <= 0) {
        return alert("正しい金額を入力してください");
      }
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

    async function getReliablePlace() {
      const best = await Geo.getBestCurrentPlace();
      return (
        best || {
          label: "未取得",
          accuracy: null,
          latitude: null,
          longitude: null,
        }
      );
    }

    const isPendingPlaceLabel = (text) => {
      const value = String(text || "").trim();
      return (
        value === "取得中…" ||
        value === "位置を確認中…" ||
        value === "より正確に確認中…" ||
        value === "住所調整中…"
      );
    };

    const getPlaceProgressLabel = (elapsedMs) => {
      if (elapsedMs < 3000) return "位置を確認中…";
      if (elapsedMs < 6000) return "より正確に確認中…";
      return "住所調整中…";
    };

    const clearPickupProgress = () => {
      if (pickupProgressTimerRef.current) {
        clearInterval(pickupProgressTimerRef.current);
        pickupProgressTimerRef.current = null;
      }
    };

    const clearDropoffProgress = () => {
      if (dropoffProgressTimerRef.current) {
        clearInterval(dropoffProgressTimerRef.current);
        dropoffProgressTimerRef.current = null;
      }
    };

    const resolveActivePlace = (resolved, currentLabel, currentMeta) => {
      if (resolved && resolved.latitude != null && resolved.longitude != null) {
        return {
          label: resolved.label || "未取得",
          accuracy: resolved.accuracy ?? null,
          latitude: resolved.latitude ?? null,
          longitude: resolved.longitude ?? null,
        };
      }

      if (
        currentMeta &&
        currentMeta.latitude != null &&
        currentMeta.longitude != null &&
        !isPendingPlaceLabel(currentLabel)
      ) {
        return {
          label: (currentLabel || currentMeta.label || "未取得").trim() || "未取得",
          accuracy: currentMeta.accuracy ?? null,
          latitude: currentMeta.latitude ?? null,
          longitude: currentMeta.longitude ?? null,
        };
      }

      return {
        label: isPendingPlaceLabel(currentLabel) ? "未取得" : (currentLabel || "未取得").trim(),
        accuracy: currentMeta?.accuracy ?? null,
        latitude: currentMeta?.latitude ?? null,
        longitude: currentMeta?.longitude ?? null,
      };
    };

    const startPickupResolve = () => {
      pickupTaskIdRef.current += 1;
      const taskId = pickupTaskIdRef.current;
      const startedAt = Date.now();

      clearPickupProgress();
      setPickup("位置を確認中…");
      setPickupMeta(null);

      pickupProgressTimerRef.current = setInterval(() => {
        if (pickupTaskIdRef.current !== taskId) return;
        setPickup(getPlaceProgressLabel(Date.now() - startedAt));
      }, 300);

      const promise = (async () => {
        try {
          const best = await getReliablePlace();
          if (pickupTaskIdRef.current !== taskId) return best;
          setPickup(best.label || "未取得");
          setPickupMeta(best);
          ensureWeatherFresh(best);
          return best;
        } catch (_) {
          if (pickupTaskIdRef.current !== taskId) return null;
          const fallback = {
            label: "未取得",
            accuracy: null,
            latitude: null,
            longitude: null,
          };
          setPickup(fallback.label);
          setPickupMeta(fallback);
          return fallback;
        } finally {
          if (pickupTaskIdRef.current === taskId) {
            clearPickupProgress();
          }
        }
      })();

      pickupPromiseRef.current = promise;
      return promise;
    };

    const startDropoffResolve = () => {
      dropoffTaskIdRef.current += 1;
      const taskId = dropoffTaskIdRef.current;
      const startedAt = Date.now();

      clearDropoffProgress();
      setDropoff("位置を確認中…");
      setDropoffMeta(null);

      dropoffProgressTimerRef.current = setInterval(() => {
        if (dropoffTaskIdRef.current !== taskId) return;
        setDropoff(getPlaceProgressLabel(Date.now() - startedAt));
      }, 300);

      const promise = (async () => {
        try {
          const best = await getReliablePlace();
          if (dropoffTaskIdRef.current !== taskId) return best;
          setDropoff(best.label || "未取得");
          setDropoffMeta(best);
          return best;
        } catch (_) {
          if (dropoffTaskIdRef.current !== taskId) return null;
          const fallback = {
            label: "未取得",
            accuracy: null,
            latitude: null,
            longitude: null,
          };
          setDropoff(fallback.label);
          setDropoffMeta(fallback);
          return fallback;
        } finally {
          if (dropoffTaskIdRef.current === taskId) {
            clearDropoffProgress();
          }
        }
      })();

      dropoffPromiseRef.current = promise;
      return promise;
    };

    const cancelPlaceTasks = () => {
      pickupTaskIdRef.current += 1;
      dropoffTaskIdRef.current += 1;
      clearPickupProgress();
      clearDropoffProgress();
      pickupPromiseRef.current = Promise.resolve(null);
      dropoffPromiseRef.current = Promise.resolve(null);
    };

    const handleDutyStart = async () => {
      vibrateTap();
      const startDutyDate = new Date();

      cancelPlaceTasks();

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
      setFinishForm({
        totalDistance: "",
        note: "",
      });
      setShowHistoryModal(false);
      setShowOtherSheet(false);
      setEditingRecord(null);
      setScreen("standby");
      setWorkDate(startDutyDate);
      setHomeEndSheetOpen(false);

      ensureWeatherFresh();
    };

    const performDutyEnd = () => {
      cancelPlaceTasks();

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
      setEditingRecord(null);
      setShowSaved(false);
      setWorkDate(null);
      setCardMode(3);
      setHomeEndSheetOpen(false);
      setFinishForm({
        totalDistance: "",
        note: "",
      });
      setScreen("top");
    };

    const handleFinishTap = () => {
      if (!dutyStarted) return;
      if (isRiding) return;
      setShowOtherSheet(false);
      setShowHistoryModal(false);
      setEditingRecord(null);
      setHomeEndSheetOpen(false);
      setScreen("finishCheck");
    };

    const closeFinishCheck = () => {
      setScreen("top");
    };

    const handleTopMain = () => {
      if (!dutyStarted) {
        handleDutyStart();
        return;
      }

      if (isRiding) {
        handleDropOffTap();
        return;
      }

      handleStartRide();
    };

    const goHome = () => {
      setShowOtherSheet(false);
      setScreen("top");
    };

    const handleStartRide = async () => {
      vibrateTap();
      const start = new Date();

      cancelPlaceTasks();

      setRideStartAt(start);
      setRideEndAt(null);
      setIsRiding(true);
      setPickup("");
      setDropoff("");
      setPickupMeta(null);
      setDropoffMeta(null);
      setSelectedPassengers(null);
      setViaStops([]);
      setHomeEndSheetOpen(false);
      setScreen("ride");

      startPickupResolve();
    };

    const openNormalDropoff = async () => {
      vibrateTap();
      const end = new Date();

      setRideEndAt(end);
      setAmount("");
      setDropoff("");
      setDropoffMeta(null);
      setScreen("fare");

      startDropoffResolve();
    };

    const handleDropOffTap = async () => {
      const nowTap = Date.now();
      const diff = nowTap - dropTapRef.current.lastTapAt;
      dropTapRef.current.lastTapAt = nowTap;

      if (diff > 0 && diff < 320) {
        vibrateVia();
        const best = await getReliablePlace();
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
      const activeType = forcedType || paymentTypeRef.current || pendingPaymentType;
      if (!rideStartAt || !rideEndAt || !activeType) return;

      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) {
        return alert("正しい金額を入力してください");
      }

      const finalPassengers = selectedPassengers || 1;
      let payment = "cash";
      let receipt = false;

      if (activeType === "cardQr") payment = "cardQr";
      if (activeType === "receipt") {
        payment = "cardQr";
        receipt = true;
      }

      const [resolvedPickup, resolvedDropoff] = await Promise.all([
        pickupPromiseRef.current.catch(() => null),
        dropoffPromiseRef.current.catch(() => null),
      ]);

      const finalPickup = resolveActivePlace(resolvedPickup, pickup, pickupMeta);
      const finalDropoff = resolveActivePlace(resolvedDropoff, dropoff, dropoffMeta);

      if (isPendingPlaceLabel(finalPickup.label)) finalPickup.label = "未取得";
      if (isPendingPlaceLabel(finalDropoff.label)) finalDropoff.label = "未取得";

      const viaText = viaStops.length > 0 ? `経由：${viaStops.join(" → ")}` : "";
      const newRecord = {
        id: Date.now(),
        乗務日: workDate,
        乗車時刻: rideStartAt,
        降車時刻: rideEndAt,
        乗車地: finalPickup.label || "未取得",
        降車地: finalDropoff.label || "未取得",
        人数: finalPassengers,
        金額: numericAmount,
        決済方法: payment,
        payment,
        領収証: receipt,
        receipt,
        天気: weather.nowKind || "",
        乗車位置精度: finalPickup.accuracy ?? null,
        降車位置精度: finalDropoff.accuracy ?? null,
        乗車緯度: finalPickup.latitude ?? null,
        乗車経度: finalPickup.longitude ?? null,
        降車緯度: finalDropoff.latitude ?? null,
        降車経度: finalDropoff.longitude ?? null,
        備考: viaText,
      };

      clearPaymentCountdown();
      setShowPaymentDialog(false);
      setPendingPaymentType(null);
      paymentTypeRef.current = null;
      setPaymentCountdown(2.5);
      setSavingDots(4);
      setRecords((prev) => [newRecord, ...prev]);

      cancelPlaceTasks();

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

      ensureWeatherFresh(finalDropoff);
    };

    const openPaymentDialog = (type) => {
      if (selectedPassengers === null) return;

      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) {
        return alert("正しい金額を入力してください");
      }

      clearPaymentCountdown();
      setPendingPaymentType(type);
      paymentTypeRef.current = type;
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
      paymentTypeRef.current = null;
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

    const toggleHomeEndSheet = () => {
      if (!dutyStarted) return;
      if (isRiding) return;
      setHomeEndSheetOpen((prev) => !prev);
    };

    const openExpenseSoon = () => {
      showToast("経費は準備中です");
    };

    const openMenu = () => {
      setShowOtherSheet(true);
    };

    const closeOtherSheet = () => {
      setShowOtherSheet(false);
    };

    const openHistoryFullFromMenu = () => {
      setShowOtherSheet(false);
      openHistoryFull();
    };

    const showSoonToast = () => {
      setShowOtherSheet(false);
      showToast("準備中です");
    };

    const setFinishFormField = (key, value) => {
      setFinishForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const toggleHomeAmountVisible = () => {
      setIsHomeAmountVisible((prev) => !prev);
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
        showPaymentDialog,
        pendingPaymentType,
        paymentCountdown,
        savingDots,
        showViaDialog,
        pendingViaPlace,
        viaStops,
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
        historyUiMode,
        homeEndSheetOpen,
        finishForm,
        isHomeAmountVisible,
      },
      derived: {
        timeParts,
        elapsedText,
        totalAmount,
        recordCount,
        amount1,
        amount2,
        passengerCount,
        finishSummary,
        topMainLabel,
        topMainButtonDisabled,
        formattedAmount,
        filteredHistoryRecords,
        historySummary,
        groupedHistory,
        getHistoryPeriodText,
        homeDisplayAmount,
      },
      actions: {
        setShowOtherSheet,
        setShowHistoryModal,
        setEditingRecord,
        setHistoryMode,
        setHistoryFilter,
        setHistoryBaseDate,
        setExpandedMonthDays,
        setCardMode,
        handleCardModeNext,
        handleDutyStart,
        performDutyEnd,
        handleFinishTap,
        closeFinishCheck,
        handleTopMain,
        handleStartRide,
        handleDropOffTap,
        handleAmountChange,
        handlePassengerSelect,
        openPaymentDialog,
        cancelPaymentDialog,
        recordVia,
        cancelViaDialog,
        openHistorySimple,
        openHistoryFull,
        openHistoryModalWithFilter,
        closeHistoryModal,
        moveHistoryPeriod,
        toggleMonthDay,
        openEditRecord,
        closeEditRecord,
        saveEditedRecord,
        deleteEditedRecord,
        goHome,
        toggleHomeEndSheet,
        openExpenseSoon,
        openMenu,
        closeOtherSheet,
        openHistoryFullFromMenu,
        showSoonToast,
        setFinishFormField,
        toggleHomeAmountVisible,
        vibrateStrong,
      },
      helpers: {
        confirmPaymentSave,
        ensureWeatherFresh,
        getReliablePlace,
      },
    };
  }

  return { useTaxiAppState };
})();

const { useEffect, useMemo, useRef, useState } = React;

const {
  SHARED_INFO_SLOT_HEIGHT,
  MAIN_BUTTON_SLOT_HEIGHT,
  STANDBY_OTHER_MOVE_RANGE,
  STANDBY_FINISH_TOP,
  FINISH_ENABLE_OFFSET,
  PASSENGER_ACTIVE,
  PASSENGER_INACTIVE,
  PAYMENT_DISABLED,
  PAYMENT_CASH,
  PAYMENT_CARD,
  PAYMENT_RECEIPT,
  shadowSub,
  cardClass,
  mainButtonBase,
  mainButtonShine,
  bigButtonText,
  smallButtonBase,
  endDutyButtonClass,
} = window.AppConstants;

const {
  clamp,
  formatMoney,
  formatTime,
  formatShortDate,
  formatFullDate,
  formatMonthText,
  formatDateTimeLocal,
  recordType,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
  isSameDay,
  isInRange,
  getHistoryTargetDate,
} = window.AppUtils;

const { getBestCurrentPlace } = window.AppGeo;
const {
  BottomCard,
  HistoryRecordCard,
  OtherSheet,
  PaymentDialog,
  ViaDialog,
  FinishDialog,
} = window.AppComponents;

function TaxiMiniApp() {
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

  const amountInputRef = useRef(null);
  const savedTimerRef = useRef(null);
  const paymentTimerRef = useRef(null);
  const paymentCountdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const clockTimerRef = useRef(null);
  const topScrollRef = useRef(null);
  const dropTapRef = useRef({ lastTapAt: 0 });
  const paymentTypeRef = useRef(null);
  const sheetDragRef = useRef({ dragging: false, startY: 0, startOffset: 0 });

  useEffect(() => {
    clockTimerRef.current = setInterval(() => setNow(new Date()), 600);
    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
      if (paymentCountdownRef.current) clearInterval(paymentCountdownRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (screen === "fare") {
      const timer = setTimeout(() => amountInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "top") {
      requestAnimationFrame(() => {
        if (topScrollRef.current) topScrollRef.current.scrollTop = 0;
      });
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "standby") setStandbySheetOffset(0);
  }, [screen]);

  useEffect(() => {
    const handleMouseMove = (e) => updateStandbySheetDrag(e.clientY);
    const handleMouseUp = () => endStandbySheetDrag();
    const handleTouchMove = (e) => {
      if (!sheetDragRef.current.dragging) return;
      if (e.cancelable) e.preventDefault();
      updateStandbySheetDrag(e.touches[0].clientY);
    };
    const handleTouchEnd = () => endStandbySheetDrag();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [standbySheetOffset]);

  const isFinishVisible = standbySheetOffset > FINISH_ENABLE_OFFSET;

  const vibrateTap = () => navigator.vibrate && navigator.vibrate(18);
  const vibrateVia = () => navigator.vibrate && navigator.vibrate(120);

  const showToast = (text) => {
    setToastMessage(text);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(""), 900);
  };

  const beginStandbySheetDrag = (clientY) => {
    sheetDragRef.current = { dragging: true, startY: clientY, startOffset: standbySheetOffset };
  };

  const updateStandbySheetDrag = (clientY) => {
    if (!sheetDragRef.current.dragging) return;
    const delta = clientY - sheetDragRef.current.startY;
    const nextOffset = clamp(sheetDragRef.current.startOffset + delta, 0, STANDBY_OTHER_MOVE_RANGE);
    setStandbySheetOffset(nextOffset);
  };

  const endStandbySheetDrag = () => {
    if (!sheetDragRef.current.dragging) return;
    sheetDragRef.current.dragging = false;
    setStandbySheetOffset((prev) => (prev > STANDBY_OTHER_MOVE_RANGE * 0.38 ? STANDBY_OTHER_MOVE_RANGE : 0));
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

  const totalAmount = useMemo(() => records.reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0), [records]);
  const recordCount = useMemo(() => records.length, [records]);
  const amount1 = useMemo(() => records.filter((record) => record.payment === "cash" && !record.receipt).reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0), [records]);
  const amount2 = useMemo(() => records.filter((record) => !(record.payment === "cash" && !record.receipt)).reduce((sum, record) => sum + Number(record.amount || record.金額 || 0), 0), [records]);
  const previewRecords = useMemo(() => records.slice(0, 3), [records]);
  const formattedAmount = useMemo(() => (amount ? Number(amount).toLocaleString("ja-JP") : ""), [amount]);

  const stateLabel = (() => {
    if (screen === "standby") return "乗車待機";
    if (screen === "ride") return "実車中";
    if (screen === "fare") return "金額入力";
    if (isRiding) return "実車中";
    if (dutyStarted) return "乗車待機";
    return "乗務開始前";
  })();

  const topMainLabel = !dutyStarted ? "乗務開始" : "乗務終了";
  const topMainButtonDisabled = screen === "top" && isRiding;

  const filteredHistoryRecords = useMemo(() => {
    let list = [...records];
    if (historyFilter === "1") list = list.filter((record) => recordType(record) === "1");
    if (historyFilter === "2") list = list.filter((record) => recordType(record) === "2");

    if (historyMode === "day") {
      list = list.filter((record) => isSameDay(getHistoryTargetDate(record), historyBaseDate));
    } else if (historyMode === "week") {
      const start = getWeekStart(historyBaseDate);
      const end = getWeekEnd(historyBaseDate);
      list = list.filter((record) => isInRange(getHistoryTargetDate(record), start, end));
    } else {
      const start = getMonthStart(historyBaseDate);
      const end = getMonthEnd(historyBaseDate);
      list = list.filter((record) => isInRange(getHistoryTargetDate(record), start, end));
    }

    return list.sort((a, b) => new Date(b.乗車時刻) - new Date(a.乗車時刻));
  }, [records, historyFilter, historyMode, historyBaseDate]);

  const historySummary = useMemo(() => ({
    total: filteredHistoryRecords.reduce((sum, record) => sum + Number(record.金額 || 0), 0),
    count: filteredHistoryRecords.length,
  }), [filteredHistoryRecords]);

  const groupedHistory = useMemo(() => {
    const map = new Map();
    filteredHistoryRecords.forEach((record) => {
      const keyDate = getHistoryTargetDate(record);
      const key = `${keyDate.getFullYear()}-${String(keyDate.getMonth() + 1).padStart(2, "0")}-${String(keyDate.getDate()).padStart(2, "0")}`;
      if (!map.has(key)) {
        map.set(key, { key, date: new Date(keyDate.getFullYear(), keyDate.getMonth(), keyDate.getDate()), records: [], total: 0, count: 0 });
      }
      const group = map.get(key);
      group.records.push(record);
      group.total += Number(record.金額 || 0);
      group.count += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.date - a.date);
  }, [filteredHistoryRecords]);

  useEffect(() => {
    if (!showHistoryModal || historyMode !== "month") return;
    const nextExpanded = {};
    groupedHistory.forEach((group, index) => {
      if (expandedMonthDays[group.key] === true || index === 0) nextExpanded[group.key] = true;
    });
    setExpandedMonthDays(nextExpanded);
  }, [showHistoryModal, historyMode, groupedHistory]);

  const getHistoryPeriodText = () => {
    if (historyMode === "day") return formatFullDate(historyBaseDate);
    if (historyMode === "week") {
      const start = getWeekStart(historyBaseDate);
      const end = getWeekEnd(historyBaseDate);
      return `${formatShortDate(start)}〜${formatShortDate(end)}`;
    }
    return formatMonthText(historyBaseDate);
  };

  const resetHistoryView = () => {
    setHistoryMode("day");
    setHistoryFilter("all");
    setHistoryBaseDate(workDate ? new Date(workDate) : new Date());
    setExpandedMonthDays({});
  };

  const openHistoryModal = () => {
    setShowOtherSheet(false);
    resetHistoryView();
    setEditingRecord(null);
    setShowHistoryModal(true);
  };

  const moveHistoryPeriod = (diff) => {
    const next = new Date(historyBaseDate);
    if (historyMode === "day") next.setDate(next.getDate() + diff);
    else if (historyMode === "week") next.setDate(next.getDate() + diff * 7);
    else next.setMonth(next.getMonth() + diff);
    setHistoryBaseDate(next);
  };

  const openEditRecord = (record) => {
    setEditingRecord({
      ...record,
      金額入力: String(record.金額 ?? ""),
      乗車時刻入力: formatDateTimeLocal(record.乗車時刻),
      降車時刻入力: formatDateTimeLocal(record.降車時刻),
      乗車地入力: record.乗車地 || "",
      降車地入力: record.降車地 || "",
      区分入力: recordType(record),
      人数入力: record.人数 || "",
      備考入力: record.備考 || "",
    });
  };

  const saveEditedRecord = () => {
    if (!editingRecord) return;
    const numericAmount = Number(String(editingRecord.金額入力 || "").replace(/[^\d]/g, ""));
    if (!numericAmount || numericAmount <= 0) return alert("正しい金額を入力してください");
    if (!editingRecord.乗車時刻入力 || !editingRecord.降車時刻入力) return alert("時刻を入力してください");
    const nextStartAt = new Date(editingRecord.乗車時刻入力);
    const nextEndAt = new Date(editingRecord.降車時刻入力);
    if (Number.isNaN(nextStartAt.getTime()) || Number.isNaN(nextEndAt.getTime())) return alert("時刻の形式が正しくありません");
    if (nextEndAt.getTime() < nextStartAt.getTime()) return alert("降車時刻は乗車時刻より後にしてください");

    const isType1 = editingRecord.区分入力 === "1";
    const updatedRecord = {
      ...editingRecord,
      id: editingRecord.id,
      乗務日: editingRecord.乗務日 || editingRecord.乗車時刻,
      乗車時刻: nextStartAt,
      降車時刻: nextEndAt,
      金額: numericAmount,
      決済方法: isType1 ? "cash" : "cardQr",
      payment: isType1 ? "cash" : "cardQr",
      領収証: false,
      receipt: false,
      乗車地: (editingRecord.乗車地入力 || "").trim() || "未取得",
      降車地: (editingRecord.降車地入力 || "").trim() || "未取得",
      人数: editingRecord.人数入力 === "" ? "" : Number(editingRecord.人数入力 || ""),
      備考: (editingRecord.備考入力 || "").trim(),
    };

    setRecords((prev) => prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)));
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

  const handleDutyStart = () => {
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
    setStandbySheetOffset(0);
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
    setShowFinishDialog(false);
    setEditingRecord(null);
    setShowSaved(false);
    setWorkDate(null);
    setCardMode(3);
    setStandbySheetOffset(0);
    setScreen("top");
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
    setStandbySheetOffset(0);
    setScreen("ride");
    const best = await getBestCurrentPlace();
    setPickup(best.label || "未取得");
    setPickupMeta(best);
  };

  const openNormalDropoff = async () => {
    vibrateTap();
    const end = new Date();
    setRideEndAt(end);
    setAmount("");
    setDropoff("取得中…");
    setDropoffMeta(null);
    setScreen("fare");
    const best = await getBestCurrentPlace();
    setDropoff(best.label || "未取得");
    setDropoffMeta(best);
  };

  const handleDropOffTap = async () => {
    const nowTap = Date.now();
    const diff = nowTap - dropTapRef.current.lastTapAt;
    dropTapRef.current.lastTapAt = nowTap;
    if (diff > 0 && diff < 320) {
      vibrateVia();
      const best = await getBestCurrentPlace();
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

  const confirmPaymentSave = (forcedType = null) => {
    const activeType = forcedType || paymentTypeRef.current || pendingPaymentType;
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
      天気: "",
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
    paymentTypeRef.current = null;
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
    setStandbySheetOffset(0);
    setScreen("standby");

    setShowSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setShowSaved(false), 2200);
  };

  const openPaymentDialog = (type) => {
    if (selectedPassengers === null) return;
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return alert("正しい金額を入力してください");

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

  const renderCardModeContent = () => {
    if (cardMode === 1) return <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end"><div className="text-[12px] font-medium text-slate-500">売上合計</div><div className="mt-1 flex items-end justify-between gap-3"><div className="text-[16px] leading-none font-normal text-slate-600">{formatMoney(totalAmount)}</div><div className="text-[12px] leading-none font-normal text-slate-500">{recordCount}件</div></div></div>;
    if (cardMode === 2) return <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end"><div className="text-[12px] font-medium text-slate-500">売上目標達成率</div><div className="mt-1 text-[16px] leading-none font-normal text-slate-600">-- %</div></div>;
    if (cardMode === 3) return <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end"><div className="text-[12px] font-medium text-slate-500">今日のペース</div><div className="mt-1 text-[16px] leading-none font-normal text-[#00a676]">良好</div></div>;
    if (cardMode === 4) return <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end"><div className="text-[12px] font-medium text-slate-500">① 売上</div><div className="mt-1 text-[16px] leading-none font-normal text-slate-600">{formatMoney(amount1)}</div></div>;
    return <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end"><div className="text-[12px] font-medium text-slate-500">② 売上</div><div className="mt-1 text-[16px] leading-none font-normal text-slate-600">{formatMoney(amount2)}</div></div>;
  };

  return (
    <div className="w-full h-full bg-[linear-gradient(180deg,#eef3f9,#e2e8f0)] flex justify-center overflow-hidden">
      <div className="w-full max-w-sm h-full px-4 pt-4 pb-3 relative overflow-hidden">
        {showSaved && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 shadow-lg">保存しました</div>}
        {toastMessage && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-full bg-slate-800 text-white text-sm font-semibold px-4 py-2 shadow-lg">{toastMessage}</div>}
        {showOtherSheet && <OtherSheet onClose={() => setShowOtherSheet(false)} openHistoryModal={openHistoryModal} />}
        {showPaymentDialog && <PaymentDialog amount={amount} pickupMeta={pickupMeta} dropoffMeta={dropoffMeta} paymentCountdown={paymentCountdown} savingDots={savingDots} onCancel={cancelPaymentDialog} />}
        {showViaDialog && <ViaDialog pendingViaPlace={pendingViaPlace} onCancel={cancelViaDialog} onRecord={recordVia} />}
        {showFinishDialog && <FinishDialog workDate={workDate} recordCount={recordCount} totalAmount={totalAmount} onCancel={() => setShowFinishDialog(false)} onConfirm={performDutyEnd} />}

        {showHistoryModal && (
          <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-end">
            <div className="w-full h-[78svh] rounded-t-[28px] bg-white shadow-2xl flex flex-col overflow-hidden">
              {!editingRecord ? (
                <>
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-800">履歴一覧</div>
                      <button type="button" onClick={() => setShowHistoryModal(false)} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">閉じる</button>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <div className="grid grid-cols-3 gap-2">
                        {['day','week','month'].map((mode, idx) => (
                          <button key={mode} type="button" onClick={() => setHistoryMode(mode)} className={`h-[42px] rounded-2xl text-sm font-bold border ${historyMode === mode ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>{['日','週','月'][idx]}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-[48px_1fr_48px] gap-2 items-center">
                        <button type="button" onClick={() => moveHistoryPeriod(-1)} className="h-[42px] rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-lg font-bold">←</button>
                        <div className="h-[42px] rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center px-3 text-sm font-bold text-slate-800">{getHistoryPeriodText()}</div>
                        <button type="button" onClick={() => moveHistoryPeriod(1)} className="h-[42px] rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-lg font-bold">→</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['all','1','2'].map((mode, idx) => (
                          <button key={mode} type="button" onClick={() => setHistoryFilter(mode)} className={`h-[40px] rounded-2xl text-sm font-bold border ${historyFilter === mode ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-700 border-slate-200'}`}>{['すべて','①','②'][idx]}</button>
                        ))}
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between">
                        <div className="text-sm text-slate-600">件数 {historySummary.count}件</div>
                        <div className="text-base font-bold text-slate-800">{formatMoney(historySummary.total)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    {filteredHistoryRecords.length === 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">該当する履歴はありません</div>
                    ) : historyMode === 'month' ? (
                      <div className="grid gap-3">
                        {groupedHistory.map((group) => {
                          const opened = expandedMonthDays[group.key] === true;
                          return (
                            <div key={group.key} className="grid gap-2">
                              <button type="button" onClick={() => setExpandedMonthDays((prev) => ({ ...prev, [group.key]: !prev[group.key] }))} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left active:bg-slate-50 ${shadowSub}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0"><div className="text-[18px] font-bold text-slate-800">{formatFullDate(group.date)}</div><div className="mt-1 text-xs text-slate-500">{group.count}件</div></div>
                                  <div className="shrink-0 text-right"><div className="text-base font-bold text-slate-800">{formatMoney(group.total)}</div><div className="mt-1 text-xs font-semibold text-slate-500">{opened ? '閉じる' : '開く'}</div></div>
                                </div>
                              </button>
                              {opened && <div className="pl-3 grid gap-2">{group.records.map((record) => <HistoryRecordCard key={record.id} record={record} onClick={openEditRecord} />)}</div>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {groupedHistory.map((group) => (
                          <div key={group.key} className="grid gap-2">
                            <div className="pt-2">
                              <div className="text-[19px] font-bold text-slate-800 tracking-[-0.01em]">{formatFullDate(group.date)}</div>
                              <div className="mt-1 text-xs text-slate-500">{group.count}件 ・ {formatMoney(group.total)}</div>
                            </div>
                            <div className="grid gap-2">{group.records.map((record) => <HistoryRecordCard key={record.id} record={record} onClick={openEditRecord} />)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setEditingRecord(null)} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">戻る</button>
                      <div className="text-lg font-bold text-slate-800">履歴修正</div>
                      <button type="button" onClick={saveEditedRecord} className="px-3 py-2 rounded-xl bg-sky-500 text-white text-sm font-bold">保存</button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    <div className="grid gap-3">
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-xs font-semibold text-slate-500">対象履歴</div><div className="mt-2 text-[18px] font-bold text-slate-800">{formatFullDate(editingRecord.乗務日 || editingRecord.乗車時刻)}</div><div className="mt-1 text-sm text-slate-500">{formatTime(editingRecord.乗車時刻)} → {formatTime(editingRecord.降車時刻)}</div></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">金額</div><div className="mt-2 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">¥</span><input type="text" inputMode="numeric" value={Number(editingRecord.金額入力 || 0).toLocaleString('ja-JP')} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 金額入力: e.target.value.replace(/[^\d]/g, '') }))} className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-4 text-3xl font-bold text-slate-800 outline-none focus:border-sky-300" /></div></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">区分</div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setEditingRecord((prev) => ({ ...prev, 区分入力: '1' }))} className={`h-[52px] rounded-2xl text-lg font-bold border ${editingRecord.区分入力 === '1' ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>①</button><button type="button" onClick={() => setEditingRecord((prev) => ({ ...prev, 区分入力: '2' }))} className={`h-[52px] rounded-2xl text-lg font-bold border ${editingRecord.区分入力 === '2' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>②</button></div><div className="mt-2 text-xs text-slate-500">①＝現金・領収証なし　②＝カード/QR・領収証あり含む</div></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">人数</div><div className="mt-3 grid grid-cols-4 gap-2">{[1,2,3,4].map((count) => <button key={count} type="button" onClick={() => setEditingRecord((prev) => ({ ...prev, 人数入力: count }))} className={`h-[46px] rounded-2xl text-lg font-bold border ${Number(editingRecord.人数入力) === count ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{count}</button>)}</div></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">乗車地</div><input type="text" value={editingRecord.乗車地入力} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 乗車地入力: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300" /></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">降車地</div><input type="text" value={editingRecord.降車地入力} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 降車地入力: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300" /></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">備考</div><input type="text" value={editingRecord.備考入力} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 備考入力: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300" /></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">乗車時刻</div><input type="datetime-local" value={editingRecord.乗車時刻入力} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 乗車時刻入力: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300" /></div>
                      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}><div className="text-sm font-semibold text-slate-600">降車時刻</div><input type="datetime-local" value={editingRecord.降車時刻入力} onChange={(e) => setEditingRecord((prev) => ({ ...prev, 降車時刻入力: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300" /></div>
                      <button type="button" onClick={saveEditedRecord} className={`w-full rounded-2xl h-[56px] text-xl font-bold bg-sky-500 text-white ${shadowSub}`}>保存する</button>
                      <button type="button" onClick={deleteEditedRecord} className={`w-full rounded-2xl h-[52px] text-base font-bold bg-red-50 text-red-600 border border-red-200 ${shadowSub}`}>この履歴を削除</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="h-full flex flex-col overflow-hidden">
          {(screen === 'top' || screen === 'standby' || screen === 'ride' || screen === 'fare') && (
            <>
              <div className={`${cardClass} h-[172px] px-4 py-4 shrink-0 overflow-hidden`} onClick={handleCardModeNext}>
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4 shrink-0">
                    <div className="min-w-0"><div className="text-[15px] leading-none font-semibold text-slate-700 pt-1">{stateLabel}</div></div>
                    <div className="shrink-0 text-right"><div className="flex items-center justify-end text-[58px] leading-[0.9] font-black tracking-[-0.05em] text-slate-800"><span>{timeParts.hh}</span><span className={`${timeParts.showColon ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150 mx-[-0.08em]`}>：</span><span>{timeParts.mm}</span></div></div>
                  </div>
                  {renderCardModeContent()}
                </div>
              </div>
              {screen === 'ride' && <div className="pt-4 shrink-0" style={{ height: `${MAIN_BUTTON_SLOT_HEIGHT}px` }}><button type="button" onClick={handleDropOffTap} className={`${mainButtonBase} ${mainButtonShine} bg-[linear-gradient(180deg,#ffe066,#ffb400,#cc7a00)]`}><span className={bigButtonText}>降車</span></button></div>}
            </>
          )}

          {screen === 'top' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="pt-4 shrink-0" style={{ height: `${MAIN_BUTTON_SLOT_HEIGHT}px` }}><button type="button" onClick={() => (!dutyStarted ? handleDutyStart() : setShowFinishDialog(true))} disabled={topMainButtonDisabled} className={`${mainButtonBase} ${mainButtonShine} ${topMainButtonDisabled ? 'bg-[linear-gradient(180deg,#d5dbe3,#bcc6d2,#97a3b2)] text-white' : dutyStarted ? 'bg-[linear-gradient(180deg,#ffdf6b,#ffb100,#cc7900)] text-white' : 'bg-[linear-gradient(180deg,#5dffcf,#21c79a,#008a6a)] text-white'}`}><span className={bigButtonText}>{topMainLabel}</span></button></div>
              <div className="pt-4 shrink-0"><div className="rounded-[28px] opacity-0 pointer-events-none" style={{ height: `${SHARED_INFO_SLOT_HEIGHT}px` }} /></div>
              <div ref={topScrollRef} className="flex-1 min-h-0 overflow-y-auto"><BottomCard previewRecords={previewRecords} openOtherSheet={() => setShowOtherSheet(true)} openHistoryModal={openHistoryModal} /></div>
            </div>
          )}

          {screen === 'standby' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="pt-4 shrink-0" style={{ height: `${MAIN_BUTTON_SLOT_HEIGHT}px` }}><button type="button" onClick={handleStartRide} className={`${mainButtonBase} ${mainButtonShine} bg-[linear-gradient(180deg,#5ecbff,#2fa8ff,#0072d9)]`}><span className={bigButtonText}>実車</span></button></div>
              <div className="pt-4 shrink-0"><div className="rounded-[28px] opacity-0 pointer-events-none" style={{ height: `${SHARED_INFO_SLOT_HEIGHT}px` }} /></div>
              <div className="flex-1 min-h-0 relative overflow-hidden">
                <div className="absolute inset-x-0 z-10 px-1" style={{ top: `${STANDBY_FINISH_TOP}px` }}><button type="button" onClick={() => isFinishVisible && setShowFinishDialog(true)} disabled={!isFinishVisible} className={`${endDutyButtonClass} ${isFinishVisible ? '' : 'opacity-40'}`}>乗務終了</button></div>
                <div className="absolute inset-x-0 top-0 z-20"><BottomCard movable showHandle standbySheetOffset={standbySheetOffset} dragging={sheetDragRef.current.dragging} isFinishVisible={isFinishVisible} beginDrag={beginStandbySheetDrag} openOtherSheet={() => setShowOtherSheet(true)} openHistoryModal={openHistoryModal} previewRecords={previewRecords} /></div>
              </div>
            </div>
          )}

          {screen === 'ride' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="pt-4 shrink-0"><div className={`${cardClass} px-4 py-4`} style={{ minHeight: `${SHARED_INFO_SLOT_HEIGHT}px` }}><div className="text-[14px] font-semibold text-slate-500">乗車地</div><div className="mt-1 text-[18px] font-bold text-slate-800">{pickup || '未取得'}</div><div className="mt-1 text-[11px] text-slate-400">精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : '--'}</div><div className="mt-3 grid grid-cols-3 gap-3"><div><div className="text-[13px] font-semibold text-slate-500">乗車時刻</div><div className="mt-1 text-[17px] font-bold text-slate-800">{formatTime(rideStartAt)}</div></div><div><div className="text-[13px] font-semibold text-slate-500">人数</div><div className="mt-1 text-[17px] font-bold text-slate-800">{selectedPassengers ? `${selectedPassengers}人` : ''}</div></div><div className="text-right"><div className="text-[13px] font-semibold text-slate-500">経過時間</div><div className="mt-1 text-[17px] font-bold text-slate-800">{elapsedText}</div></div></div>{viaStops.length > 0 && <div className="mt-3 text-xs font-semibold text-slate-500">経由あり（{viaStops.length}件）</div>}</div></div>
              <div className="pt-4 flex-1 min-h-0 overflow-y-auto"><BottomCard previewRecords={previewRecords} openOtherSheet={() => setShowOtherSheet(true)} openHistoryModal={openHistoryModal} /></div>
            </div>
          )}

          {screen === 'fare' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-4">
              <div className={`${cardClass} h-[122px] px-4 py-4 shrink-0`}><div className="flex items-start justify-center gap-4"><div className="flex-1 min-w-0 text-left"><div className="text-[24px] font-bold text-slate-800 leading-none">{formatTime(rideStartAt)}</div><div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">{pickup || '未取得'}</div><div className="mt-1 text-[11px] text-slate-400">精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : '--'}</div></div><div className="pt-1 text-[20px] font-bold text-slate-400 shrink-0">→</div><div className="flex-1 min-w-0 text-right"><div className="text-[24px] font-bold text-slate-800 leading-none">{formatTime(rideEndAt)}</div><div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">{dropoff || '未取得'}</div><div className="mt-1 text-[11px] text-slate-400">精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : '--'}</div></div></div></div>
              <div className="pt-4 shrink-0"><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">¥</span><input ref={amountInputRef} type="text" inputMode="numeric" value={formattedAmount} onChange={handleAmountChange} placeholder="0" className={`w-full rounded-[24px] border border-white/60 bg-white pl-12 pr-4 py-4 text-4xl font-bold text-slate-800 outline-none shadow-[0_8px_16px_rgba(0,0,0,0.10)] focus:border-sky-300`} /></div></div>
              <div className="pt-4 flex-1 min-h-0 overflow-y-auto"><div className="grid gap-3 pb-2"><div className="grid grid-cols-6 gap-2">{Array.from({ length: 6 }).map((_, index) => { const count = index + 1; const enabled = count <= 4; const isSelected = selectedPassengers === count; const bg = enabled ? (selectedPassengers === null ? PASSENGER_ACTIVE : isSelected ? PASSENGER_ACTIVE : PASSENGER_INACTIVE) : 'transparent'; const textColor = enabled ? 'text-slate-800' : 'text-transparent'; return <button key={count} type="button" onClick={() => enabled && handlePassengerSelect(count)} className={`h-[46px] rounded-2xl border font-bold text-lg ${textColor}`} style={{ background: bg, borderColor: enabled ? '#c9ced6' : 'transparent' }}>{enabled ? count : ''}</button>; })}</div><button type="button" disabled={selectedPassengers === null} onClick={() => openPaymentDialog('cash')} className={`${smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`} style={{ background: selectedPassengers === null ? PAYMENT_DISABLED : PAYMENT_CASH }}><span className="relative z-10">現金</span></button><button type="button" disabled={selectedPassengers === null} onClick={() => openPaymentDialog('cardQr')} className={`${smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`} style={{ background: selectedPassengers === null ? PAYMENT_DISABLED : PAYMENT_CARD }}><span className="relative z-10">カード・QR</span></button><button type="button" disabled={selectedPassengers === null} onClick={() => openPaymentDialog('receipt')} className={`${smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`} style={{ background: selectedPassengers === null ? PAYMENT_DISABLED : PAYMENT_RECEIPT }}><span className="relative z-10">領収証発行</span></button></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaxiMiniApp />);

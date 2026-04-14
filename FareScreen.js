window.AppScreens = window.AppScreens || {};
window.AppScreens.FareScreen = (() => {
  const C = window.AppConstants;
  const { formatTime } = window.AppUtils;

  return function FareScreen(props) {
    const {
      rideStartAt,
      pickup,
      pickupMeta,
      rideEndAt,
      dropoff,
      dropoffMeta,
      amountInputRef,
      formattedAmount,
      handleAmountChange,
      selectedPassengers,
      handlePassengerSelect,
      openPaymentDialog,
      maxPassengers = 4,
    } = props;

    const hasPassengerSelected = selectedPassengers !== null;
    const safeMaxPassengers = Math.max(4, Math.min(6, Number(maxPassengers) || 4));
    const passengerSlots = [1, 2, 3, 4, 5, 6];

    const onSelectPassenger = (count) => {
      handlePassengerSelect(count);
      try {
        amountInputRef?.current?.blur?.();
      } catch (_) {}
    };

    const getPassengerStyle = (count, enabled) => {
      if (!enabled) {
        return {
          visibility: "hidden",
          pointerEvents: "none",
        };
      }

      const isSelected = selectedPassengers === count;
      const isOtherAfterSelected = hasPassengerSelected && !isSelected;

      if (isSelected) {
        return {
          background: "#808C88",
          color: "#FFFFFF",
          border: "none",
          boxShadow: "none",
        };
      }

      if (isOtherAfterSelected) {
        return {
          background: "#EBE9EA",
          color: "#8D8A8C",
          border: "none",
          boxShadow: "none",
        };
      }

      return {
        background:
          "linear-gradient(135deg, #808C88 0%, #808C88 45%, #897E86 100%)",
        color: "#FFFFFF",
        border: "none",
        boxShadow: "none",
      };
    };

    return (
      <div className="absolute inset-0 bg-[#dfe5ee] overflow-hidden">
        <div className="relative h-full px-[20px] pt-[20px] pb-[26px] overflow-y-auto hide-scrollbar">
          <div
            className="bg-white px-5 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
            style={{ borderRadius: "8px" }}
          >
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
              <div>
                <div className="text-[16px] font-bold text-slate-800 leading-none">
                  {formatTime(rideStartAt)}
                </div>
                <div className="mt-2 text-[14px] font-bold text-slate-700 truncate">
                  {pickup || "未取得"}
                </div>
                <div className="mt-1 text-[12px] font-semibold text-slate-400">
                  精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
                </div>
              </div>

              <div className="pt-[6px] text-[22px] text-slate-300">→</div>

              <div className="text-right">
                <div className="text-[16px] font-bold text-slate-800 leading-none">
                  {formatTime(rideEndAt)}
                </div>
                <div className="mt-2 text-[14px] font-bold text-slate-700 truncate">
                  {dropoff || "未取得"}
                </div>
                <div className="mt-1 text-[12px] font-semibold text-slate-400">
                  精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div
              className="bg-white px-5 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
              style={{ borderRadius: "8px" }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[22px] font-bold text-slate-800">
                    ¥
                  </span>
                  <input
                    ref={amountInputRef}
                    type="text"
                    inputMode="numeric"
                    value={formattedAmount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full bg-transparent pl-[26px] pr-0 text-[34px] leading-none font-bold tracking-[-0.04em] text-slate-800 outline-none"
                  />
                </div>

                <div className="text-right min-w-[82px]">
                  <div className="text-[12px] font-semibold text-slate-400">
                    乗車人員
                  </div>
                  <div className="mt-1 flex items-end gap-1 justify-end">
                    <span className="text-[12px] font-semibold text-slate-400">
                      {hasPassengerSelected ? selectedPassengers : ""}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-400">
                      {hasPassengerSelected ? "名" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex gap-4">
              {passengerSlots.map((count) => {
                const enabled = count <= safeMaxPassengers;

                return (
                  <button
                    key={count}
                    type="button"
                    disabled={!enabled}
                    onClick={() => enabled && onSelectPassenger(count)}
                    className="w-[62px] h-[62px] rounded-full flex items-center justify-center active:scale-[0.97] transition-transform duration-75"
                    style={getPassengerStyle(count, enabled)}
                    aria-hidden={!enabled}
                  >
                    {enabled ? (
                      <span
                        className="select-none"
                        style={{
                          fontFamily: '"Arial Black", "Arial", system-ui, sans-serif',
                          fontSize: "43px",
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: "0",
                          display: "block",
                        }}
                      >
                        {count}
                      </span>
                    ) : (
                      ""
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <button
              type="button"
              onClick={() => hasPassengerSelected && openPaymentDialog("cash")}
              disabled={!hasPassengerSelected}
              className="w-full h-[72px] rounded-[24px] text-[22px] font-bold shadow-[0_8px_16px_rgba(0,0,0,0.14)]"
              style={{
                background: hasPassengerSelected ? C.PAYMENT_CASH : C.PAYMENT_DISABLED,
                color: "#111827",
              }}
            >
              現金
            </button>

            <button
              type="button"
              onClick={() => hasPassengerSelected && openPaymentDialog("cardQr")}
              disabled={!hasPassengerSelected}
              className="w-full h-[72px] rounded-[24px] text-[22px] font-bold shadow-[0_8px_16px_rgba(0,0,0,0.14)]"
              style={{
                background: hasPassengerSelected ? C.PAYMENT_CARD : C.PAYMENT_DISABLED,
                color: "#111827",
              }}
            >
              カード・QR
            </button>

            <button
              type="button"
              onClick={() => hasPassengerSelected && openPaymentDialog("receipt")}
              disabled={!hasPassengerSelected}
              className="w-full h-[72px] rounded-[24px] text-[22px] font-bold shadow-[0_8px_16px_rgba(0,0,0,0.14)]"
              style={{
                background: hasPassengerSelected ? C.PAYMENT_RECEIPT : C.PAYMENT_DISABLED,
                color: "#111827",
              }}
            >
              領収証発行
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

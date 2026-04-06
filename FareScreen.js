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

    const getPassengerButtonStyle = (count, enabled) => {
      if (!enabled) {
        return {
          visibility: "hidden",
        };
      }

      const isSelected = selectedPassengers === count;
      const isOtherAfterSelected = hasPassengerSelected && !isSelected;

      if (isSelected) {
        return {
          background: "linear-gradient(135deg, #F3F06A 0%, #D9DC3C 100%)",
          color: "#3b3b3b",
          border: "none",
          boxShadow: "none",
        };
      }

      if (isOtherAfterSelected) {
        return {
          background: "#EBE9EA",
          color: "#8d8a8c",
          border: "none",
          boxShadow: "none",
        };
      }

      return {
        background: "linear-gradient(135deg, #808C88 0%, #897E86 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "none",
      };
    };

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-4">
        <div className={`${C.cardClass} h-[122px] px-4 py-4 shrink-0`}>
          <div className="flex items-start justify-center gap-4">
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[24px] font-bold text-slate-800 leading-none">
                {formatTime(rideStartAt)}
              </div>
              <div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">
                {pickup || "未取得"}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
              </div>
            </div>

            <div className="pt-1 text-[20px] font-bold text-slate-400 shrink-0">→</div>

            <div className="flex-1 min-w-0 text-right">
              <div className="text-[24px] font-bold text-slate-800 leading-none">
                {formatTime(rideEndAt)}
              </div>
              <div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">
                {dropoff || "未取得"}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 shrink-0">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[26px] font-bold text-slate-400">
              ¥
            </span>

            <input
              ref={amountInputRef}
              type="text"
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full rounded-[22px] border border-white/60 bg-white pl-10 pr-[110px] h-[72px] text-[40px] font-bold text-slate-800 outline-none shadow-[0_8px_16px_rgba(0,0,0,0.10)] focus:border-sky-300"
            />

            {hasPassengerSelected && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-1 text-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 pb-[4px]">
                  乗車人員
                </span>
                <span className="text-[26px] font-black leading-none">
                  {selectedPassengers}
                </span>
                <span className="text-[13px] font-bold pb-[3px]">名</span>
              </div>
            )}
          </div>
        </div>

        {!hasPassengerSelected && (
          <div className="pt-4 shrink-0">
            <div className="rounded-[30px] bg-[#F3F4F6] px-[14px] py-[12px]">
              <div className="grid grid-cols-6 gap-3">
                {passengerSlots.map((count) => {
                  const enabled = count <= safeMaxPassengers;

                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={!enabled}
                      onClick={() => enabled && onSelectPassenger(count)}
                      className="h-[62px] w-[62px] rounded-full flex items-center justify-center text-[26px] font-black leading-none active:scale-[0.985] transition-transform duration-75"
                      style={getPassengerButtonStyle(count, enabled)}
                      aria-hidden={!enabled}
                    >
                      {enabled ? count : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {hasPassengerSelected && (
          <div className="pt-4 shrink-0">
            <div className="rounded-[30px] bg-[#F3F4F6] px-[14px] py-[12px]">
              <div className="grid grid-cols-6 gap-3">
                {passengerSlots.map((count) => {
                  const enabled = count <= safeMaxPassengers;
                  const isSelected = selectedPassengers === count;

                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={!enabled}
                      onClick={() => enabled && onSelectPassenger(count)}
                      className="h-[62px] w-[62px] rounded-full flex items-center justify-center text-[26px] font-black leading-none active:scale-[0.985] transition-transform duration-75"
                      style={getPassengerButtonStyle(count, enabled)}
                      aria-hidden={!enabled}
                    >
                      {enabled ? count : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {hasPassengerSelected && (
          <div className="pt-4 flex-1 min-h-0">
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => openPaymentDialog("cash")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold text-slate-900`}
                style={{ background: C.PAYMENT_CASH }}
              >
                現金
              </button>

              <button
                type="button"
                onClick={() => openPaymentDialog("cardQr")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold text-slate-900`}
                style={{ background: C.PAYMENT_CARD }}
              >
                カード・QR
              </button>

              <button
                type="button"
                onClick={() => openPaymentDialog("receipt")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold text-slate-900`}
                style={{ background: C.PAYMENT_RECEIPT }}
              >
                領収証発行
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
})();

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
      if (!enabled) return { visibility: "hidden" };

      const isSelected = selectedPassengers === count;
      const isOther = hasPassengerSelected && !isSelected;

      if (isSelected) {
        return {
          background: "linear-gradient(135deg, #F3F06A 0%, #D9DC3C 100%)",
          color: "#2f2f2f",
        };
      }

      if (isOther) {
        return {
          background: "#EBE9EA",
          color: "#9a9799",
        };
      }

      return {
        background: "linear-gradient(135deg, #808C88 0%, #897E86 100%)",
        color: "#ffffff",
      };
    };

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-4">
        {/* 上部カード */}
        <div className={`${C.cardClass} h-[122px] px-4 py-4 shrink-0`}>
          <div className="flex items-start justify-center gap-4">
            <div className="flex-1 text-left">
              <div className="text-[24px] font-bold">{formatTime(rideStartAt)}</div>
              <div className="mt-3 text-[15px] font-semibold truncate">
                {pickup || "未取得"}
              </div>
            </div>

            <div className="pt-1 text-[20px] font-bold text-slate-400">→</div>

            <div className="flex-1 text-right">
              <div className="text-[24px] font-bold">{formatTime(rideEndAt)}</div>
              <div className="mt-3 text-[15px] font-semibold truncate">
                {dropoff || "未取得"}
              </div>
            </div>
          </div>
        </div>

        {/* 金額 */}
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
              className="w-full rounded-[22px] border border-white/60 bg-white pl-10 pr-[110px] h-[72px] text-[40px] font-bold outline-none shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
            />
          </div>
        </div>

        {/* 人数ボタン */}
        <div className="pt-4 shrink-0">
          <div className="rounded-[28px] bg-[#F3F4F6] px-[14px] py-[12px]">
            <div className="grid grid-cols-6 gap-3">
              {passengerSlots.map((count) => {
                const enabled = count <= safeMaxPassengers;

                return (
                  <button
                    key={count}
                    type="button"
                    disabled={!enabled}
                    onClick={() => enabled && onSelectPassenger(count)}
                    style={getPassengerStyle(count, enabled)}
                    className="
                      h-[62px] w-[62px]
                      rounded-full
                      flex items-center justify-center
                      transition-all duration-75
                      active:scale-[0.96]
                    "
                  >
                    <span
                      className="
                        text-[28px]
                        font-extrabold
                        tracking-[-0.03em]
                        leading-none
                        select-none
                      "
                    >
                      {enabled ? count : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 決済 */}
        {hasPassengerSelected && (
          <div className="pt-4 flex-1 min-h-0">
            <div className="grid gap-3">
              <button
                onClick={() => openPaymentDialog("cash")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold`}
                style={{ background: C.PAYMENT_CASH }}
              >
                現金
              </button>

              <button
                onClick={() => openPaymentDialog("cardQr")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold`}
                style={{ background: C.PAYMENT_CARD }}
              >
                カード・QR
              </button>

              <button
                onClick={() => openPaymentDialog("receipt")}
                className={`${C.smallButtonBase} h-[70px] text-[24px] font-extrabold`}
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

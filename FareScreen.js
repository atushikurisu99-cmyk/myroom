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
      passengerDisplayCount,
      selectedPassengers,
      handlePassengerSelect,
      openPaymentDialog,
    } = props;

    const hasPassengerSelected = selectedPassengers !== null;
    const paymentButtonHeight = hasPassengerSelected ? "h-[68px]" : "h-[54px]";
    const paymentButtonText = hasPassengerSelected
      ? "text-[24px] font-extrabold"
      : "text-xl font-extrabold";

    const onSelectPassenger = (count) => {
      handlePassengerSelect(count);
      try {
        amountInputRef?.current?.blur?.();
      } catch (_) {}
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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[34px] font-bold text-slate-400">
              ¥
            </span>

            <input
              ref={amountInputRef}
              type="text"
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full rounded-[24px] border border-[#7fcbff] bg-white pl-12 pr-[126px] h-[92px] text-[54px] leading-none font-bold text-slate-800 outline-none shadow-[0_8px_16px_rgba(0,0,0,0.10)] focus:border-sky-300"
            />

            {hasPassengerSelected && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-1.5 text-slate-800">
                <span className="text-[13px] leading-none font-semibold text-slate-500 pb-[6px]">
                  乗車人員
                </span>
                <span className="text-[34px] leading-none font-black tracking-[-0.04em]">
                  {selectedPassengers}
                </span>
                <span className="text-[18px] leading-none font-bold pb-[5px]">
                  名
                </span>
              </div>
            )}
          </div>
        </div>

        {!hasPassengerSelected && (
          <div className="pt-4 shrink-0">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: Math.min(passengerDisplayCount, 4) }).map((_, index) => {
                const count = index + 1;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onSelectPassenger(count)}
                    className="h-[62px] rounded-[20px] border font-extrabold text-[22px] text-slate-800 shadow-[0_6px_12px_rgba(0,0,0,0.10)] active:scale-[0.985]"
                    style={{
                      background: C.PASSENGER_ACTIVE,
                      borderColor: "#c9ced6",
                    }}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 flex-1 min-h-0">
          <div className="grid gap-3">
            <button
              type="button"
              disabled={!hasPassengerSelected}
              onClick={() => openPaymentDialog("cash")}
              className={`${C.smallButtonBase} ${paymentButtonHeight} ${paymentButtonText} text-slate-900 disabled:opacity-100`}
              style={{
                background: hasPassengerSelected ? C.PAYMENT_CASH : C.PAYMENT_DISABLED,
              }}
            >
              <span className="relative z-10">現金</span>
            </button>

            <button
              type="button"
              disabled={!hasPassengerSelected}
              onClick={() => openPaymentDialog("cardQr")}
              className={`${C.smallButtonBase} ${paymentButtonHeight} ${paymentButtonText} text-slate-900 disabled:opacity-100`}
              style={{
                background: hasPassengerSelected ? C.PAYMENT_CARD : C.PAYMENT_DISABLED,
              }}
            >
              <span className="relative z-10">カード・QR</span>
            </button>

            <button
              type="button"
              disabled={!hasPassengerSelected}
              onClick={() => openPaymentDialog("receipt")}
              className={`${C.smallButtonBase} ${paymentButtonHeight} ${paymentButtonText} text-slate-900 disabled:opacity-100`}
              style={{
                background: hasPassengerSelected ? C.PAYMENT_RECEIPT : C.PAYMENT_DISABLED,
              }}
            >
              <span className="relative z-10">領収証発行</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

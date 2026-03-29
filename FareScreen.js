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
                <span className="text-[13px] font-bold pb-[3px]">
                  名
                </span>
              </div>
            )}
          </div>
        </div>

        {!hasPassengerSelected && (
          <div className="pt-4 shrink-0">
            <div className="grid grid-cols-6 gap-3">
              {passengerSlots.map((count) => {
                const enabled = count <= safeMaxPassengers;
                return (
                  <button
                    key={count}
                    type="button"
                    disabled={!enabled}
                    onClick={() => enabled && onSelectPassenger(count)}
                    className={
                      enabled
                        ? "h-[72px] rounded-[20px] border font-extrabold text-[24px] text-slate-800 shadow-[0_6px_12px_rgba(0,0,0,0.10)] active:scale-[0.985]"
                        : "h-[72px] rounded-[20px] pointer-events-none opacity-0"
                    }
                    style={
                      enabled
                        ? {
                            background: C.PASSENGER_ACTIVE,
                            borderColor: "#c9ced6",
                          }
                        : undefined
                    }
                    aria-hidden={!enabled}
                  >
                    {enabled ? count : ""}
                  </button>
                );
              })}
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

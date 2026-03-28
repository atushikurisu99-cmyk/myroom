
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

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-4">
        <div className={`${C.cardClass} h-[122px] px-4 py-4 shrink-0`}>
          <div className="flex items-start justify-center gap-4">
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[24px] font-bold text-slate-800 leading-none">{formatTime(rideStartAt)}</div>
              <div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">{pickup || '未取得'}</div>
              <div className="mt-1 text-[11px] text-slate-400">精度：{pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : '--'}</div>
            </div>
            <div className="pt-1 text-[20px] font-bold text-slate-400 shrink-0">→</div>
            <div className="flex-1 min-w-0 text-right">
              <div className="text-[24px] font-bold text-slate-800 leading-none">{formatTime(rideEndAt)}</div>
              <div className="mt-3 text-[15px] font-semibold text-slate-600 truncate">{dropoff || '未取得'}</div>
              <div className="mt-1 text-[11px] text-slate-400">精度：{dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : '--'}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 shrink-0">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">¥</span>
            <input
              ref={amountInputRef}
              type="text"
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full rounded-[24px] border border-white/60 bg-white pl-12 pr-4 py-4 text-4xl font-bold text-slate-800 outline-none shadow-[0_8px_16px_rgba(0,0,0,0.10)] focus:border-sky-300"
            />
          </div>
        </div>

        <div className="pt-4 flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-3 pb-2">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: passengerDisplayCount }).map((_, index) => {
                const count = index + 1;
                const enabled = count <= 4;
                const isSelected = selectedPassengers === count;
                const bg = enabled
                  ? selectedPassengers === null
                    ? C.PASSENGER_ACTIVE
                    : isSelected
                    ? C.PASSENGER_ACTIVE
                    : C.PASSENGER_INACTIVE
                  : 'transparent';
                const textColor = enabled ? 'text-slate-800' : 'text-transparent';

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => enabled && handlePassengerSelect(count)}
                    className={`h-[46px] rounded-2xl border font-bold text-lg ${textColor}`}
                    style={{ background: bg, borderColor: enabled ? '#c9ced6' : 'transparent' }}
                  >
                    {enabled ? count : ''}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={selectedPassengers === null}
              onClick={() => openPaymentDialog('cash')}
              className={`${C.smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`}
              style={{ background: selectedPassengers === null ? C.PAYMENT_DISABLED : C.PAYMENT_CASH }}
            >
              <span className="relative z-10">現金</span>
            </button>

            <button
              type="button"
              disabled={selectedPassengers === null}
              onClick={() => openPaymentDialog('cardQr')}
              className={`${C.smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`}
              style={{ background: selectedPassengers === null ? C.PAYMENT_DISABLED : C.PAYMENT_CARD }}
            >
              <span className="relative z-10">カード・QR</span>
            </button>

            <button
              type="button"
              disabled={selectedPassengers === null}
              onClick={() => openPaymentDialog('receipt')}
              className={`${C.smallButtonBase} text-slate-900 text-xl font-extrabold disabled:opacity-100`}
              style={{ background: selectedPassengers === null ? C.PAYMENT_DISABLED : C.PAYMENT_RECEIPT }}
            >
              <span className="relative z-10">領収証発行</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

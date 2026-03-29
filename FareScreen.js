const MAX = 6;
const seats = Array.from({ length: MAX }, (_, i) => i + 1);

<div className="grid grid-cols-6 gap-3">
  {seats.map((n) => {
    const enabled = n <= maxPassengers; // 4 / 5 / 6（設定値）
    const selected = passengerCount === n;

    return (
      <button
        key={n}
        type="button"
        disabled={!enabled}
        onClick={() => enabled && onSelectPassenger(n)}
        className={
          enabled
            ? `${C.smallButtonBase} ${
                selected
                  ? "bg-[#e3e548] text-slate-900"
                  : "bg-[#cfd6df] text-slate-800"
              }`
            : "pointer-events-none opacity-0"
        }
        aria-hidden={!enabled}
      >
        {enabled ? <span className="text-[22px] font-bold">{n}</span> : null}
      </button>
    );
  })}
</div>

window.AppScreens = window.AppScreens || {};
window.AppScreens.FinishCheckScreen = (() => {
  const { formatMoney } = window.AppUtils;
  const C = window.AppConstants;

  function CellLabel({ children }) {
    return (
      <div className="text-[11px] font-semibold tracking-[0.02em] text-slate-400">
        {children}
      </div>
    );
  }

  function ReadCell({ label, value, valueClassName = "" }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
        <CellLabel>{label}</CellLabel>
        <div className={`mt-1 text-[18px] leading-tight text-slate-800 ${valueClassName}`}>
          {value}
        </div>
      </div>
    );
  }

  function LinkCell({ label, value, onClick, accent = "sky" }) {
    const activeClass =
      accent === "emerald"
        ? "border-emerald-200 bg-emerald-50 active:bg-emerald-100"
        : "border-sky-200 bg-sky-50 active:bg-sky-100";

    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-2xl border px-3 py-3 text-left ${activeClass}`}
      >
        <CellLabel>{label}</CellLabel>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="text-[18px] leading-tight text-slate-800">{value}</div>
          <div className="text-[11px] font-bold text-slate-400">修正</div>
        </div>
      </button>
    );
  }

  function InputCell({
    label,
    value,
    onChange,
    placeholder = "",
    inputMode = "numeric",
    multiline = false,
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
        <CellLabel>{label}</CellLabel>

        {multiline ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-300"
          />
        ) : (
          <input
            type="text"
            inputMode={inputMode}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[18px] text-slate-800 outline-none focus:border-slate-300"
          />
        )}
      </div>
    );
  }

  function BusinessKmCell({ km }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
        <CellLabel>営走</CellLabel>
        <div className="mt-1 flex items-end gap-1 leading-none">
          <span className="text-[14px] font-semibold text-slate-400">＝営走：</span>
          <span className="text-[20px] font-bold text-slate-800">{km}km</span>
        </div>
      </div>
    );
  }

  return function FinishCheckScreen(props) {
    const {
      finishSummary,
      finishForm,
      setFinishFormField,
      openHistoryModalWithFilter,
      onBack,
      onConfirm,
    } = props;

    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-4">
        <div className={`${C.cardClass} flex-1 min-h-0 overflow-hidden flex flex-col px-4 py-4`}>
          <div className="shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-[44px] min-w-[84px] rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold active:bg-slate-200"
            >
              戻る
            </button>

            <div className="min-w-0 text-center">
              <div className="text-[18px] font-bold tracking-[-0.02em] text-slate-800">
                終了前チェック
              </div>
            </div>

            <button
              type="button"
              onClick={onConfirm}
              className="h-[44px] min-w-[96px] rounded-2xl bg-slate-800 text-white text-sm font-bold active:opacity-90"
            >
              確定
            </button>
          </div>

          <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-[2px]">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <LinkCell
                  label="①"
                  value={formatMoney(finishSummary.amount1)}
                  onClick={() => openHistoryModalWithFilter("1")}
                  accent="sky"
                />

                <LinkCell
                  label="②"
                  value={formatMoney(finishSummary.amount2)}
                  onClick={() => openHistoryModalWithFilter("2")}
                  accent="emerald"
                />

                <InputCell
                  label="燃料"
                  value={finishForm.fuel}
                  onChange={(e) =>
                    setFinishFormField("fuel", e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="0"
                />

                <InputCell
                  label="雑収入"
                  value={finishForm.otherIncome}
                  onChange={(e) =>
                    setFinishFormField("otherIncome", e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="0"
                />

                <InputCell
                  label="備考"
                  value={finishForm.note}
                  onChange={(e) => setFinishFormField("note", e.target.value)}
                  placeholder=""
                  inputMode="text"
                  multiline={true}
                />
              </div>

              <div className="grid gap-3">
                <ReadCell
                  label="売上合計"
                  value={formatMoney(finishSummary.totalAmount)}
                  valueClassName="font-bold"
                />

                <ReadCell
                  label="件数"
                  value={`${finishSummary.recordCount}件`}
                  valueClassName="font-bold"
                />

                <ReadCell
                  label="人数"
                  value={`${finishSummary.passengerCount}名`}
                  valueClassName="font-bold"
                />

                <BusinessKmCell km={finishSummary.businessKm} />

                <InputCell
                  label="全走行"
                  value={finishForm.totalDistance}
                  onChange={(e) =>
                    setFinishFormField("totalDistance", e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold text-slate-400">確認用</div>
              <div className="mt-2 grid gap-1 text-[13px] text-slate-600">
                <div>①：{formatMoney(finishSummary.amount1)}</div>
                <div>②：{formatMoney(finishSummary.amount2)}</div>
                <div>営走：{finishSummary.businessKm}km</div>
                <div>全走行：{finishForm.totalDistance ? `${finishForm.totalDistance}km` : "--"}</div>
                <div>燃料：{finishForm.fuel ? formatMoney(Number(finishForm.fuel)) : "¥0"}</div>
                <div>雑収入：{finishForm.otherIncome ? formatMoney(Number(finishForm.otherIncome)) : "¥0"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
})();

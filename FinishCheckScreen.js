window.AppScreens = window.AppScreens || {};
window.AppScreens.FinishCheckScreen = (() => {
  const { formatMoney } = window.AppUtils;
  const C = window.AppConstants;

  function RowShell({ children, className = "" }) {
    return (
      <div className={`border border-slate-200 bg-white ${className}`}>
        {children}
      </div>
    );
  }

  function LabelText({ children, subtle = false }) {
    return (
      <div
        className={`text-[14px] font-semibold leading-none ${
          subtle ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {children}
      </div>
    );
  }

  function ValueText({ children, className = "" }) {
    return (
      <div className={`text-[20px] font-bold leading-none text-slate-800 ${className}`}>
        {children}
      </div>
    );
  }

  function EditRow({ label, value, onClick, accent = "sky" }) {
    const accentClass =
      accent === "emerald"
        ? "active:bg-emerald-50"
        : "active:bg-sky-50";

    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${accentClass}`}
      >
        <RowShell className="px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <LabelText>{label}</LabelText>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <ValueText>{value}</ValueText>
              <div className="text-[12px] font-bold text-slate-400">修正</div>
            </div>
          </div>
        </RowShell>
      </button>
    );
  }

  function InputRow({
    label,
    value,
    onChange,
    placeholder = "",
    suffix = "",
    multiline = false,
  }) {
    return (
      <RowShell className="px-4 py-3">
        {!multiline ? (
          <div className="grid grid-cols-[96px_1fr_auto] items-center gap-3">
            <div>
              <LabelText>{label}</LabelText>
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-[18px] font-bold text-slate-800 outline-none focus:border-slate-500"
            />

            <div className="min-w-[28px] text-right text-[16px] font-semibold text-slate-500">
              {suffix}
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div>
              <LabelText>{label}</LabelText>
            </div>

            <textarea
              value={value}
              onChange={onChange}
              rows={4}
              placeholder={placeholder}
              className="w-full resize-none border border-slate-300 bg-white px-3 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-500"
            />
          </div>
        )}
      </RowShell>
    );
  }

  function SummaryLine({ label, value, suffix = "" }) {
    return (
      <div className="grid grid-cols-[96px_1fr_auto] items-center gap-3 px-4 py-3 border-t border-slate-200 first:border-t-0">
        <div>
          <LabelText>{label}</LabelText>
        </div>

        <div className="text-right">
          <ValueText className="text-[18px]">{value}</ValueText>
        </div>

        <div className="min-w-[28px] text-right text-[15px] font-semibold text-slate-500">
          {suffix}
        </div>
      </div>
    );
  }

  function SalesAndBusinessRow({ totalAmount, businessKm }) {
    return (
      <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 px-4 py-3 border-t border-slate-200">
        <div>
          <LabelText>売上金額</LabelText>
        </div>

        <div className="text-right">
          <ValueText className="text-[18px]">{formatMoney(totalAmount).replace("¥", "")}</ValueText>
        </div>

        <div className="pl-3">
          <LabelText subtle={true}>＝営走</LabelText>
        </div>

        <div className="text-right">
          <ValueText className="text-[18px]">{businessKm}</ValueText>
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
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="h-[42px] min-w-[82px] border border-slate-300 bg-white text-slate-700 text-sm font-bold active:bg-slate-100"
          >
            戻る
          </button>

          <div className="text-[18px] font-bold tracking-[-0.02em] text-slate-800">
            終了前チェック
          </div>

          <button
            type="button"
            onClick={onConfirm}
            className="h-[42px] min-w-[92px] bg-slate-800 text-white text-sm font-bold active:opacity-90"
          >
            確定
          </button>
        </div>

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[340px] grid gap-4 pb-2">
            <div className="grid gap-0">
              <EditRow
                label="①"
                value={formatMoney(finishSummary.amount1)}
                onClick={() => openHistoryModalWithFilter("1")}
                accent="sky"
              />

              <EditRow
                label="②"
                value={formatMoney(finishSummary.amount2)}
                onClick={() => openHistoryModalWithFilter("2")}
                accent="emerald"
              />

              <InputRow
                label="全走行"
                value={finishForm.totalDistance}
                onChange={(e) =>
                  setFinishFormField("totalDistance", e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="0"
                suffix="km"
              />
            </div>

            <RowShell>
              <SalesAndBusinessRow
                totalAmount={finishSummary.totalAmount}
                businessKm={finishSummary.businessKm}
              />

              <SummaryLine
                label="件数"
                value={finishSummary.recordCount}
                suffix="件"
              />

              <SummaryLine
                label="人数"
                value={finishSummary.passengerCount}
                suffix="人"
              />
            </RowShell>

            <InputRow
              label="備考"
              value={finishForm.note}
              onChange={(e) => setFinishFormField("note", e.target.value)}
              multiline={true}
            />
          </div>
        </div>
      </div>
    );
  };
})();

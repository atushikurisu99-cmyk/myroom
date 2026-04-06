window.AppScreens = window.AppScreens || {};
window.AppScreens.FinishCheckScreen = (() => {
  return function FinishCheckScreen(props) {
    const {
      finishCountdown = 3,
      onBack,
      onConfirm,
    } = props;

    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full max-w-[320px] rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[20px] font-bold text-slate-800 text-center tracking-[-0.02em]">
            本日の乗務を終了します
          </div>

          <div className="mt-4 text-[14px] leading-relaxed text-slate-500 text-center">
            {finishCountdown > 0
              ? `${finishCountdown}秒後に自動で終了します`
              : "終了しています"}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold active:bg-slate-200"
            >
              戻る
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold active:opacity-90"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    );
  };
})();

window.AppScreens = window.AppScreens || {};
window.AppScreens.HistoryModal = (() => {
  const { HistoryRecordCard } = window.AppComponents;
  const { formatMoney, formatTime, formatFullDate } = window.AppUtils;
  const shadowSub = window.AppConstants.shadowSub;

  function HistoryModal(props) {
    const {
      show,
      editingRecord,
      historyUiMode,
      historyMode,
      historyFilter,
      historySummary,
      filteredHistoryRecords,
      groupedHistory,
      expandedMonthDays,
      getHistoryPeriodText,
      closeHistoryModal,
      setHistoryMode,
      setHistoryFilter,
      moveHistoryPeriod,
      toggleMonthDay,
      openEditRecord,
      closeEditRecord,
      saveEditedRecord,
      deleteEditedRecord,
      setEditingRecord,
    } = props;

    if (!show) return null;

    const isFullMode = historyUiMode === "full";

    return (
      <div
        className="absolute inset-0 z-40 bg-white flex flex-col overflow-hidden"
        style={{
          animation: "historySheetUp 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {!editingRecord ? (
          <>
            <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-slate-800">履歴一覧</div>
                <button
                  type="button"
                  onClick={closeHistoryModal}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
                >
                  閉じる
                </button>
              </div>

              <div className="mt-3 grid gap-2">
                {isFullMode && (
                  <div className="grid grid-cols-3 gap-2">
                    {["day", "week", "month"].map((mode, idx) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setHistoryMode(mode)}
                        className={`h-[42px] rounded-2xl text-sm font-bold border ${
                          historyMode === mode
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {["日", "週", "月"][idx]}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-[48px_1fr_48px] gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => moveHistoryPeriod(-1)}
                    className="h-[42px] rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-lg font-bold"
                  >
                    ←
                  </button>
                  <div className="h-[42px] rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center px-3 text-sm font-bold text-slate-800 overflow-hidden">
                    <div className="truncate">{getHistoryPeriodText()}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveHistoryPeriod(1)}
                    className="h-[42px] rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-lg font-bold"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {["all", "1", "2"].map((value, idx) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setHistoryFilter(value)}
                      className={`h-[40px] rounded-2xl text-sm font-bold border ${
                        historyFilter === value
                          ? "bg-sky-500 text-white border-sky-500"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {["すべて", "①", "②"][idx]}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-slate-600">件数 {historySummary.count}件</div>
                  <div className="text-base font-bold text-slate-800">
                    {formatMoney(historySummary.total)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-3 touch-pan-y">
              {filteredHistoryRecords.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  該当する履歴はありません
                </div>
              ) : isFullMode && historyMode === "month" ? (
                <div className="grid gap-3">
                  {groupedHistory.map((group) => {
                    const opened = expandedMonthDays[group.key] === true;
                    return (
                      <div key={group.key} className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMonthDay(group.key)}
                          className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left active:bg-slate-50 ${shadowSub}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[18px] font-bold text-slate-800">
                                {formatFullDate(group.date)}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {group.count}件
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-base font-bold text-slate-800">
                                {formatMoney(group.total)}
                              </div>
                              <div className="mt-1 text-xs font-semibold text-slate-500">
                                {opened ? "閉じる" : "開く"}
                              </div>
                            </div>
                          </div>
                        </button>

                        {opened && (
                          <div className="pl-3 grid gap-2">
                            {group.records.map((record) => (
                              <HistoryRecordCard
                                key={record.id}
                                record={record}
                                onClick={openEditRecord}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid gap-4">
                  {groupedHistory.map((group) => (
                    <div key={group.key} className="grid gap-2">
                      <div className="pt-2">
                        <div className="text-[19px] font-bold text-slate-800 tracking-[-0.01em]">
                          {formatFullDate(group.date)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {group.count}件 ・ {formatMoney(group.total)}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {group.records.map((record) => (
                          <HistoryRecordCard
                            key={record.id}
                            record={record}
                            onClick={openEditRecord}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={closeEditRecord}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
                >
                  戻る
                </button>
                <div className="text-lg font-bold text-slate-800">履歴修正</div>
                <button
                  type="button"
                  onClick={saveEditedRecord}
                  className="px-3 py-2 rounded-xl bg-sky-500 text-white text-sm font-bold"
                >
                  保存
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-3 touch-pan-y">
              <div className="grid gap-3">
                <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}>
                  <div className="text-xs font-semibold text-slate-500">対象履歴</div>
                  <div className="mt-2 text-[18px] font-bold text-slate-800">
                    {formatFullDate(editingRecord.乗務日 || editingRecord.乗車時刻)}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {formatTime(editingRecord.乗車時刻)} → {formatTime(editingRecord.降車時刻)}
                  </div>
                </div>

                <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}>
                  <div className="text-sm font-semibold text-slate-600">金額</div>
                  <div className="mt-2 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                      ¥
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={Number(editingRecord.金額入力 || 0).toLocaleString("ja-JP")}
                      onChange={(e) =>
                        setEditingRecord((prev) => ({
                          ...prev,
                          金額入力: e.target.value.replace(/[^\d]/g, ""),
                        }))
                      }
                      className="block w-full min-w-0 rounded-2xl border border-slate-300 pl-12 pr-4 py-4 text-3xl font-bold text-slate-800 outline-none focus:border-sky-300 box-border"
                    />
                  </div>
                </div>

                <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}>
                  <div className="text-sm font-semibold text-slate-600">区分</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["1", "2"].map((v, idx) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setEditingRecord((prev) => ({ ...prev, 区分入力: v }))}
                        className={`h-[52px] rounded-2xl text-lg font-bold border ${
                          editingRecord.区分入力 === v
                            ? v === "1"
                              ? "bg-sky-500 text-white border-sky-500"
                              : "bg-emerald-500 text-white border-emerald-500"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {["①", "②"][idx]}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    ①＝現金・領収証なし　②＝カード/QR・領収証あり含む
                  </div>
                </div>

                <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}>
                  <div className="text-sm font-semibold text-slate-600">人数</div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          setEditingRecord((prev) => ({ ...prev, 人数入力: count }))
                        }
                        className={`h-[46px] rounded-2xl text-lg font-bold border ${
                          Number(editingRecord.人数入力) === count
                            ? "bg-sky-500 text-white border-sky-500"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  ["乗車地", "乗車地入力"],
                  ["降車地", "降車地入力"],
                  ["備考", "備考入力"],
                ].map(([label, key]) => (
                  <div
                    key={key}
                    className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}
                  >
                    <div className="text-sm font-semibold text-slate-600">{label}</div>
                    <input
                      type="text"
                      value={editingRecord[key]}
                      onChange={(e) =>
                        setEditingRecord((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="mt-2 block w-full min-w-0 rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-800 outline-none focus:border-sky-300 box-border"
                    />
                  </div>
                ))}

                {[
                  ["乗車時刻", "乗車時刻入力"],
                  ["降車時刻", "降車時刻入力"],
                ].map(([label, key]) => (
                  <div
                    key={key}
                    className={`rounded-2xl border border-slate-200 bg-white p-4 ${shadowSub}`}
                  >
                    <div className="text-sm font-semibold text-slate-600">{label}</div>
                    <input
                      type="datetime-local"
                      value={editingRecord[key]}
                      onChange={(e) =>
                        setEditingRecord((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="mt-2 block w-full min-w-0 rounded-2xl border border-slate-300 px-3 py-3 text-[15px] text-slate-800 outline-none focus:border-sky-300 box-border overflow-hidden"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={saveEditedRecord}
                  className={`w-full rounded-2xl h-[56px] text-xl font-bold bg-sky-500 text-white ${shadowSub}`}
                >
                  保存する
                </button>

                <button
                  type="button"
                  onClick={deleteEditedRecord}
                  className={`w-full rounded-2xl h-[52px] text-base font-bold bg-red-50 text-red-600 border border-red-200 ${shadowSub}`}
                >
                  この履歴を削除
                </button>
              </div>
            </div>
          </>
        )}

        <style>{`
          @keyframes historySheetUp {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return HistoryModal;
})();

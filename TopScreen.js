const TopScreen = ({ onStart, state }) => {
  const time = new Date();
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 overflow-hidden">

      {/* 🔥 緑エリア（高さを詰める） */}
      <div
        className="w-full relative shrink-0"
        style={{
          background: "#6FCF4A",
          height: "250px" // ← 300 → 250 に削減（ここが効く）
        }}
      >
        {/* 時刻 */}
        <div className="absolute right-6 top-6 text-white text-6xl font-bold tracking-tight">
          {hh}:{mm}
        </div>

        {/* 売上 */}
        <div className="absolute left-6 top-20 text-white">
          <div className="text-sm opacity-90 font-semibold">当月達成売上</div>
          <div className="text-2xl font-bold mt-1">¥0</div>
        </div>

        {/* 👁 */}
        <div className="absolute right-6 top-24 text-white text-xl">
          👁
        </div>

        {/* 🔥 ボタンを下に“はみ出させる” */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-60px] w-[85%]">
          <button
            onClick={onStart}
            className="w-full py-6 rounded-3xl text-white text-2xl font-bold shadow-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #BDEDD9 0%, #79C9B0 48%, #4C997F 100%)",
              minHeight: "120px"
            }}
          >
            {/* 上の光沢 */}
            <div className="absolute left-4 right-4 top-3 h-14 rounded-full bg-white/20"></div>

            <span className="relative z-10">乗務開始</span>
          </button>
        </div>
      </div>

      {/* 🔽 下エリア */}
      <div className="flex-1 min-h-0 px-4 pt-20 flex flex-col">
        {/* ↑ ptを増やしてボタンのはみ出し分を吸収 */}

        {/* グラフ入口 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "売上", sub: "グラフ" },
            { title: "本数", sub: "推移" },
            { title: "時間帯", sub: "動き" },
            { title: "分析", sub: "入口" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl p-4"
              style={{
                height: "90px"
              }}
            >
              <div className="text-gray-700 font-bold text-[18px] leading-none">
                {item.title}
              </div>
              <div className="text-gray-400 text-sm mt-2 font-semibold">
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* 余白調整 */}
        <div className="flex-1"></div>

        {/* ▲（右固定） */}
        <div className="w-full flex justify-end pr-2 pb-10">
          <div className="text-gray-300 text-2xl">▲</div>
        </div>
      </div>

    </div>
  );
};

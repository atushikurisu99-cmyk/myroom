const TopScreen = ({ onStart, state }) => {
  const time = new Date();
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">

      {/* 上部グリーン */}
      <div
        className="w-full relative"
        style={{
          background: "#6FCF4A",
          height: "300px"
        }}
      >
        {/* 時刻 */}
        <div className="absolute right-6 top-6 text-white text-6xl font-bold">
          {hh}:{mm}
        </div>

        {/* 売上 */}
        <div className="absolute left-6 top-20 text-white">
          <div className="text-sm opacity-80">当月達成売上</div>
          <div className="text-2xl font-bold">¥0</div>
        </div>

        {/* 👁 */}
        <div className="absolute right-6 top-24 text-white text-xl">
          👁
        </div>

        {/* 乗務開始ボタン */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-45px] w-[85%]">
          <button
            onClick={onStart}
            className="w-full py-6 rounded-3xl text-white text-2xl font-bold shadow-lg"
            style={{
              background: "linear-gradient(180deg, #7FDAC3 0%, #2E9E82 100%)"
            }}
          >
            乗務開始
          </button>
        </div>
      </div>

      {/* 下エリア */}
      <div className="flex-1 pt-16 px-4">

        {/* 🔽 グラフ入口（高さ縮小版） */}
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
                height: "90px"   // ←ここが今回の修正（元より小さい）
              }}
            >
              <div className="text-gray-700 font-bold">
                {item.title}
              </div>
              <div className="text-gray-400 text-sm">
                {item.sub}
              </div>
            </div>
          ))}

        </div>

        {/* ▲ */}
        <div className="w-full flex justify-end mt-2 pr-2">
          <div className="text-gray-300 text-2xl">▲</div>
        </div>

      </div>

    </div>
  );
};

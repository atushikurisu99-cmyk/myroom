
function TopScreen({ onNext }) {
  return (
    <div className="w-full h-screen flex flex-col items-center">

      <div className="w-full bg-green-500 text-white p-6">
        <div className="text-4xl text-right">05:45</div>
        <div className="mt-2">当月達成売上</div>
        <div className="text-2xl">¥0</div>
      </div>

      <button onClick={onNext}
        className="mt-[-30px] w-[90%] bg-green-400 text-white py-6 rounded-2xl text-xl shadow-lg">
        乗務開始
      </button>

      <div className="mt-10 grid grid-cols-2 gap-4 w-[90%]">
        <div className="bg-gray-200 p-6 rounded-xl">売上</div>
        <div className="bg-gray-200 p-6 rounded-xl">本数</div>
        <div className="bg-gray-200 p-6 rounded-xl">時間帯</div>
        <div className="bg-gray-200 p-6 rounded-xl">分析</div>
      </div>

      <BottomNav />
    </div>
  );
}

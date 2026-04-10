
function RideScreen({ onNext }) {
  return (
    <div className="w-full h-screen flex flex-col items-center">

      <div className="w-full bg-green-500 text-white p-6">
        <div className="text-4xl text-right">05:45</div>
      </div>

      <button onClick={onNext}
        className="mt-[-30px] w-[90%] bg-yellow-500 text-white py-6 rounded-2xl text-xl shadow-lg">
        降車
      </button>

      <div className="mt-6 bg-white p-4 rounded-xl shadow w-[90%]">
        取得中...
      </div>

      <BottomNav />
    </div>
  );
}

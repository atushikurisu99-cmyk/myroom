
function StandbyScreen({ onNext }) {
  return (
    <div className="w-full h-screen flex flex-col items-center">

      <div className="w-full bg-green-500 text-white p-6">
        <div className="text-4xl text-right">05:45</div>
      </div>

      <button onClick={onNext}
        className="mt-[-30px] w-[90%] bg-blue-500 text-white py-6 rounded-2xl text-xl shadow-lg">
        実車
      </button>

      <BottomNav />
    </div>
  );
}

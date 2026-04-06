window.useTaxiAppState = function () {
  const [screen, setScreen] = React.useState("top");
  const [dutyStarted, setDutyStarted] = React.useState(false);
  const [isRiding, setIsRiding] = React.useState(false);

  const [homeEndSheetOpen, setHomeEndSheetOpen] = React.useState(false);

  const [currentLocation, setCurrentLocation] = React.useState(null);

  // ===== 位置情報 高精度取得（51mNG） =====
  async function getHighAccuracyPosition() {
    return new Promise((resolve) => {
      let best = null;
      let count = 0;

      function tryGet() {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const acc = pos.coords.accuracy;

            // 51m以上は完全NG
            if (acc > 50) {
              count++;
              if (count < 5) {
                tryGet();
              } else {
                resolve(best); // 最悪でもベスト返す
              }
              return;
            }

            if (!best || acc < best.coords.accuracy) {
              best = pos;
            }

            // 20m以下なら即採用
            if (acc <= 20) {
              resolve(pos);
            } else {
              count++;
              if (count < 5) {
                tryGet();
              } else {
                resolve(best);
              }
            }
          },
          () => resolve(best),
          {
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge: 0,
          }
        );
      }

      tryGet();
    });
  }

  async function captureLocation() {
    const pos = await getHighAccuracyPosition();
    if (pos) setCurrentLocation(pos);
  }

  // ===== 状態遷移 =====

  function startDuty() {
    setDutyStarted(true);
    setScreen("standby");
  }

  function startRide() {
    setIsRiding(true);
    setScreen("ride");
    captureLocation();
  }

  function endRide() {
    setIsRiding(false);
    setScreen("fare");
  }

  function goHome() {
    setScreen("top");
  }

  function toggleEndSheet() {
    // 待機中のみ
    if (!dutyStarted || isRiding) return;
    setHomeEndSheetOpen((v) => !v);
  }

  function finishDuty() {
    setDutyStarted(false);
    setIsRiding(false);
    setHomeEndSheetOpen(false);
    setScreen("top");
  }

  return {
    screen,
    dutyStarted,
    isRiding,
    homeEndSheetOpen,
    currentLocation,

    startDuty,
    startRide,
    endRide,
    goHome,
    toggleEndSheet,
    finishDuty,
  };
};

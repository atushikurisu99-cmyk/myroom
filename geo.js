window.AppGeo = (() => {
  const { normalizePlaceLabel, sleep } = window.AppUtils;

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ja`
      );
      if (!response.ok) return "未取得";

      const data = await response.json();
      if (data.display_name) return normalizePlaceLabel(data.display_name);

      const address = data.address || {};
      const raw = [
        address.prefecture || "",
        address.city || address.town || address.village || "",
        address.suburb || address.neighbourhood || address.quarter || "",
        address.road || "",
      ]
        .filter(Boolean)
        .join(" ");

      return normalizePlaceLabel(raw);
    } catch {
      return "未取得";
    }
  };

  const getSinglePosition = () =>
    new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("geolocation unavailable"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 4500,
        maximumAge: 0,
      });
    });

  const getBestCurrentPlace = async () => {
    if (!("geolocation" in navigator)) {
      return { label: "未取得", accuracy: null, latitude: null, longitude: null };
    }

    const samples = [];
    const tryCount = 5;
    const goodEnoughAccuracy = 25;

    for (let i = 0; i < tryCount; i += 1) {
      try {
        const position = await getSinglePosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = Number(position.coords.accuracy || 9999);

        samples.push({ latitude, longitude, accuracy });
        if (accuracy <= goodEnoughAccuracy) break;
      } catch {}

      if (i < tryCount - 1) {
        await sleep(180);
      }
    }

    if (samples.length === 0) {
      return { label: "未取得", accuracy: null, latitude: null, longitude: null };
    }

    const best = [...samples].sort((a, b) => a.accuracy - b.accuracy)[0];
    const label = await reverseGeocode(best.latitude, best.longitude);

    return {
      label: label || "未取得",
      accuracy: Number.isFinite(best.accuracy) ? Math.round(best.accuracy) : null,
      latitude: best.latitude,
      longitude: best.longitude,
    };
  };

  const fetchWeatherSnapshot = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=Asia%2FTokyo&current=weather_code&daily=weather_code&forecast_days=2`
      );
      if (!response.ok) {
        return {
          nowKind: "unknown",
          tomorrowKind: "unknown",
          fetchedAt: Date.now(),
          dateKey: new Date().toDateString(),
        };
      }

      const data = await response.json();
      const nowCode = Number(data?.current?.weather_code ?? -1);
      const tomorrowCode = Number(data?.daily?.weather_code?.[1] ?? nowCode);

      return {
        nowKind: window.AppUtils.weatherCodeToKind(nowCode),
        tomorrowKind: window.AppUtils.weatherCodeToKind(tomorrowCode),
        fetchedAt: Date.now(),
        dateKey: new Date().toDateString(),
      };
    } catch {
      return {
        nowKind: "unknown",
        tomorrowKind: "unknown",
        fetchedAt: Date.now(),
        dateKey: new Date().toDateString(),
      };
    }
  };

  const shouldRefreshWeather = (lastWeatherAt, lastWeatherDateKey) => {
    if (!lastWeatherAt) return true;

    const now = Date.now();
    const currentDateKey = new Date().toDateString();
    const twoHours = 2 * 60 * 60 * 1000;

    if (!lastWeatherDateKey) return true;
    if (currentDateKey !== lastWeatherDateKey) return true;
    if (now - lastWeatherAt >= twoHours) return true;

    return false;
  };

  return {
    reverseGeocode,
    getSinglePosition,
    getBestCurrentPlace,
    fetchWeatherSnapshot,
    shouldRefreshWeather,
  };
})();

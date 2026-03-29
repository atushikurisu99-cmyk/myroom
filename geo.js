window.AppGeo = (() => {
  const { normalizePlaceLabel, sleep, weatherCodeToKind } = window.AppUtils;

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

  const getBestCurrentCoords = async () => {
    if (!("geolocation" in navigator)) {
      return { latitude: null, longitude: null, accuracy: null };
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
      } catch (_) {}

      if (i < tryCount - 1) {
        await sleep(180);
      }
    }

    if (samples.length === 0) {
      return { latitude: null, longitude: null, accuracy: null };
    }

    const best = [...samples].sort((a, b) => a.accuracy - b.accuracy)[0];
    return {
      latitude: best.latitude,
      longitude: best.longitude,
      accuracy: Number.isFinite(best.accuracy) ? Math.round(best.accuracy) : null,
    };
  };

  const getBestCurrentPlace = async () => {
    const best = await getBestCurrentCoords();
    if (best.latitude == null || best.longitude == null) {
      return { label: "未取得", accuracy: null, latitude: null, longitude: null };
    }

    const label = await reverseGeocode(best.latitude, best.longitude);

    return {
      label: label || "未取得",
      accuracy: best.accuracy,
      latitude: best.latitude,
      longitude: best.longitude,
    };
  };

  const fetchWeather = async (latitude, longitude) => {
    if (latitude == null || longitude == null) {
      return {
        nowKind: "unknown",
        tomorrowKind: "unknown",
      };
    }

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&timezone=Asia%2FTokyo` +
        `&current=weather_code` +
        `&daily=weather_code` +
        `&forecast_days=2`;

      const response = await fetch(url);
      if (!response.ok) {
        return {
          nowKind: "unknown",
          tomorrowKind: "unknown",
        };
      }

      const data = await response.json();
      const currentCode = Number(data?.current?.weather_code ?? -1);
      const tomorrowCode = Number(
        data?.daily?.weather_code?.[1] ?? data?.daily?.weather_code?.[0] ?? currentCode
      );

      return {
        nowKind: weatherCodeToKind(currentCode),
        tomorrowKind: weatherCodeToKind(tomorrowCode),
      };
    } catch {
      return {
        nowKind: "unknown",
        tomorrowKind: "unknown",
      };
    }
  };

  return {
    reverseGeocode,
    getSinglePosition,
    getBestCurrentCoords,
    getBestCurrentPlace,
    fetchWeather,
  };
})();

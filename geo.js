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

  return {
    reverseGeocode,
    getSinglePosition,
    getBestCurrentPlace,
  };
})();

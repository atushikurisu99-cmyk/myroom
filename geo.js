window.AppGeo = (() => {
  const { normalizePlaceLabel, sleep } = window.AppUtils;

  const EMPTY_RESULT = {
    label: "未取得",
    accuracy: null,
    latitude: null,
    longitude: null,
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ja`
      );
      if (!response.ok) return "未取得";

      const data = await response.json();

      if (data.display_name) {
        return normalizePlaceLabel(data.display_name);
      }

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

  const getSinglePosition = (options = {}) =>
    new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("geolocation unavailable"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: options.timeout ?? 5000,
        maximumAge: options.maximumAge ?? 0,
      });
    });

  const toSample = (position) => ({
    latitude: Number(position.coords.latitude),
    longitude: Number(position.coords.longitude),
    accuracy: Number(position.coords.accuracy || 9999),
    timestamp: Number(position.timestamp || Date.now()),
  });

  const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const dedupeCloseSamples = (samples) => {
    const result = [];

    samples.forEach((sample) => {
      const hasNear = result.some((existing) => {
        const distance = getDistanceMeters(
          sample.latitude,
          sample.longitude,
          existing.latitude,
          existing.longitude
        );
        return distance <= 8;
      });

      if (!hasNear) result.push(sample);
    });

    return result;
  };

  const getClusterScore = (target, allSamples) => {
    const closeCount = allSamples.filter((sample) => {
      const distance = getDistanceMeters(
        target.latitude,
        target.longitude,
        sample.latitude,
        sample.longitude
      );
      return distance <= 35;
    }).length;

    return closeCount;
  };

  const chooseBestSample = (samples) => {
    if (!samples || samples.length === 0) return null;
    if (samples.length === 1) return samples[0];

    const uniqueSamples = dedupeCloseSamples(samples);

    const scored = uniqueSamples.map((sample) => ({
      ...sample,
      clusterScore: getClusterScore(sample, samples),
    }));

    scored.sort((a, b) => {
      if (b.clusterScore !== a.clusterScore) {
        return b.clusterScore - a.clusterScore;
      }
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy;
      }
      return b.timestamp - a.timestamp;
    });

    return scored[0];
  };

  const getBestCurrentPlace = async () => {
    if (!("geolocation" in navigator)) {
      return { ...EMPTY_RESULT };
    }

    const samples = [];
    const tryCount = 7;
    const excellentAccuracy = 12;
    const goodEnoughAccuracy = 25;

    for (let i = 0; i < tryCount; i += 1) {
      try {
        const position = await getSinglePosition({
          timeout: i < 2 ? 3800 : 5200,
          maximumAge: 0,
        });

        const sample = toSample(position);
        samples.push(sample);

        if (sample.accuracy <= excellentAccuracy) {
          break;
        }

        if (samples.length >= 3) {
          const provisionalBest = chooseBestSample(samples);
          if (
            provisionalBest &&
            provisionalBest.accuracy <= goodEnoughAccuracy &&
            provisionalBest.clusterScore >= 2
          ) {
            break;
          }
        }
      } catch (_) {}

      if (i < tryCount - 1) {
        await sleep(i < 2 ? 160 : 220);
      }
    }

    if (samples.length === 0) {
      return { ...EMPTY_RESULT };
    }

    const best = chooseBestSample(samples);
    if (!best) {
      return { ...EMPTY_RESULT };
    }

    const label = await reverseGeocode(best.latitude, best.longitude);

    return {
      label: label || "未取得",
      accuracy: Number.isFinite(best.accuracy) ? Math.round(best.accuracy) : null,
      latitude: best.latitude,
      longitude: best.longitude,
    };
  };

  const pickLaterHourIndex = (times) => {
    if (!Array.isArray(times) || times.length === 0) return -1;

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const threeHours = 3 * oneHour;

    let fallbackIndex = -1;
    let bestIndex = -1;

    for (let i = 0; i < times.length; i += 1) {
      const ts = new Date(times[i]).getTime();
      if (!Number.isFinite(ts)) continue;

      if (ts > now && fallbackIndex === -1) {
        fallbackIndex = i;
      }

      const diff = ts - now;
      if (diff >= oneHour && diff <= threeHours) {
        bestIndex = i;
        break;
      }
    }

    if (bestIndex >= 0) return bestIndex;
    return fallbackIndex;
  };

  const getRepresentativeCode = (codes) => {
    if (!Array.isArray(codes) || codes.length === 0) return -1;

    const counts = new Map();

    codes.forEach((code) => {
      const key = Number(code);
      if (!Number.isFinite(key)) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    if (counts.size === 0) return -1;

    let bestCode = -1;
    let bestCount = -1;

    counts.forEach((count, code) => {
      if (count > bestCount) {
        bestCount = count;
        bestCode = code;
      }
    });

    return bestCode;
  };

  const extractTomorrowWindowCodes = (times, codes) => {
    if (!Array.isArray(times) || !Array.isArray(codes)) return [];

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const y = tomorrow.getFullYear();
    const m = tomorrow.getMonth();
    const d = tomorrow.getDate();

    const start = new Date(y, m, d, 6, 0, 0, 0).getTime();
    const end = new Date(y, m, d, 21, 0, 0, 0).getTime();

    const picked = [];

    for (let i = 0; i < times.length; i += 1) {
      const ts = new Date(times[i]).getTime();
      if (!Number.isFinite(ts)) continue;
      if (ts >= start && ts <= end) {
        picked.push(Number(codes[i]));
      }
    }

    return picked;
  };

  const fetchWeatherSnapshot = async (latitude, longitude) => {
    const fallback = {
      nowKind: "unknown",
      tomorrowKind: "unknown",
      fetchedAt: Date.now(),
      dateKey: new Date().toDateString(),
    };

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=Asia%2FTokyo&hourly=weather_code&daily=weather_code&forecast_days=3`
      );

      if (!response.ok) {
        return fallback;
      }

      const data = await response.json();

      const hourlyTimes = data?.hourly?.time || [];
      const hourlyCodes = data?.hourly?.weather_code || [];
      const dailyCodes = data?.daily?.weather_code || [];

      const laterIndex = pickLaterHourIndex(hourlyTimes);
      const laterCode =
        laterIndex >= 0 ? Number(hourlyCodes[laterIndex] ?? -1) : -1;

      const tomorrowWindowCodes = extractTomorrowWindowCodes(hourlyTimes, hourlyCodes);
      const tomorrowRepresentativeCode = getRepresentativeCode(tomorrowWindowCodes);

      const tomorrowDailyCode = Number(dailyCodes?.[1] ?? -1);

      const nextNowCode =
        Number.isFinite(laterCode) && laterCode >= 0
          ? laterCode
          : Number(dailyCodes?.[0] ?? -1);

      const nextTomorrowCode =
        Number.isFinite(tomorrowRepresentativeCode) && tomorrowRepresentativeCode >= 0
          ? tomorrowRepresentativeCode
          : tomorrowDailyCode;

      return {
        nowKind: window.AppUtils.weatherCodeToKind(nextNowCode),
        tomorrowKind: window.AppUtils.weatherCodeToKind(nextTomorrowCode),
        fetchedAt: Date.now(),
        dateKey: new Date().toDateString(),
      };
    } catch {
      return fallback;
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

window.AppGeo = (() => {
  const { normalizePlaceLabel, sleep } = window.AppUtils;

  const EMPTY_RESULT = {
    label: "未取得",
    accuracy: null,
    latitude: null,
    longitude: null,
  };

  const REVERSE_LABEL_CACHE_KEY = "taxi_reverse_label_cache_v2";

  const loadJsonCache = (key) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      return parsed;
    } catch (_) {
      return {};
    }
  };

  const saveJsonCache = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  };

  let reverseLabelCache = loadJsonCache(REVERSE_LABEL_CACHE_KEY);

  const buildCacheKeyFromLatLon = (latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "";
    return `${lat.toFixed(5)},${lon.toFixed(5)}`;
  };

  const fetchJson = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`http ${response.status}`);
    }

    return response.json();
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
    if (samples.length === 1) {
      return {
        ...samples[0],
        clusterScore: 1,
      };
    }

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

  const reverseGeocodeGsi = async (latitude, longitude) => {
    try {
      const url =
        `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress` +
        `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;

      const data = await fetchJson(url);
      const results = data?.results || {};

      return {
        lv01Nm: String(results.lv01Nm || "").trim(),
      };
    } catch (_) {
      return {
        lv01Nm: "",
      };
    }
  };

  const reverseGeocodeBroad = async (latitude, longitude) => {
    try {
      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2&lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}` +
        `&accept-language=ja&zoom=18&addressdetails=1`;

      const data = await fetchJson(url);
      const address = data?.address || {};

      return {
        prefecture: String(
          address.state || address.province || address.region || ""
        ).trim(),
        city: String(
          address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            ""
        ).trim(),
        ward: String(
          address.city_district ||
            address.borough ||
            address.suburb ||
            address.neighbourhood ||
            ""
        ).trim(),
        district: String(
          address.quarter ||
            address.hamlet ||
            address.neighbourhood ||
            address.suburb ||
            address.road ||
            ""
        ).trim(),
      };
    } catch (_) {
      return {
        prefecture: "",
        city: "",
        ward: "",
        district: "",
      };
    }
  };

  const compactUniqueJoin = (parts) => {
    const out = [];

    parts.forEach((part) => {
      const text = String(part || "").trim();
      if (!text) return;
      if (out.includes(text)) return;
      out.push(text);
    });

    return out.join("");
  };

  const stripLeadingDuplicates = (text, prefixes) => {
    let next = String(text || "").trim();

    prefixes.forEach((prefix) => {
      const p = String(prefix || "").trim();
      if (!p) return;
      if (next.startsWith(p)) {
        next = next.slice(p.length).trim();
      }
    });

    return next;
  };

  const buildDisplayLabel = ({ prefecture, city, ward, district }) => {
    const safePrefecture = String(prefecture || "").trim();
    const safeCity = String(city || "").trim();
    const safeWard = String(ward || "").trim();
    const rawDistrict = String(district || "").trim();

    const safeDistrict = stripLeadingDuplicates(rawDistrict, [
      safePrefecture,
      safeCity,
      safeWard,
    ]);

    if (safePrefecture === "広島県" && safeCity === "広島市") {
      return compactUniqueJoin([safeWard, safeDistrict]);
    }

    if (safePrefecture === "広島県") {
      return compactUniqueJoin([safeCity, safeWard, safeDistrict]);
    }

    return compactUniqueJoin([safePrefecture, safeCity, safeWard, safeDistrict]);
  };

  const reverseGeocode = async (latitude, longitude) => {
    const cacheKey = buildCacheKeyFromLatLon(latitude, longitude);
    if (cacheKey && reverseLabelCache[cacheKey]) {
      return reverseLabelCache[cacheKey];
    }

    const [gsi, broad] = await Promise.all([
      reverseGeocodeGsi(latitude, longitude),
      reverseGeocodeBroad(latitude, longitude),
    ]);

    const district =
      String(gsi.lv01Nm || "").trim() || String(broad.district || "").trim();

    let label = buildDisplayLabel({
      prefecture: broad.prefecture,
      city: broad.city,
      ward: broad.ward,
      district,
    });

    if (!label) {
      label = buildDisplayLabel({
        prefecture: broad.prefecture,
        city: broad.city,
        ward: broad.ward,
        district: "",
      });
    }

    const normalized = normalizePlaceLabel(label || "未取得") || "未取得";

    if (cacheKey && normalized !== "未取得") {
      reverseLabelCache[cacheKey] = normalized;

      const keys = Object.keys(reverseLabelCache);
      if (keys.length > 500) {
        const next = {};
        keys.slice(-300).forEach((key) => {
          next[key] = reverseLabelCache[key];
        });
        reverseLabelCache = next;
      }

      saveJsonCache(REVERSE_LABEL_CACHE_KEY, reverseLabelCache);
    }

    return normalized;
  };

  const getBestCurrentPlace = async () => {
    if (!("geolocation" in navigator)) {
      return { ...EMPTY_RESULT };
    }

    const startedAt = Date.now();
    const hardLimitMs = 6200;
    const samples = [];
    let attempt = 0;

    while (Date.now() - startedAt < hardLimitMs && attempt < 6) {
      attempt += 1;

      const elapsed = Date.now() - startedAt;
      const remaining = hardLimitMs - elapsed;
      if (remaining < 900) break;

      try {
        const timeout = Math.min(
          attempt <= 2 ? 1800 : 2200,
          Math.max(900, remaining - 120)
        );

        const position = await getSinglePosition({
          timeout,
          maximumAge: 0,
        });

        const sample = toSample(position);
        samples.push(sample);

        const provisionalBest = chooseBestSample(samples);

        if (
          provisionalBest &&
          provisionalBest.clusterScore >= 3 &&
          provisionalBest.accuracy <= 20
        ) {
          break;
        }

        if (
          provisionalBest &&
          provisionalBest.clusterScore >= 2 &&
          provisionalBest.accuracy <= 10 &&
          samples.length >= 2
        ) {
          break;
        }
      } catch (_) {}

      if (Date.now() - startedAt < hardLimitMs - 150) {
        await sleep(attempt <= 2 ? 120 : 160);
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

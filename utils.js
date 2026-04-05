window.AppUtils = (() => {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatMoney = (value) => `¥${Number(value || 0).toLocaleString("ja-JP")}`;

  const formatTime = (dateValue) => {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateValue) => {
    const d = new Date(dateValue);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatFullDate = (dateValue) => {
    const d = new Date(dateValue);
    const week = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()}（${week}）`;
  };

  const formatDutyDate = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatMonthText = (dateValue) => {
    const d = new Date(dateValue);
    return `${d.getFullYear()}/${d.getMonth() + 1}`;
  };

  const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const recordType = (record) =>
    record.payment === "cash" && !record.receipt ? "1" : "2";

  const normalizePlaceLabel = (raw) => {
    if (!raw) return "未取得";
    if (raw === "取得中…" || raw === "未取得") return raw;

    let text = String(raw).trim();
    text = text
      .replace(/日本[,、]?/g, " ")
      .replace(/〒?\d{3}-?\d{4}/g, " ")
      .replace(/,/g, " ")
      .replace(/、/g, " ");

    if (/広島県広島市/.test(text)) {
      text = text.replace(/広島県広島市/g, " ");
    } else if (/広島県/.test(text)) {
      text = text.replace(/広島県/g, " ");
    }

    text = text.replace(/広島市/g, " ");
    text = text
      .replace(/中区/g, " ")
      .replace(/東区/g, " ")
      .replace(/南区/g, " ")
      .replace(/西区/g, " ")
      .replace(/安佐南区/g, " ")
      .replace(/安佐北区/g, " ")
      .replace(/安芸区/g, " ")
      .replace(/佐伯区/g, " ");

    text = text.replace(/\s+/g, " ").trim();
    const parts = text.split(" ").filter(Boolean);
    if (parts.length === 0) return "未取得";

    const chomeLike = parts.find((p) =>
      /[一二三四五六七八九十0-9０-９]+丁目/.test(p)
    );
    if (chomeLike) return chomeLike;

    const townLike = parts.find((p) =>
      /(町|本町|通|台|丘|浜|野|原|谷|峠|南|北|東|西)$/.test(p)
    );
    if (townLike) return townLike;

    if (parts.length >= 2) {
      const joined = `${parts[0]} ${parts[1]}`.trim();
      if (joined.length <= 18) return joined;
    }

    return parts[0];
  };

  const getDayStart = (dateValue) => {
    const d = new Date(dateValue);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekStart = (dateValue) => {
    const d = getDayStart(dateValue);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const getWeekEnd = (dateValue) => {
    const d = getWeekStart(dateValue);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const getMonthStart = (dateValue) => {
    const d = new Date(dateValue);
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  };

  const getMonthEnd = (dateValue) => {
    const d = new Date(dateValue);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  };

  const isSameDay = (a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  };

  const isInRange = (dateValue, start, end) => {
    const t = new Date(dateValue).getTime();
    return t >= start.getTime() && t <= end.getTime();
  };

  const getHistoryTargetDate = (record) =>
    record.乗務日 ? new Date(record.乗務日) : new Date(record.乗車時刻);

  const weatherCodeToKind = (code) => {
    if (code === 0) return "clear";
    if ([1, 2].includes(code)) return "partlyCloudy";
    if ([3].includes(code)) return "cloudy";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
      return "rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "thunder";
    return "unknown";
  };

  const getWeatherIcon = (kind) => {
    if (kind === "clear") return "☀️";
    if (kind === "partlyCloudy") return "⛅";
    if (kind === "cloudy") return "☁️";
    if (kind === "fog") return "🌫️";
    if (kind === "rain") return "🌧️";
    if (kind === "snow") return "❄️";
    if (kind === "thunder") return "⛈️";
    return "・";
  };

  return {
    clamp,
    sleep,
    formatMoney,
    formatTime,
    formatShortDate,
    formatFullDate,
    formatDutyDate,
    formatMonthText,
    formatDateTimeLocal,
    recordType,
    normalizePlaceLabel,
    getDayStart,
    getWeekStart,
    getWeekEnd,
    getMonthStart,
    getMonthEnd,
    isSameDay,
    isInRange,
    getHistoryTargetDate,
    weatherCodeToKind,
    getWeatherIcon,
  };
})();

window.AppUtils = (() => {
  const formatMoney = (v) => `¥${Number(v || 0).toLocaleString("ja-JP")}`;

  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return { formatMoney, formatTime };
})();

export function groupKlines(klines, timeframe) {
  const groups = {};
  klines.forEach((kline) => {
    const d = kline.date;
    const year = d.getFullYear();
    let key;
    if (timeframe === 'weekly') {
      // Use ISO week number with leading zero: e.g. 2025‑W01
      const week = getWeekNumber(d);
      key = `${year}-W${String(week).padStart(2, '0')}`;
    } else {
      // monthly
      const month = String(d.getMonth() + 1).padStart(2, '0');
      key = `${year}-${month}`;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(kline);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, items]) => {
      const n = items.length;
      // Sum metrics across all items
      const sumVolatility = items.reduce((acc, d) => acc + d.volatility, 0);
      const sumPerformance = items.reduce((acc, d) => acc + d.performance, 0);
      const totalVolume = items.reduce((acc, d) => acc + d.volume, 0);
      const minVolatility = Math.min(...items.map((d) => d.volatility));
      const maxVolatility = Math.max(...items.map((d) => d.volatility));
      // Compute standard deviation of closing prices
      const meanClose = items.reduce((acc, d) => acc + d.close, 0) / (n || 1);
      const variance = items.reduce((acc, d) => acc + Math.pow(d.close - meanClose, 2), 0) / (n || 1);
      const stdDev = Math.sqrt(variance);

      return {
        key,
        label: key,
        avgVolatility: sumVolatility / (n || 1),
        avgPerformance: sumPerformance / (n || 1),
        totalVolume,
        minVolatility,
        maxVolatility,
        stdDev,
      };
    });
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

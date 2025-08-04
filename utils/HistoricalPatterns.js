// Utility to highlight historically repeating volatility or performance patterns
export function detectRecurringPatterns(data) {
  if (!data || !Array.isArray(data)) return [];
  const map = {};

  data.forEach((item) => {
    const monthDay = item.label?.slice(5);
    if (!map[monthDay]) map[monthDay] = [];
    map[monthDay].push(item);
  });

  const patterns = [];
  for (const [day, items] of Object.entries(map)) {
    if (items.length >= 3) {
      const avgVolatility = items.reduce((sum, d) => sum + d.volatility, 0) / items.length;
      const avgPerformance = items.reduce((sum, d) => sum + d.performance, 0) / items.length;
      if (avgVolatility > 2 || avgPerformance > 5) {
        patterns.push({ day, avgVolatility, avgPerformance });
      }
    }
  }

  return patterns;
}
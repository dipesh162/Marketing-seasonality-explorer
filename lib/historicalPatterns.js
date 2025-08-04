// Returns a Set of dates (yyyy-MM-dd) that qualify as historically significant
export function getHistoricalPatternDates(dataByDate) {
  const values = Object.values(dataByDate ?? {});
  if (!values.length) return new Set();

  const vols = values.map(v => v.volatility).filter(Boolean);
  const volsSorted = [...vols].sort((a, b) => a - b);
  const thresholdVol = volsSorted[Math.floor(volsSorted.length * 0.9)];

  const perfs = values.map(v => Math.abs(v.performance)).filter(Boolean);
  const perfSorted = [...perfs].sort((a, b) => a - b);
  const thresholdPerf = perfSorted[Math.floor(perfSorted.length * 0.9)];

  const volsAll = values.map(v => v.volume).filter(Boolean);
  const volumeSorted = [...volsAll].sort((a, b) => a - b);
  const thresholdVolu = volumeSorted[Math.floor(volumeSorted.length * 0.9)];

  const result = new Set();

  for (const [key, item] of Object.entries(dataByDate)) {
    let matchCount = 0;
    if (item.volatility > thresholdVol) matchCount++;
    if (Math.abs(item.performance) > thresholdPerf) matchCount++;
    if (item.volume > thresholdVolu) matchCount++;
    if (matchCount >= 2) result.add(key);
  }

  return result;
}

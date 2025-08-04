const BASE_URL = 'https://api.binance.com/api/v3';

/**
 *
 * @param {string} symbol   Trading pair, e.g. `'BTCUSDT'` (note: slashes will be stripped)
 * @param {string} interval Interval code (`'1d'`, `'4h'`, `'1w'`, `'1M'` etc.)
 * @param {number} limit    Maximum number of candlesticks when no date range is specified
 * @param {Date}   [startDate] Optional start date for range queries
 * @param {Date}   [endDate]   Optional end date for range queries
 * @returns {Promise<Array>} Promise resolving to an array of parsed candlestick objects
 */

export async function fetchKlines(symbol = 'BTCUSDT', interval = '1d', limit = 30, startDate, endDate) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();
  const params = new URLSearchParams({ symbol: cleanSymbol, interval });
  const isRange = startDate instanceof Date && endDate instanceof Date;

  if (isRange) {
    params.append('startTime', startDate.getTime().toString());
    params.append('endTime', endDate.getTime().toString());
  } else {
    params.append('limit', (limit || 30).toString());
  }

  try {
    const res = await fetch(`${BASE_URL}/klines?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} while fetching klines`);
    const rawData = await res.json();

    return rawData.map(([openTime, open, high, low, close, volume]) => {
      const o = parseFloat(open);
      const h = parseFloat(high);
      const l = parseFloat(low);
      const c = parseFloat(close);
      const v = parseFloat(volume);
      return {
        date: new Date(openTime),
        open: o,
        high: h,
        low: l,
        close: c,
        volume: v,
        volatility: h - l,
        performance: c - o,
      };
    });
  } catch (err) {
    console.error('Error fetching kline data:', err);
    return [];
  }
}

/**
 * @param {string} symbol   Trading pair, e.g. `'BTCUSDT'` (slashes will be removed)
 * @param {number} limit    Number of entries to retrieve from each side (default 5)
 * @returns {Promise<{bids: Array<{price: number, qty: number}>, asks: Array<{price: number, qty: number}>}>}
 */

export async function fetchOrderBook(symbol = 'BTCUSDT', limit = 5) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();
  const params = new URLSearchParams({ symbol: cleanSymbol, limit: String(limit) });

  try {
    const res = await fetch(`${BASE_URL}/depth?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} while fetching order book`);
    const { bids = [], asks = [] } = await res.json();

    const parseSide = (side) => side.map(([price, qty]) => ({ price: parseFloat(price), qty: parseFloat(qty) }));
    return { bids: parseSide(bids), asks: parseSide(asks) };
  } catch (err) {
    console.error('Error fetching order book:', err);
    return { bids: [], asks: [] };
  }
}
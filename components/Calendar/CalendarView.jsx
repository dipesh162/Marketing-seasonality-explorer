"use client";

// React
import { useEffect, useState, useCallback } from 'react';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';

// MUI
import { Alert, Box, CircularProgress, Fade, Snackbar } from '@mui/material';

// Components
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import DayDetailModal from './DayDetailModal';
import AnimatedCalendarWrapper from '../AnimatedCalenderWrapper';

// Utils
import { fetchKlines } from '../../lib/fetchBinanceData';
import { groupKlines } from '../../lib/groupKlines';
import { getHistoricalPatternDates } from '../../lib/historicalPatterns';
import { DEFAULT_ALERTS } from '../../lib/alertConfig';

export default function CalendarView({ symbol, timeframe, metric }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const [dailyKlines, setDailyKlines] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [patternDates, setPatternDates] = useState(new Set());
  const [alertData, setAlertData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const loadMarketData = useCallback(async () => {
    if (!symbol || !timeframe) return;
    setLoading(true);
    try {
      let start, end;
      if (timeframe === 'daily') {
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
      } else {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        start = startOfWeek(monthStart, { weekStartsOn: 0 });
        end = endOfWeek(monthEnd, { weekStartsOn: 0 });
      }
      const klines = await fetchKlines(symbol, '1d', undefined, start, end);
      const byDate = {};
      klines.forEach((item) => {
        const key = format(item.date, 'yyyy-MM-dd');
        byDate[key] = item;
      });
      setDailyKlines(byDate);
      if (timeframe === 'daily') {
        setMarketData(byDate);
      } else if (timeframe === 'weekly') {
        setMarketData(groupKlines(klines, 'weekly'));
      } else {
        setMarketData(groupKlines(klines, 'monthly'));
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setMarketData(null);
    }
    setLoading(false);
  }, [symbol, timeframe, currentDate]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (timeframe === 'daily') d.setDate(d.getDate() - 1);
      else if (timeframe === 'weekly') d.setDate(d.getDate() - 7);
      else d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, [timeframe]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (timeframe === 'daily') d.setDate(d.getDate() + 1);
      else if (timeframe === 'weekly') d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, [timeframe]);

  const handleRangeStart = useCallback((date) => {
    setRangeStart(date);
    setRangeEnd(date);
    setSelectedData(null);
  }, []);

  const handleRangeExtend = useCallback((date) => {
    if (rangeStart) {
      setRangeEnd(date);
    }
  }, [rangeStart]);

  const handleRangeEnd = useCallback((date) => {
    if (!rangeStart) return;
    setRangeEnd(date);
    const startDate = rangeStart < date ? rangeStart : date;
    const endDate = rangeStart < date ? date : rangeStart;
    if (dailyKlines) {
      const items = [];
      const cursor = new Date(startDate);
      while (cursor <= endDate) {
        const key = cursor.toISOString().split('T')[0];
        const item = dailyKlines[key];
        if (item) items.push(item);
        cursor.setDate(cursor.getDate() + 1);
      }
      if (items.length > 0) {
        const n = items.length;
        const sumVolatility = items.reduce((acc, d) => acc + d.volatility, 0);
        const sumPerformance = items.reduce((acc, d) => acc + d.performance, 0);
        const totalVolume = items.reduce((acc, d) => acc + d.volume, 0);
        const minVolatility = Math.min(...items.map((d) => d.volatility));
        const maxVolatility = Math.max(...items.map((d) => d.volatility));
        const meanClose = items.reduce((acc, d) => acc + d.close, 0) / n;
        const variance = items.reduce((acc, d) => acc + Math.pow(d.close - meanClose, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const startKey = format(startDate, 'yyyy-MM-dd');
        const endKey = format(endDate, 'yyyy-MM-dd');
        const aggregated = {
          key: `${startKey}–${endKey}`,
          label: `${startKey}–${endKey}`,
          avgVolatility: sumVolatility / n,
          avgPerformance: sumPerformance / n,
          totalVolume,
          minVolatility,
          maxVolatility,
          stdDev,
          from: startKey,
          to: endKey,
        };
        setSelectedData(aggregated);
        setIsComparing(false);
      }
    }
    setRangeStart(null);
    setRangeEnd(null);
  }, [rangeStart, dailyKlines]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    const adjustFocus = () => {
      let start, end;
      if (timeframe === 'weekly') {
        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
      } else if (timeframe === 'monthly') {
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
      } else {
        start = new Date(currentDate);
        end = new Date(currentDate);
      }
      if (focusedDate < start || focusedDate > end) {
        setFocusedDate(start);
      }
    };
    adjustFocus();
  }, [currentDate, timeframe]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!focusedDate) return;
      let newDate = new Date(focusedDate);
      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'Enter': {
          const key = format(newDate, 'yyyy-MM-dd');
          if (timeframe === 'daily') {
            const info = marketData?.[key];
            if (info) setSelectedData({ ...info, label: key });
          } else if (timeframe === 'weekly') {
            const weekObj = marketData?.find((w) => w.dates?.includes(key));
            if (weekObj) setSelectedData({ ...weekObj });
          } else {
            const monthKey = key.slice(0, 7);
            const match = marketData?.find((d) => d.label === monthKey);
            if (match) setSelectedData({ ...match, label: key });
          }
          return;
        }
        case 'Escape':
          setSelectedData(null);
          setRangeStart(null);
          setRangeEnd(null);
          return;
        default:
          return;
      }
      const isOutside = () => {
        if (timeframe === 'daily') {
          return newDate.toDateString() !== currentDate.toDateString();
        } else if (timeframe === 'weekly') {
          const start = startOfWeek(currentDate);
          const end = endOfWeek(currentDate);
          return newDate < start || newDate > end;
        } else {
          return (
            newDate.getMonth() !== currentDate.getMonth() ||
            newDate.getFullYear() !== currentDate.getFullYear()
          );
        }
      };
      if (isOutside()) {
        if (newDate < currentDate) {
          handlePrev();
        } else {
          handleNext();
        }
      }
      setFocusedDate(newDate);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedDate, currentDate, marketData, timeframe]);

  useEffect(() => {
    if (dailyKlines) {
      setPatternDates(getHistoricalPatternDates(dailyKlines));
    }
  }, [dailyKlines]);

  useEffect(() => {
    if (!marketData || timeframe !== 'daily') return;
    const key = format(focusedDate, 'yyyy-MM-dd');
    const info = dailyKlines?.[key];
    if (info) {
      const isVolatilityHigh = info.volatility > DEFAULT_ALERTS.volatility;
      const isPerformanceLow = info.performance < DEFAULT_ALERTS.performance;
      if (isVolatilityHigh || isPerformanceLow) {
        const type = isVolatilityHigh && isPerformanceLow
          ? 'both'
          : isVolatilityHigh
          ? 'volatility'
          : 'performance';
        const message = `${symbol} on ${key} has ${type === 'both'
          ? 'high volatility and poor performance'
          : type === 'volatility'
          ? 'high volatility'
          : 'poor performance'}.`;
        setAlertData({ type, message });
      }
    }
  }, [focusedDate, marketData]);

  return (
    <Box mt={4}>
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        timeframe={timeframe}
      />
      {loading || !marketData ? (
        <CircularProgress />
      ) : (
        <Fade
          in={!loading && !!marketData}
          timeout={300}
          key={`${timeframe}-${currentDate.toISOString()}`}
        >
          <Box
            mt={4}
            onMouseUp={() => {
              if (rangeStart && rangeEnd) {
                handleRangeEnd(rangeEnd);
              }
            }}
          >
            <AnimatedCalendarWrapper keyProp={`${timeframe}-${currentDate.toISOString()}`}>
              <CalendarGrid
                currentDate={currentDate}
                data={marketData}
                timeframe={timeframe}
                metric={metric}
                dataByDate={dailyKlines}
                onCellClick={(data) => {
                  if (isComparing && comparisonData) {
                    setSelectedData(comparisonData);
                    setIsComparing(false);
                  } else {
                    setSelectedData(data);
                  }
                }}
                focusedDate={focusedDate}
                setFocusedDate={setFocusedDate}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeStart={handleRangeStart}
                onRangeExtend={handleRangeExtend}
                onRangeEnd={handleRangeEnd}
                patternDates={patternDates}
              />
            </AnimatedCalendarWrapper>
          </Box>
        </Fade>
      )}
      <DayDetailModal
        open={!!selectedData}
        onClose={() => {
          setSelectedData(null);
          setIsComparing(false);
        }}
        data={selectedData}
        metric={metric}
        dailyKlines={dailyKlines}
        symbol={symbol}
        comparisonData={comparisonData}
        clearComparison={() => {
          setComparisonData(null);
          setIsComparing(false);
        }}
        onRequestComparison={(data) => {
          setComparisonData(data);
          setIsComparing(true);
        }}
      />
      <Snackbar
        open={!!alertData}
        autoHideDuration={5000}
        onClose={() => setAlertData(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {alertData && (
          <Alert
            onClose={() => setAlertData(null)}
            severity={
              alertData.type === 'volatility'
                ? 'warning'
                : 'error'
            }
            sx={{ width: '100%' }}
          >
            {alertData.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
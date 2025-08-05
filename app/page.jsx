"use client";

// React
import { useState } from 'react';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/material';

// Components
import FiltersPanel from '../components/Filters/FiltersPanel';
import CalendarView from '../components/Calendar/CalendarView';

export default function Home() {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('weekly');
  const [metric, setMetric] = useState('volatility');
  const [alertSettings, setAlertSettings] = useState({ volatility: 5, performance: -3 });

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <Container maxWidth="lg" sx={{ mt: 0, py: 4 }}>
      <Typography variant={isMobile ? "h4" : "h3"} marginBottom={6} fontWeight={'bold'} textAlign='center'>
        Market Seasonality Explorer
      </Typography>
      <FiltersPanel
        symbol={symbol}
        setSymbol={setSymbol}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        metric={metric}
        setMetric={setMetric}
        alertSettings={alertSettings}
        setAlertSettings={setAlertSettings}
      />
      <CalendarView
        symbol={symbol}
        timeframe={timeframe}
        metric={metric}
      />
    </Container>
  );
}
"use client";

// MUI
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// Context
import { useThemeContext } from '../../context/ThemeContext';

const ThemeSelector = () => {
  const { mode, setMode } = useThemeContext();

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel>Theme</InputLabel>
      <Select
        value={mode}
        label="Theme"
        onChange={(e) => setMode(e.target.value)}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="highContrast">High Contrast</MenuItem>
        <MenuItem value="colorBlind">Colorblind-Friendly</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function FiltersPanel({ symbol, setSymbol, timeframe, setTimeframe, metric, setMetric, alertSettings, setAlertSettings }) {
  return (
    <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Symbol</InputLabel>
        <Select
          value={symbol}
          label="Symbol"
          onChange={(e) => setSymbol(e.target.value)}
        >
          <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
          <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
          <MenuItem value="SOL/USDT">SOL/USDT</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Timeframe</InputLabel>
        <Select
          value={timeframe}
          label="Timeframe"
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Metric</InputLabel>
        <Select
          value={metric}
          label="Metric"
          onChange={(e) => setMetric(e.target.value)}
        >
          <MenuItem value="volatility">Volatility</MenuItem>
          <MenuItem value="liquidity">Liquidity</MenuItem>
          <MenuItem value="performance">Performance</MenuItem>
        </Select>
      </FormControl>

      <ThemeSelector/>

      <TextField
        label="Alert: Volatility >"
        size="small"
        type="number"
        inputProps={{ step: 0.1 }}
        value={alertSettings.volatility}
        onChange={(e) =>
          setAlertSettings((prev) => ({ ...prev, volatility: parseFloat(e.target.value) || 0 }))
        }
        sx={{
          width: 180
        }}
      />
      <TextField
        label="Alert: Performance <"
        size="small"
        type="number"
        inputProps={{ step: 0.1 }}
        value={alertSettings.performance}
        onChange={(e) =>
          setAlertSettings((prev) => ({ ...prev, performance: parseFloat(e.target.value) || 0 }))
        }
        sx={{
          width: 180
        }}
      />
    </Box>
  );
}
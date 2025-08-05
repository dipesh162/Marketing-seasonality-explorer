"use client";

// MUI
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper
} from '@mui/material';

// Context
import { useThemeContext } from '../../context/ThemeContext';

// Static dropdown options
const STATIC_OPTIONS = {
  symbol: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
  timeframe: ["daily", "weekly", "monthly"],
  metric: ["volatility", "liquidity", "performance"],
  theme: [
    { value: "default", label: "Default" },
    { value: "highContrast", label: "High Contrast" },
    { value: "colorBlind", label: "Colorblind-Friendly" }
  ]
};

// Shared styles
const formControlSx = { minWidth: 200 };
const selectSx = {
  backgroundColor: "#f9f9f9",
  fontWeight: 500,
  borderRadius: 1
};
const inputLabelSx = { fontWeight: "bold" };

const ThemeSelector = () => {
  const { mode, setMode } = useThemeContext();

  return (
    <FormControl size="small" sx={formControlSx}>
      <InputLabel sx={inputLabelSx}>Theme</InputLabel>
      <Select
        value={mode}
        label="Theme"
        onChange={(e) => setMode(e.target.value)}
        sx={selectSx}
      >
        {STATIC_OPTIONS.theme.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default function FiltersPanel({
  symbol,
  setSymbol,
  timeframe,
  setTimeframe,
  metric,
  setMetric,
  alertSettings,
  setAlertSettings
}) {
  return (
    <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" marginBottom={2}>
        Filter Options
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap" alignItems="center">
        {/* Symbol */}
        <FormControl size="small" sx={formControlSx}>
          <InputLabel sx={inputLabelSx}>Symbol</InputLabel>
          <Select
            value={symbol}
            label="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
            sx={selectSx}
          >
            {STATIC_OPTIONS.symbol.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Timeframe */}
        <FormControl size="small" sx={formControlSx}>
          <InputLabel sx={inputLabelSx}>Timeframe</InputLabel>
          <Select
            value={timeframe}
            label="Timeframe"
            onChange={(e) => setTimeframe(e.target.value)}
            sx={selectSx}
          >
            {STATIC_OPTIONS.timeframe.map((val) => (
              <MenuItem key={val} value={val}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Metric */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={inputLabelSx}>Metric</InputLabel>
          <Select
            value={metric}
            label="Metric"
            onChange={(e) => setMetric(e.target.value)}
            sx={selectSx}
          >
            {STATIC_OPTIONS.metric.map((val) => (
              <MenuItem key={val} value={val}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ThemeSelector />

        {/* Alert Volatility */}
        <TextField
          label="Alert: Volatility >"
          size="small"
          type="number"
          inputProps={{ step: 0.1 }}
          value={alertSettings.volatility}
          onChange={(e) =>
            setAlertSettings((prev) => ({
              ...prev,
              volatility: parseFloat(e.target.value) || 0
            }))
          }
          sx={{ ...formControlSx, ...selectSx }}
        />

        {/* Alert Performance */}
        <TextField
          label="Alert: Performance <"
          size="small"
          type="number"
          inputProps={{ step: 0.1 }}
          value={alertSettings.performance}
          onChange={(e) =>
            setAlertSettings((prev) => ({
              ...prev,
              performance: parseFloat(e.target.value) || 0
            }))
          }
          sx={{ ...formControlSx, ...selectSx }}
        />
      </Box>
    </Paper>
  );
}

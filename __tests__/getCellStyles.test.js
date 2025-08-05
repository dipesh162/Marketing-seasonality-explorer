import { getCellStyles } from '../components/Calendar/CalendarGrid';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

test('returns correct background color for low volatility', () => {
  const info = { volatility: 0.5 };
  const styles = getCellStyles({ metric: 'volatility', info, maxVolume: 100 }, theme);
  expect(styles.backgroundColor).toBe(theme.palette.success.light);
});

test('returns correct background color for performance > 0', () => {
  const info = { performance: 1.5 };
  const styles = getCellStyles({ metric: 'performance', info, maxVolume: 100 }, theme);
  expect(styles.backgroundColor).toBe(theme.palette.success.main);
});

test('returns liquidity background color and stripes', () => {
  const info = { volume: 90 };
  const styles = getCellStyles({ metric: 'liquidity', info, maxVolume: 100 }, theme);
  expect(styles.backgroundColor).toMatch(/rgb\(/);
});

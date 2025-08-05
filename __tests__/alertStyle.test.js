import { getCellAlertStyle } from '../components/Calendar/CalendarGrid';

const mockAlertSettings = {
  volatility: 2,   // threshold
  performance: -2  // threshold
};

test('returns orange border for high volatility', () => {
  const info = { volatility: 3, performance: 0 }; // performance present!
  const style = getCellAlertStyle({ info, alertSettings: mockAlertSettings });
  expect(style.border).toBe('2px solid orange');
});

test('returns red border for low performance', () => {
  const info = { performance: -5, volatility: 0 }; // volatility present!
  const style = getCellAlertStyle({ info, alertSettings: mockAlertSettings });
  expect(style.border).toBe('2px solid red');
});

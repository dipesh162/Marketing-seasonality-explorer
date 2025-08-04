import React from 'react';
import { render } from '@testing-library/react';
import CalendarGrid from '../components/Calender/CalendarGrid';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as CustomThemeProvider } from '../components/ThemeContext';

const theme = createTheme();

const dummyProps = {
  currentDate: new Date(),
  data: [],
  timeframe: 'monthly',
  metric: 'volatility',
  onCellClick: jest.fn(),
  focusedDate: new Date(),
  setFocusedDate: jest.fn(),
  dataByDate: {},
  rangeStart: null,
  rangeEnd: null,
  onRangeStart: jest.fn(),
  onRangeExtend: jest.fn(),
  onRangeEnd: jest.fn(),
  patternDates: new Set(),
};

beforeAll(() => {
  // Avoid scrollIntoView crash in jsdom
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

test('renders CalendarGrid component', () => {
  render(
    <MuiThemeProvider theme={theme}>
      <CustomThemeProvider>
        <CalendarGrid {...dummyProps} />
      </CustomThemeProvider>
    </MuiThemeProvider>
  );
});

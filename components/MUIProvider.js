// components/MUIProvider.js
"use client";

import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

export default function MUIProvider({ children }) {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

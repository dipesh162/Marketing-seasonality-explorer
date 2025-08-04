import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
  },
});

export const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    background: { default: '#000000', paper: '#121212' },
    text: { primary: '#ffffff' },
  },
});

export const colorBlindTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2b83ba' }, // blue-ish
    secondary: { main: '#abdda4' }, // green-ish
    background: { default: '#f7f7f7', paper: '#ffffff' },
  },
});

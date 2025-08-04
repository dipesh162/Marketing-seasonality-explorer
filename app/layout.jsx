import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import MUIProvider from '../components/MUIProvider';
import { ThemeModeProvider } from '../context/ThemeContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Market Seasonality Explorer',
  description: 'Interactive calendar for exploring crypto market seasonality',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeModeProvider>
          <MUIProvider>
            {children}
          </MUIProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}
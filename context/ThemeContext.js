"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { defaultTheme, highContrastTheme, colorBlindTheme } from "../lib/theme";

const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState("default");

  const theme = useMemo(() => {
    switch (mode) {
      case "highContrast":
        return highContrastTheme;
      case "colorBlind":
        return colorBlindTheme;
      default:
        return defaultTheme;
    }
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeModeContext);

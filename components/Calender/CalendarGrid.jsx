"use client";

// React
import React from 'react'

// Components
import WeeklyView from "./WeeklyView";
import MonthlyView from "./MonthlyView";
import DailyView from './DailyView';

// MUI
import { useMediaQuery, useTheme } from "@mui/material";

// Context
import { useThemeContext } from "../ThemeContext";

// Constants
import { DEFAULT_ALERTS } from "../../lib/alertConfig";

export function getCellStyles({ metric, info, maxVolume }, muiTheme) {
  const theme = muiTheme;
  const styles = {
    backgroundColor: theme.palette.background.paper,
    backgroundImage: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.85rem",
    color: theme.palette.text.primary,
    position: "relative",
    flexDirection: "column",
  };
  if (!info) return styles;

  const vol = info.volatility ?? info.avgVolatility;
  const perf = info.performance ?? info.avgPerformance;
  const volu = info.volume ?? info.totalVolume;
  const ratio = maxVolume ? Math.min(1, volu / maxVolume) : 0;

  if (metric === "volatility") {
    if (vol < 1) styles.backgroundColor = theme.palette.success.light;
    else if (vol < 2) styles.backgroundColor = theme.palette.warning.light;
    else styles.backgroundColor = theme.palette.error.light;
    styles.content = `\"${vol.toFixed(1)}\"`;
  } else if (metric === "performance") {
    if (perf > 0) styles.backgroundColor = theme.palette.success.main;
    else if (perf < 0) styles.backgroundColor = theme.palette.error.main;
    else styles.backgroundColor = theme.palette.grey[300];
    styles.content = `\"${perf.toFixed(1)}%\"`;
  } else if (metric === "liquidity") {
    const base = Math.floor(255 - ratio * 100);
    styles.backgroundColor = `rgb(${base}, ${base}, 255)`;
    if (ratio > 0.5) {
      const stripeWidth = ratio > 0.8 ? 4 : 8;
      styles.backgroundImage = `repeating-linear-gradient(45deg, rgba(0, 0, 150, 0.15) 0, rgba(0, 0, 150, 0.15) ${stripeWidth}px, transparent ${stripeWidth}px, transparent ${stripeWidth * 2}px)`;
    }
    styles.content = `\"${Math.round(volu / 1000)}K\"`;
  }

  styles.volumeCircle = {
    width: `${Math.max(10, ratio * 40)}px`,
    height: `${Math.max(10, ratio * 40)}px`,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    marginTop: 4,
  };

  styles.volumeBar = {
    width: `${ratio * 100}%`,
    height: "4px",
    backgroundColor: theme.palette.secondary.main,
    marginTop: 2,
  };

  return styles;
}

export function getCellAlertStyle({ info, alertSettings = DEFAULT_ALERTS }) {
  let borderColor = "transparent";
  if (!info) return { border: `2px solid ${borderColor}` };

  if (info.volatility > alertSettings.volatility) borderColor = "orange";
  if (info.performance < alertSettings.performance) borderColor = "red";

  return {
    border: `2px solid ${borderColor}`,
    boxShadow:
      borderColor !== "transparent" ? `0 0 8px ${borderColor}` : undefined,
    transition: "border 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  };
}

export default function CalendarGrid({
  currentDate,
  data,
  timeframe,
  metric,
  onCellClick,
  focusedDate,
  setFocusedDate,
  dataByDate,
  rangeStart,
  rangeEnd,
  onRangeStart,
  onRangeExtend,
  onRangeEnd,
  patternDates,
}) {
  const today = new Date();
  const theme = useThemeContext();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const viewProps = {
    currentDate,
    data,
    today,
    metric,
    onCellClick,
    focusedDate,
    setFocusedDate,
    rangeStart,
    rangeEnd,
    onRangeStart,
    onRangeExtend,
    onRangeEnd,
    getCellStyles,
    getCellAlertStyle,
    isMobile,
    patternDates,
    dataByDate,
  };

  if (timeframe === "daily") return <DailyView {...viewProps} />;
  if (timeframe === "weekly") return <WeeklyView {...viewProps} />;
  if (timeframe === "monthly") return <MonthlyView {...viewProps} />;

  return null;
}

// React
import React from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// MUI
import { Box, Tooltip, useTheme } from "@mui/material";

// Utils
import { DEFAULT_ALERTS } from "../../lib/alertConfig";

// Components
import RenderDayHeaders from "./WeekDaysLabels";

export default function MonthlyView({
  currentDate,
  dataByDate,
  metric,
  onCellClick,
  focusedDate,
  onRangeStart,
  onRangeExtend,
  onRangeEnd,
  getCellStyles,
  getAlertStyle,
  patternDates,
}) {
  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  const volumes = days.map((day) => dataByDate?.[format(day, "yyyy-MM-dd")]?.volume || 0);
  const maxVolume = Math.max(...volumes);
  const muiTheme = useTheme();

  return (
    <>
      <RenderDayHeaders />
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={1.5}
        sx={{ overflowX: "auto", minWidth: "600px" }}
      >
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const item = dataByDate?.[key];
          const isFocused = isSameDay(day, focusedDate);
          const isPatternDate = patternDates?.has(key);
          const styles = getCellStyles({ metric, info: item, maxVolume }, muiTheme);

          return (
            <Tooltip
              key={key}
              title={
                item ? (
                  <>
                    <div><strong>Date:</strong> {key}</div>
                    <div><strong>Volatility:</strong> {item.volatility?.toFixed(2)}</div>
                    <div><strong>Volume:</strong> {item.volume?.toFixed(0)}</div>
                    <div><strong>Performance:</strong> {item.performance?.toFixed(2)}</div>
                    {isPatternDate && (
                      <div style={{ marginTop: 6, fontStyle: 'italic', color: '#f39c12' }}>
                        Historical pattern detected
                      </div>
                    )}
                  </>
                ) : "No market data"
              }
            >
            <Box
              onMouseDown={() => onRangeStart?.(day)}
              onMouseEnter={() => onRangeExtend?.(day)}
              onMouseUp={() => onRangeEnd?.(day)}
              onClick={() => onCellClick?.({ ...item, label: key })}
              ref={(el) =>
                isFocused && el?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                borderRadius: 2,
                cursor: "pointer",
                outline: isFocused ? `2px solid ${muiTheme.palette.primary.main}` : undefined,
                borderStyle: isPatternDate ? 'dashed' : undefined,
                borderWidth: isPatternDate ? 2 : undefined,
                borderColor: isPatternDate ? '#f39c12' : undefined,
                ...styles,
                ...getAlertStyle?.({ info: item, alertSettings: DEFAULT_ALERTS }),
                width: 150,
                height: 118,
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  left: 10,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {format(day, 'd')}
              </Box>
              {styles?.content}
              <Box sx={styles?.volumeCircle} />
              <Box sx={styles?.volumeBar} />
            </Box>

            </Tooltip>
          );
        })}
      </Box>
    </>
  );
}

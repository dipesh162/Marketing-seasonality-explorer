// React
import {
  format,
  isSameDay,
} from "date-fns";
import React from 'react';

// MUI
import { Box, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Constants
import { DEFAULT_ALERTS } from "../../lib/alertConfig";

export default function DailyView({ 
  currentDate,
  data,
  metric,
  onCellClick,
  focusedDate,
  rangeStart,
  rangeEnd,
  onRangeStart,
  onRangeExtend,
  getCellStyles,
  getAlertStyle,
  patternDates,
}) {
  const muiTheme = useTheme();
  const key = format(currentDate, "yyyy-MM-dd");
  const info = data?.[key];
  const isFocused = isSameDay(currentDate, focusedDate);
  const styles = getCellStyles({ metric, info, maxVolume: info?.volume }, muiTheme);
  const isPatternDate = patternDates?.has(key);

  return (
    <>
      <Typography variant="caption" component='div' fontSize={18} fontWeight="bold" mb={1} textAlign="center">
        {format(currentDate, "EEE")}
      </Typography>
      <Box display="flex" justifyContent="center">
        <Tooltip
          title={
            info ? (
              <>
                <div><strong>Date:</strong> {key}</div>
                <div><strong>Volatility:</strong> {info.volatility?.toFixed(2)}</div>
                <div><strong>Volume:</strong> {info.volume?.toFixed(0)}</div>
                <div><strong>Performance:</strong> {info.performance?.toFixed(2)}</div>
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
          onMouseDown={() => onRangeStart?.(currentDate)}
          onMouseEnter={() => onRangeExtend?.(currentDate)}
          onClick={() => onCellClick?.({ ...info, label: key })}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: 2,
            cursor: "pointer",
            outline: isFocused ? `2px solid ${muiTheme.palette.primary.main}` : undefined,
            borderStyle: isPatternDate ? 'dashed' : undefined,
            borderWidth: isPatternDate ? 2 : undefined,
            borderColor: isPatternDate ? '#f39c12' : undefined,
            ...styles,
            ...getAlertStyle?.({ info, alertSettings: DEFAULT_ALERTS }),
            width: 150,
            height: 118,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Typography
            variant="caption"
            sx={{
                  position: 'absolute',
                  top: 6,
                  left: 10,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
            }}
          >
            {format(currentDate, 'd')}
          </Typography>
          {styles?.content}
            <Box sx={styles?.volumeCircle} />
            <Box sx={styles?.volumeBar} />
        </Box>

        </Tooltip>
      </Box>
    </>
  );
}

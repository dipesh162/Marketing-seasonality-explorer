// React
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import React from 'react';

// MUI
import { Box, Tooltip, Typography, useTheme } from "@mui/material";


export default function WeeklyView({
  data,
  metric,
  onCellClick,
  getCellStyles,
  getCellAlertStyle,
  isMobile,
  patternDates,
}) {
  const weeks = Array.isArray(data) ? data : [];
  if (!weeks.length) return null;
  const maxVolume = Math.max(...weeks.map((w) => w.totalVolume || 0));
  const muiTheme = useTheme();

  return (
    <>
      <Box display="flex" gap={1} mb={1}>
        {weeks.map((week) => (
          <Typography
            key={week.key}
            variant="caption"
            textAlign="center"
            sx={{ flex: 1, fontWeight: "bold" }}
          >
            {week.key}
          </Typography>
        ))}
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${weeks.length}, 1fr)`}
        gap={1}
        sx={{ overflowX: "auto", minWidth: "600px" }}
      >
        {weeks.map((week) => {
          const isPatternDate = patternDates?.has(week.key);

          const info = {
            volatility: week.avgVolatility,
            avgVolatility: week.avgVolatility,
            performance: week.avgPerformance,
            avgPerformance: week.avgPerformance,
            volume: week.totalVolume,
            totalVolume: week.totalVolume,
          };

          const styles = {
            ...getCellStyles({ metric, info, maxVolume }, muiTheme),
            ...getCellAlertStyle({ info }),
            borderRadius: 2,
            height: 150,
            padding: isMobile ? 0.5 : 1,
            cursor: "pointer",
            border: "1px solid #ccc",
          };

          const normalizedVolume = maxVolume
            ? week.totalVolume / maxVolume
            : 0;

          return (
            <Tooltip
              key={week.key}
              title={
                <>
                  <div><strong>Week:</strong> {week.key}</div>
                  <div><strong>Avg. Volatility:</strong> {week.avgVolatility.toFixed(2)}</div>
                  <div><strong>Avg. Performance:</strong> {week.avgPerformance.toFixed(2)}</div>
                  <div><strong>Total Volume:</strong> {week.totalVolume.toFixed(0)}</div>
                  <div><strong>Min Volatility:</strong> {week.minVolatility.toFixed(2)}</div>
                  <div><strong>Max Volatility:</strong> {week.maxVolatility.toFixed(2)}</div>
                  <div><strong>Std Dev (close):</strong> {week.stdDev.toFixed(2)}</div>
                  {isPatternDate && (
                    <div style={{ marginTop: 6, fontStyle: 'italic', color: '#f39c12' }}>
                      Historical pattern detected
                    </div>
                  )}
                </>
              }
            >
              <Box sx={styles} onClick={() => onCellClick({ ...week })}>
                {/* Performance indicator */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="caption">
                    {week.avgPerformance.toFixed(2)}
                  </Typography>
                  {week.avgPerformance > 0 && (
                    <Typography variant="caption" color="green">▲</Typography>
                  )}
                  {week.avgPerformance < 0 && (
                    <Typography variant="caption" color="red">▼</Typography>
                  )}
                  {week.avgPerformance === 0 && (
                    <Typography variant="caption" color="gray">–</Typography>
                  )}
                </Box>

                {/* Liquidity indicator circle */}
                <Box
                  sx={{
                    width: `${Math.min(100, Math.max(10, normalizedVolume * 100))}px`,
                    height: `${Math.min(100, Math.max(10, normalizedVolume * 100))}px`,
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                    mx: "auto",
                    my: 1,
                  }}
                />

                {/* Mini bar chart */}
                <Box width="100%" height={30}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ volume: normalizedVolume * 100 }]}>
                      <XAxis hide dataKey="volume" />
                      <Bar dataKey="volume" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </>
  );
}

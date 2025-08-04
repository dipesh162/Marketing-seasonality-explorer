"use client";

// React
import React from 'react';

// MUI
import { Box, Typography } from '@mui/material';

// React
import { eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns';

/**
 * Renders a row of weekday abbreviations (Mon, Tue, …) for weekly/monthly views.
 */
export default function RenderDayHeaders() {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={1}>
      {days.map((day) => (
        <Typography key={day.toISOString()} variant="caption" textAlign="center" fontWeight="bold">
          {format(day, 'EEE')}
        </Typography>
      ))}
    </Box>
  );
}
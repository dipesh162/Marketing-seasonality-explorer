"use client";

// React
import { format, startOfWeek, endOfWeek, isSameMonth, isSameWeek } from 'date-fns';

// MUI
import { Typography, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const arrowBtnStyles = {
  border: '1px solid gainsboro',
  background: 'white',
  '& svg':{
    fontSize: 30
  }
}

export default function CalendarHeader({ currentDate, onPrev, onNext, timeframe }) {
  let label;

  if (timeframe === 'daily') {
    label = format(currentDate, 'd MMM yyyy');
  } else if (timeframe === 'weekly') {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const sameMonth = isSameMonth(start, end);
    if (sameMonth) {
      // Example: 1–7 Jan 2025
      label = `${format(start, 'd')}–${format(end, 'd MMM yyyy')}`;
    } else {
      // Example: 30 Dec 2024 – 5 Jan 2025
      label = `${format(start, 'd MMM yyyy')} – ${format(end, 'd MMM yyyy')}`;
    }
  } else {
    // monthly
    label = format(currentDate, 'MMMM yyyy');
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={4.5}>
      <IconButton aria-label="Previous period" onClick={onPrev} sx={arrowBtnStyles}><ChevronLeft /></IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontSize: 22, fontWeight: 600 }}>{label}</Typography>
      <IconButton aria-label="Next period" onClick={onNext} sx={arrowBtnStyles}><ChevronRight /></IconButton>
    </Box>
  );
}
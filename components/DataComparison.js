// MUI
import { Box, Typography, Divider } from '@mui/material';

export default function DataComparison({ dataA, dataB, labelA = "Period A", labelB = "Period B" }) {
  if (!dataA || !dataB) return null;

  const metrics = ["volatility", "performance", "volume"];

  return (
    <Box mt={4}>
      <Typography variant="h6">Data Comparison</Typography>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" gap={4}>
        <Box flex={1}>
          <Typography variant="subtitle1">{labelA}</Typography>
          {metrics.map((m) => (
            <Typography key={m}>{m}: {dataA[m]?.toFixed(2)}</Typography>
          ))}
        </Box>
        <Box flex={1}>
          <Typography variant="subtitle1">{labelB}</Typography>
          {metrics.map((m) => (
            <Typography key={m}>{m}: {dataB[m]?.toFixed(2)}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
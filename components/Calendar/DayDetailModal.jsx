// React
import { parseISO } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";

// Components
import DataComparison from "../DataComparison";

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
  textTransform: "unset",
};

const exportAsImage = (symbol, label) => {
  const modalContent = document.getElementById("export-content");
  if (!modalContent) return;

  html2canvas(modalContent).then((canvas) => {
    const link = document.createElement("a");
    link.download = `market-data-${symbol.replace("/", "-")}-${label}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
};

const exportAsPDF = (symbol, label) => {
  const modalContent = document.getElementById("export-content");
  if (!modalContent) return;

  html2canvas(modalContent).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`market-data-${symbol.replace("/", "-")}-${label}.pdf`);
  });
};

function exportToCSV(data, symbol, label) {
  const rows = [
    ["Symbol", symbol],
    ["Date/Period", label],
    ["Open", data.open ?? "—"],
    ["Close", data.close ?? "—"],
    ["High", data.high ?? "—"],
    ["Low", data.low ?? "—"],
    ["Volatility", (data.volatility ?? data.avgVolatility)?.toFixed(2)],
    [
      "Performance",
      (data.performance ?? data.avgPerformance)?.toFixed(2) + "%",
    ],
    ["Volume", (data.volume ?? data.totalVolume)?.toLocaleString()],
    ["SMA-7", data.sma7 ?? "—"],
    ["SMA-14", data.sma14 ?? "—"],
    ["RSI", data.rsi ?? "—"],
  ];

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `market-data-${symbol.replace("/", "-")}-${label}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DayDetailModal({
  open,
  onClose,
  data,
  metric,
  dailyKlines,
  symbol,
  comparisonData,
  clearComparison,
  onRequestComparison,
}) {
  if (!data) return null;

  const {
    label,
    volatility,
    performance,
    volume,
    open: openPrice,
    close,
    high,
    low,
    avgVolatility,
    avgPerformance,
    totalVolume,
    minVolatility,
    maxVolatility,
    stdDev,
  } = data;

  let klinesInRange = [];

  if (dailyKlines && label.includes("–")) {
    const [startStr, endStr] = label.split("–");
    const startDate = parseISO(startStr);
    const endDate = parseISO(endStr);
    const allKlines = Object.values(dailyKlines);
    klinesInRange = allKlines.filter(
      (k) => new Date(k.date) >= startDate && new Date(k.date) <= endDate
    );
  }

  const prices = klinesInRange.map((k) => k.close);
  const sma7 =
    prices.slice(-7).reduce((sum, p) => sum + p, 0) /
      Math.min(7, prices.length) || 0;
  const sma14 =
    prices.slice(-14).reduce((sum, p) => sum + p, 0) /
      Math.min(14, prices.length) || 0;

  let gains = 0,
    losses = 0;
  for (let i = 1; i < prices.length; i++) {
    const delta = prices[i] - prices[i - 1];
    if (delta >= 0) gains += delta;
    else losses += -delta;
  }
  const avgGain = gains / prices.length || 0;
  const avgLoss = losses / prices.length || 0;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  data.sma7 = sma7.toFixed(2);
  data.sma14 = sma14.toFixed(2);
  data.rsi = rsi.toFixed(2);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: 'fit-content', 
        },
      }}
      id="export-content"
    >
      <DialogTitle>
        Detailed Analysis – {symbol} ({label})
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Price Metrics:
          </Typography>
          <Box mb={2}>
            <Typography>Open: {openPrice ?? "—"}</Typography>
            <Typography>Close: {close ?? "—"}</Typography>
            <Typography>High: {high ?? "—"}</Typography>
            <Typography>Low: {low ?? "—"}</Typography>
          </Box>

          <Divider />

          <Typography variant="subtitle1" gutterBottom>
            Volatility & Performance:
          </Typography>
          <Box mb={2}>
            <Typography>
              Volatility: {(volatility ?? avgVolatility)?.toFixed(2)}
            </Typography>
            <Typography>
              Performance: {(performance ?? avgPerformance)?.toFixed(2)}%
            </Typography>
            <Typography>
              Volume: {(volume ?? totalVolume)?.toLocaleString()}
            </Typography>
            {stdDev && (
              <Typography>Std Dev (Volatility): {stdDev.toFixed(2)}</Typography>
            )}
            {minVolatility && (
              <Typography>
                Min Volatility: {minVolatility.toFixed(2)}
              </Typography>
            )}
            {maxVolatility && (
              <Typography>
                Max Volatility: {maxVolatility.toFixed(2)}
              </Typography>
            )}
          </Box>

          <Divider />

          <Typography variant="subtitle1" gutterBottom>
            Technical Indicators:
          </Typography>
          <Box mb={2}>
            <Typography>SMA-7: {sma7.toFixed(2)}</Typography>
            <Typography>SMA-14: {sma14.toFixed(2)}</Typography>
            <Typography>RSI: {rsi.toFixed(2)}</Typography>
          </Box>

          <Box
            textAlign="right"
            mt={2}
            display="flex"
            gap={1}
            justifyContent="flex-end"
          >
            {comparisonData ? (
              <Button onClick={clearComparison}>Clear Comparison</Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  onRequestComparison(data); // Moved to CalendarView
                  onClose();
                }}
                style={buttonStyle}
              >
                Compare with Another Period
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => exportToCSV(data, symbol, label)}
              style={buttonStyle}
            >
              Export as CSV
            </Button>
            <Button
              variant="primary"
              onClick={() => exportAsPDF(symbol, label)}
              style={buttonStyle}
            >
              Export as PDF
            </Button>
            <Button
              variant="primary"
              onClick={() => exportAsImage(symbol, label)}
              style={buttonStyle}
            >
              Export as Image
            </Button>
          </Box>

          {/* Comparison Panel */}
          {comparisonData && (
            <DataComparison
              dataA={comparisonData}
              dataB={data}
              labelA={comparisonData.label}
              labelB={data.label}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing alerts on threshold values
import { useEffect } from 'react';

export default function useAlertSystem(data, thresholds = {}) {
  useEffect(() => {
    if (!data) return;

    const alerts = [];
    if (thresholds.volatility && data.volatility > thresholds.volatility) {
      alerts.push(`Volatility exceeds ${thresholds.volatility}`);
    }
    if (thresholds.performance && data.performance < thresholds.performance) {
      alerts.push(`Performance below ${thresholds.performance}`);
    }

    if (alerts.length > 0) {
      alert(alerts.join("\n"));
    }
  }, [data, thresholds]);
}
import type { SensorDataPoint } from '../types/digitalTwin';

export function exportTelemetryToCSV(history: SensorDataPoint[], filename = 'digital_twin_telemetry.csv') {
  if (!history || history.length === 0) return;

  const headers = ['Timestamp', 'Temperature (°C)', 'Vibration (mm/s)', 'Pressure (kPa)', 'RPM', 'Voltage (V)', 'Current (A)', 'Humidity (%)'];
  const rows = history.map(point => [
    point.timestamp,
    point.temperature.toFixed(2),
    point.vibration.toFixed(2),
    point.pressure.toFixed(2),
    Math.round(point.rpm),
    point.voltage.toFixed(2),
    point.current.toFixed(2),
    point.humidity.toFixed(1)
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { exportTelemetryToCSV } from '../utils/exportUtils';
import { Database, Download, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const HistoricalDataView: React.FC = () => {
  const { sensorHistory } = useDigitalTwin();
  const [selectedSensor, setSelectedSensor] = useState<'temperature' | 'vibration' | 'pressure' | 'rpm'>('temperature');

  const handleExportCSV = () => {
    exportTelemetryToCSV(sensorHistory);
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono">Historical Telemetry & Log Archives</h2>
          <p className="text-xs text-slate-400 font-mono">Recorded sensor buffer & operational event logs</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-lg glow-cyan flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV DATA</span>
        </button>
      </div>

      {/* Historical Chart Display */}
      <div className="glass-panel p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase">HISTORICAL SENSOR PARAMETER TREND</h3>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {(['temperature', 'vibration', 'pressure', 'rpm'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSelectedSensor(s)}
                className={`px-3 py-1 rounded capitalize transition-all ${
                  selectedSensor === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensorHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey={selectedSensor}
                stroke={selectedSensor === 'temperature' ? '#ef4444' : selectedSensor === 'vibration' ? '#f59e0b' : selectedSensor === 'pressure' ? '#38bdf8' : '#10b981'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Telemetry Log Table */}
      <div className="glass-panel p-5 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>RECENT TELEMETRY SAMPLES LOG</span>
        </h3>

        <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Temperature (°C)</th>
                <th className="p-2.5">Vibration (mm/s)</th>
                <th className="p-2.5">Pressure (kPa)</th>
                <th className="p-2.5">RPM</th>
                <th className="p-2.5">Voltage (V)</th>
                <th className="p-2.5">Current (A)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sensorHistory.slice().reverse().map((pt, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-2.5 text-slate-400">{pt.timestamp}</td>
                  <td className="p-2.5 font-bold text-rose-400">{pt.temperature.toFixed(1)}</td>
                  <td className="p-2.5 font-bold text-amber-400">{pt.vibration.toFixed(2)}</td>
                  <td className="p-2.5 font-bold text-cyan-400">{pt.pressure.toFixed(1)}</td>
                  <td className="p-2.5 font-bold text-emerald-400">{Math.round(pt.rpm)}</td>
                  <td className="p-2.5 text-slate-300">{pt.voltage.toFixed(1)}</td>
                  <td className="p-2.5 text-slate-300">{pt.current.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

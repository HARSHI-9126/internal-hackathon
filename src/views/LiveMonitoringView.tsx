import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { SENSOR_THRESHOLDS } from '../utils/aiEngine';
import {
  Activity,
  Thermometer,
  Gauge,
  Zap,
  Wind,
  Play,
  Pause,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const LiveMonitoringView: React.FC = () => {
  const {
    sensors,
    sensorHistory,
    isLivePaused,
    togglePauseLive,
    clearHistory
  } = useDigitalTwin();

  const [activeTab, setActiveTab] = useState<'all' | 'temp' | 'vib' | 'press' | 'rpm' | 'current'>('all');
  const [timeRange, setTimeRange] = useState<number>(60); // latest 60 points

  const displayedHistory = sensorHistory.slice(-timeRange);

  const getStatus = (val: number, min: number, max: number, critical: number) => {
    if (val > critical) return 'CRITICAL';
    if (val > max || val < min) return 'ELEVATED';
    return 'NOMINAL';
  };

  const sensorCards = [
    {
      id: 'temp',
      name: 'Temperature',
      val: `${sensors.temperature.toFixed(1)} °C`,
      range: '65.0 - 75.0 °C',
      status: getStatus(sensors.temperature, 65, 75, SENSOR_THRESHOLDS.temperature.critical),
      icon: <Thermometer className="w-5 h-5 text-rose-400" />,
      color: '#ef4444'
    },
    {
      id: 'vib',
      name: 'Vibration',
      val: `${sensors.vibration.toFixed(2)} mm/s`,
      range: '2.0 - 4.0 mm/s',
      status: getStatus(sensors.vibration, 2, 4, SENSOR_THRESHOLDS.vibration.critical),
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: '#f59e0b'
    },
    {
      id: 'press',
      name: 'Pressure',
      val: `${sensors.pressure.toFixed(1)} kPa`,
      range: '95.0 - 105.0 kPa',
      status: getStatus(sensors.pressure, 95, 105, SENSOR_THRESHOLDS.pressure.critical),
      icon: <Gauge className="w-5 h-5 text-cyan-400" />,
      color: '#38bdf8'
    },
    {
      id: 'rpm',
      name: 'RPM Speed',
      val: `${Math.round(sensors.rpm)} RPM`,
      range: '2800 - 3300 RPM',
      status: getStatus(sensors.rpm, 2800, 3300, 3800),
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      color: '#10b981'
    },
    {
      id: 'volt',
      name: 'Voltage',
      val: `${sensors.voltage.toFixed(1)} V`,
      range: '23.0 - 25.0 V',
      status: getStatus(sensors.voltage, 23, 25, 26),
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      color: '#a855f7'
    },
    {
      id: 'curr',
      name: 'Current',
      val: `${sensors.current.toFixed(1)} A`,
      range: '7.5 - 9.5 A',
      status: getStatus(sensors.current, 7.5, 9.5, 13.5),
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      color: '#3b82f6'
    },
    {
      id: 'hum',
      name: 'Humidity',
      val: `${sensors.humidity.toFixed(1)} %`,
      range: '45.0 - 65.0 %',
      status: getStatus(sensors.humidity, 45, 65, 85),
      icon: <Wind className="w-5 h-5 text-teal-400" />,
      color: '#14b8a6'
    }
  ];

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Control Toolbar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono">Real-Time Sensor Monitoring</h2>
          <p className="text-xs text-slate-400 font-mono">Updating every 1.2s • Live telemetry stream</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Pause/Resume button */}
          <button
            onClick={togglePauseLive}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center space-x-2 transition-all ${
              isLivePaused
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isLivePaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isLivePaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
          </button>

          {/* Clear button */}
          <button
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR HISTORY</span>
          </button>

          {/* Time range selector */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-2" />
            {[30, 60, 100].map(points => (
              <button
                key={points}
                onClick={() => setTimeRange(points)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                  timeRange === points ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                {points}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7 Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {sensorCards.map(s => (
          <div key={s.id} className="glass-panel p-3 bg-slate-900/80 border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">{s.name}</span>
              {s.icon}
            </div>

            <div className="text-xl font-bold font-mono text-white tracking-tight">{s.val}</div>

            <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">{s.range}</span>
              <span className={`font-semibold ${s.status === 'CRITICAL' ? 'text-rose-400 animate-pulse' : s.status === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Chart Tabs & Display */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase">
              REAL-TIME SENSOR TIME-SERIES VISUALIZATION
            </h3>
          </div>

          {/* Chart Filter Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {[
              { id: 'all', label: 'Overview' },
              { id: 'temp', label: 'Temperature' },
              { id: 'vib', label: 'Vibration' },
              { id: 'press', label: 'Pressure' },
              { id: 'rpm', label: 'RPM' },
              { id: 'current', label: 'Current' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Live Chart Canvas */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayedHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />

              {(activeTab === 'all' || activeTab === 'temp') && (
                <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#ef4444" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
              {(activeTab === 'all' || activeTab === 'vib') && (
                <Line type="monotone" dataKey="vibration" name="Vibration (mm/s)" stroke="#f59e0b" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
              {(activeTab === 'all' || activeTab === 'press') && (
                <Line type="monotone" dataKey="pressure" name="Pressure (kPa)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              )}
              {(activeTab === 'all' || activeTab === 'rpm') && (
                <Line type="monotone" dataKey="rpm" name="RPM Speed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              )}
              {activeTab === 'current' && (
                <Line type="monotone" dataKey="current" name="Current (A)" stroke="#3b82f6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

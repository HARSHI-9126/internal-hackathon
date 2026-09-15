import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { SENSOR_THRESHOLDS } from '../utils/aiEngine';
import { Sliders, Shield, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { systemMetadata } = useDigitalTwin();

  const [saved, setSaved] = useState(false);
  const [sampleRate, setSampleRate] = useState(1200);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn font-mono">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">System Settings & Calibration Thresholds</h2>
          <p className="text-xs text-slate-400">Configure telemetry limits, AI model parameters & metadata</p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>SETTINGS SAVED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Sensor Thresholds Configuration */}
        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>SENSOR ALARM & CRITICAL THRESHOLDS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="text-slate-300 font-bold block">TEMPERATURE WARNING / CRITICAL LIMIT (°C)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" defaultValue={SENSOR_THRESHOLDS.temperature.warning} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
                <input type="number" defaultValue={SENSOR_THRESHOLDS.temperature.critical} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-rose-400 font-bold" />
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="text-slate-300 font-bold block">VIBRATION WARNING / CRITICAL LIMIT (mm/s)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.1" defaultValue={SENSOR_THRESHOLDS.vibration.warning} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
                <input type="number" step="0.1" defaultValue={SENSOR_THRESHOLDS.vibration.critical} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-rose-400 font-bold" />
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="text-slate-300 font-bold block">PRESSURE OPERATING LIMITS (kPa)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" defaultValue={SENSOR_THRESHOLDS.pressure.min} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
                <input type="number" defaultValue={SENSOR_THRESHOLDS.pressure.max} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="text-slate-300 font-bold block">ROTOR SPEED LIMITS (RPM)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" defaultValue={SENSOR_THRESHOLDS.rpm.min} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
                <input type="number" defaultValue={SENSOR_THRESHOLDS.rpm.max} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* System Metadata */}
        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>SYSTEM IDENTIFICATION & METADATA</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">SYSTEM NAME</label>
              <input type="text" readOnly value={systemMetadata.systemName} className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-300" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">SYSTEM ID</label>
              <input type="text" readOnly value={systemMetadata.systemId} className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-300" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">TELEMETRY SAMPLE RATE</label>
              <select value={sampleRate} onChange={e => setSampleRate(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white">
                <option value={1000}>1.0 Second</option>
                <option value={1200}>1.2 Seconds (Default)</option>
                <option value={2000}>2.0 Seconds</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg glow-cyan flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};

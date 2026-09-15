import React from 'react';
import type { ComponentMetric } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import { X, Activity, Thermometer, Gauge, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface ComponentDetailModalProps {
  component: ComponentMetric | null;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({ component, onClose }) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-mono">{component.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{component.location} ({component.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Health & Status Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Health Score</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{component.health}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Status</div>
              <div className="mt-1">
                <StatusBadge status={component.status} size="sm" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Fault Risk</div>
              <div className={`text-xl font-bold font-mono mt-0.5 ${component.faultProbability > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {component.faultProbability}%
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 font-mono bg-slate-900/40 p-3 rounded border border-slate-800/60">
            {component.description}
          </p>

          {/* Realtime Telemetry Parameters Grid */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              LIVE SENSOR TELEMETRY
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <span>Temperature</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{component.temperature.toFixed(1)} °C</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Vibration</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{component.vibration.toFixed(2)} mm/s</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>Pressure</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{component.pressure.toFixed(1)} kPa</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Rotor RPM</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{Math.round(component.rpm)} RPM</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Current Draw</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{component.current.toFixed(1)} A</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>RUL Projection</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{component.rulHours} hrs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold"
          >
            CLOSE TELEMETRY
          </button>
        </div>
      </div>
    </div>
  );
};

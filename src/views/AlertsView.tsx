import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { StatusBadge } from '../components/common/StatusBadge';
import type { AlertSeverity } from '../types/digitalTwin';
import { Bell, Check, Trash2, Filter, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, clearAllAlerts } = useDigitalTwin();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');

  const filteredAlerts = alerts.filter(a => severityFilter === 'ALL' || a.severity === severityFilter);

  const getSeverityIcon = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn font-mono">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">System Alerts & Alarm Management</h2>
          <p className="text-xs text-slate-400">Real-time threshold violation & anomaly triggers</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Severity Filter Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-2" />
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={clearAllAlerts}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR ALL</span>
          </button>
        </div>
      </div>

      {/* Alert Feed Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-500 space-y-2">
            <Bell className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">NO ALERTS FOUND FOR CURRENT FILTER</p>
          </div>
        ) : (
          filteredAlerts.map(alt => (
            <div
              key={alt.id}
              className={`glass-panel p-4 border transition-all ${
                alt.acknowledged
                  ? 'opacity-60 bg-slate-900/40 border-slate-800'
                  : alt.severity === 'CRITICAL'
                  ? 'bg-rose-500/10 border-rose-500/40 glow-red'
                  : alt.severity === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/40 glow-amber'
                  : 'bg-cyan-500/10 border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5 mb-2.5">
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(alt.severity)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{alt.componentName}</span>
                      <StatusBadge status={alt.severity} size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400">Sensor: {alt.sensorName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Timestamp: <strong className="text-slate-200">{alt.timestamp}</strong></span>
                  {!alt.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ACKNOWLEDGE</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ACKNOWLEDGED
                    </span>
                  )}
                </div>
              </div>

              {/* Alert Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">MEASURED VS THRESHOLD</span>
                  <span className="font-bold text-slate-200">{alt.currentValue}</span>
                  <span className="text-slate-400 text-[10px] ml-2">(Limit: {alt.thresholdValue})</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800/80 md:col-span-2">
                  <span className="text-[10px] text-slate-400 block">RECOMMENDED ENGINEERING ACTION</span>
                  <span className="font-bold text-amber-300">{alt.recommendedAction}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

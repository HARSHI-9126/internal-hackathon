import React from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { BrainCircuit, Wrench, Lightbulb, UserCheck } from 'lucide-react';

export const AiInsightsView: React.FC = () => {
  const { aiInsights, maintenanceRecommendations } = useDigitalTwin();

  return (
    <div className="space-y-6 pb-8 animate-fadeIn font-mono">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              SYNTHETIC TELEMETRY REASONING
            </span>
            <span className="text-xs text-slate-400 font-mono">Automated LLM / Rule Diagnostics</span>
          </div>
          <h2 className="text-lg font-bold text-white font-mono mt-1">
            AI Insights & Engineering Maintenance Recommendations
          </h2>
        </div>
      </div>

      {/* Grid: AI Natural Language Insights */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span>AUTOMATED NATURAL-LANGUAGE DIAGNOSTIC SUMMARY</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map(ins => (
            <div
              key={ins.id}
              className={`p-4 rounded-xl border space-y-2 transition-all ${
                ins.impactLevel === 'HIGH'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  {ins.title}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${ins.impactLevel === 'HIGH' ? 'bg-rose-500/30 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                  {ins.impactLevel} IMPACT
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                <span>Category: {ins.category}</span>
                <span>{ins.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Recommendations Section */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>ACTIONABLE MAINTENANCE WORK ORDERS & RECOMMENDATIONS</span>
          </h3>

          <div className="flex items-center space-x-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>REQUIRES QUALIFIED PERSONNEL VERIFICATION</span>
          </div>
        </div>

        <div className="space-y-3">
          {maintenanceRecommendations.map(rec => (
            <div key={rec.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">{rec.componentName}</span>
                  <span className="text-[10px] text-slate-500">({rec.componentId})</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${rec.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : rec.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                  PRIORITY: {rec.priority}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">IDENTIFIED DIAGNOSTIC REASON</span>
                  <span className="text-slate-200">{rec.reason}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-[10px] text-cyan-400 block mb-1">ENGINEERING RECOMMENDATION</span>
                  <span className="text-cyan-300 font-semibold">{rec.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

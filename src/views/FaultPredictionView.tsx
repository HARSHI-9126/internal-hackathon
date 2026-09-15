import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  BrainCircuit,
  FileText,
  X,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const FaultPredictionView: React.FC = () => {
  const { faultPrediction } = useDigitalTwin();
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const factorChartData = faultPrediction.contributingFactors.map(f => ({
    name: f.factor.split(' ')[0],
    fullFactor: f.factor,
    impactPercent: f.impactPercent,
    trend: f.trend
  }));

  return (
    <div className="space-y-6 pb-8 animate-fadeIn font-mono">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              PROGNOSTIC HEALTH MANAGEMENT (PHM)
            </span>
            <span className="text-xs text-slate-400 font-mono">Simulated Machine Learning Anomaly Classifier</span>
          </div>
          <h2 className="text-lg font-bold text-white font-mono mt-1">
            AI Fault Prediction & Explainable AI (XAI) Diagnostics
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span className="text-slate-400">MODEL CONFIDENCE:</span>
          <span className="font-bold text-purple-300">{faultPrediction.confidencePercent}%</span>
        </div>
      </div>

      {/* Primary Fault Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-4 bg-slate-900/80 border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 uppercase">PREDICTED FAULT MODE</div>
          <div className="text-base font-bold text-white mt-1">{faultPrediction.predictedFault}</div>
          <div className="text-[10px] text-slate-400 mt-2">Target Component: {faultPrediction.componentName}</div>
        </div>

        <div className="glass-panel p-4 bg-slate-900/80 border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 uppercase">FAULT PROBABILITY</div>
          <div className={`text-2xl font-bold mt-1 ${faultPrediction.probability > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
            {faultPrediction.probability}%
          </div>
          <div className="text-[10px] text-slate-400 mt-2">Threshold: 25.0%</div>
        </div>

        <div className="glass-panel p-4 bg-slate-900/80 border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 uppercase">SEVERITY RATING</div>
          <div className="mt-1">
            <StatusBadge status={faultPrediction.severity === 'CRITICAL' ? 'CRITICAL' : faultPrediction.severity === 'HIGH' ? 'WARNING' : 'NORMAL'} />
          </div>
          <div className="text-[10px] text-slate-400 mt-2">Risk Level: {faultPrediction.severity}</div>
        </div>

        <div className="glass-panel p-4 bg-slate-900/80 border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 uppercase">ESTIMATED TIME TO FAILURE</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{faultPrediction.estimatedTimeToFailureHours} hrs</div>
          <div className="text-[10px] text-slate-400 mt-2">Based on current degradation rate</div>
        </div>
      </div>

      {/* EXPLAINABLE AI (XAI) SECTION */}
      <div className="glass-panel p-6 space-y-6 border-purple-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              EXPLAINABLE AI (XAI) - FEATURE ATTRIBUTION & RATIONALE
            </h3>
          </div>

          <button
            onClick={() => setShowEvidenceModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>VIEW SENSOR EVIDENCE</span>
          </button>
        </div>

        {/* Natural Language Explanation Box */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
          <div className="text-xs text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>WHY WAS THIS FAULT PREDICTED?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {faultPrediction.explanation}
          </p>
        </div>

        {/* Feature Contribution Breakdown Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            FEATURE CONTRIBUTION BREAKDOWN (% IMPACT TO ANOMALY SCORE)
          </h4>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`+${val}%`, 'Feature Impact']}
                />
                <Bar dataKey="impactPercent" fill="#a855f7" radius={[0, 6, 6, 0]}>
                  {factorChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contributing Factors Detail Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {faultPrediction.contributingFactors.map((f, i) => (
            <div key={i} className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{f.factor}</span>
                <span className="text-rose-400 font-bold">+{f.impactPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl p-6 space-y-5 font-mono glass-panel">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">SENSOR EVIDENCE TRACE LOG</h3>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Empirical evidence collected by on-board transducers justifying the AI fault classification:
              </p>

              <table className="w-full text-left text-xs border border-slate-800">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <th className="p-2.5">Transducer Sensor</th>
                    <th className="p-2.5">Measured Value</th>
                    <th className="p-2.5">Nominal Baseline</th>
                    <th className="p-2.5">Deviation %</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {faultPrediction.sensorEvidence.map((ev, i) => (
                    <tr key={i} className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-slate-200">{ev.sensorName}</td>
                      <td className="p-2.5 text-white font-bold">{ev.measuredValue}</td>
                      <td className="p-2.5 text-slate-400">{ev.nominalRange}</td>
                      <td className="p-2.5 font-bold text-amber-400">+{ev.deviationPercent}%</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : ev.status === 'ELEVATED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-1.5 rounded bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500"
              >
                CLOSE EVIDENCE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

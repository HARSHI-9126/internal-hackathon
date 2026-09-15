import React, { useState } from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { RadialGauge } from '../components/common/RadialGauge';
import { ShieldCheck, Play, Sliders, Cpu } from 'lucide-react';
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

export const MissionReliabilityView: React.FC = () => {
  const {
    missionConfig,
    updateMissionConfig,
    missionEvaluation,
    setSimulationMode
  } = useDigitalTwin();

  const [missionName, setMissionName] = useState(missionConfig.missionName);
  const [duration, setDuration] = useState(missionConfig.durationHours);
  const [targetRel, setTargetRel] = useState(missionConfig.requiredReliabilityPercent);
  const [operatingTemp, setOperatingTemp] = useState(missionConfig.operatingTempC);
  const [expectedLoad, setExpectedLoad] = useState(missionConfig.expectedLoadPercent);

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateMissionConfig({
      missionName,
      durationHours: Number(duration),
      requiredReliabilityPercent: Number(targetRel),
      operatingTempC: Number(operatingTemp),
      expectedLoadPercent: Number(expectedLoad)
    });
  };

  const handleStartMissionSimulation = () => {
    setSimulationMode('DEGRADATION');
  };

  const barData = missionEvaluation.componentBreakdown.map(c => ({
    name: c.componentName.split(' ')[0],
    fullName: c.componentName,
    reliability: c.reliabilityPercent,
    risk: c.failureRiskPercent
  }));

  return (
    <div className="space-y-6 pb-8 animate-fadeIn font-mono">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              MISSION ASSURANCE & SURVIVABILITY
            </span>
            <span className="text-xs text-slate-400 font-mono">Weibull Hazard Survival Modeling</span>
          </div>
          <h2 className="text-lg font-bold text-white font-mono mt-1">
            Mission Reliability & Operational Planning
          </h2>
        </div>

        <button
          onClick={handleStartMissionSimulation}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-lg glow-emerald flex items-center space-x-2 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START MISSION SIMULATION</span>
        </button>
      </div>

      {/* Main Grid: Mission Planner Config on Left, Reliability Gauge & Status on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Config Form */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase">MISSION PARAMETER CONFIGURATION</h3>
          </div>

          <form onSubmit={handleApplyConfig} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">MISSION NAME</label>
              <input
                type="text"
                value={missionName}
                onChange={e => setMissionName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">DURATION (HOURS)</label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TARGET RELIABILITY (%)</label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={targetRel}
                  onChange={e => setTargetRel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">OPERATING TEMP (°C)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={operatingTemp}
                  onChange={e => setOperatingTemp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EXPECTED LOAD (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={expectedLoad}
                  onChange={e => setExpectedLoad(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded font-bold transition-all"
            >
              RE-CALCULATE RELIABILITY MODEL
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Radial Gauge & Survival Status */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CALCULATED MISSION RELIABILITY</span>
            </h3>
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${missionEvaluation.currentReliabilityPercent >= missionEvaluation.config.requiredReliabilityPercent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
              {missionEvaluation.likelihoodStatus}
            </span>
          </div>

          <RadialGauge
            score={missionEvaluation.currentReliabilityPercent}
            title="Reliability"
            subtitle={`Required: ${missionEvaluation.config.requiredReliabilityPercent}%`}
            size={210}
            strokeWidth={16}
          />

          <div className="w-full grid grid-cols-2 gap-3 text-center text-xs pt-2">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ESTIMATED FAILURE RISK</span>
              <span className="text-rose-400 font-bold text-lg">{missionEvaluation.estimatedFailureProbability}%</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">TARGET RELIABILITY BREACH</span>
              <span className="text-cyan-400 font-bold text-lg">
                {missionEvaluation.currentReliabilityPercent >= missionEvaluation.config.requiredReliabilityPercent ? 'PASSED' : 'BREACHED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Reliability Breakdown Chart */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>COMPONENT-LEVEL RELIABILITY PROJECTION</span>
        </h3>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, 'Component Reliability']}
              />
              <Bar dataKey="reliability" radius={[6, 6, 0, 0]}>
                {barData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.reliability > 90 ? '#10b981' : entry.reliability > 75 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

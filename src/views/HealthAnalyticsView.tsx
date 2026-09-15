import React from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { RadialGauge } from '../components/common/RadialGauge';
import { StatusBadge } from '../components/common/StatusBadge';
import { HeartPulse, Cpu, BarChart2 } from 'lucide-react';
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

export const HealthAnalyticsView: React.FC = () => {
  const { overallHealth, components, selectComponent } = useDigitalTwin();

  const barData = components.map(c => ({
    name: c.name.split(' ')[0], // Short name
    fullName: c.name,
    health: c.health,
    status: c.status,
    id: c.id
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return '#ef4444';
      case 'WARNING': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono">System & Component Health Analytics</h2>
          <p className="text-xs text-slate-400 font-mono">Multi-component composite health indexing engine</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">OVERALL INDEX:</span>
          <span className={`font-bold text-sm ${overallHealth > 85 ? 'text-emerald-400' : overallHealth > 70 ? 'text-amber-400' : 'text-rose-400'}`}>
            {overallHealth} / 100
          </span>
        </div>
      </div>

      {/* Top Grid: Radial Gauge & Component Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Radial Health Gauge */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col items-center justify-center space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>COMPOSITE HEALTH SCORE</span>
          </h3>

          <RadialGauge
            score={overallHealth}
            title="System Health"
            subtitle={overallHealth > 85 ? 'NOMINAL HEALTH' : overallHealth > 70 ? 'DEGRADATION DETECTED' : 'CRITICAL FAULT'}
            size={210}
            strokeWidth={16}
          />

          <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-slate-800 pt-3">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold block">&gt; 85%</span>
              <span className="text-slate-400">Healthy</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 font-bold block">65-85%</span>
              <span className="text-slate-400">Degrading</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-rose-400 font-bold block">&lt; 65%</span>
              <span className="text-slate-400">Critical</span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Component Health Bar Comparison */}
        <div className="lg:col-span-8 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>SUB-SYSTEM COMPONENT HEALTH COMPARISON</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">6 Core Assemblies</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Health Score']}
                />
                <Bar dataKey="health" radius={[0, 6, 6, 0]}>
                  {barData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Component Detailed Breakdown Table */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>COMPONENT DEGRADATION & HEALTH MATRIX</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Component Name</th>
                <th className="py-2.5 px-3">Sub-System Location</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Fault Probability</th>
                <th className="py-2.5 px-3">Estimated RUL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {components.map(comp => (
                <tr
                  key={comp.id}
                  onClick={() => selectComponent(comp.id)}
                  className="hover:bg-slate-800/40 transition-all cursor-pointer"
                >
                  <td className="py-3 px-3 font-bold text-slate-200">{comp.name}</td>
                  <td className="py-3 px-3 text-slate-400">{comp.location}</td>
                  <td className="py-3 px-3 font-bold">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${comp.health < 65 ? 'bg-rose-500' : comp.health < 82 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${comp.health}%` }}
                        />
                      </div>
                      <span className="text-white">{comp.health}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={comp.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{comp.faultProbability}%</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{comp.rulHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

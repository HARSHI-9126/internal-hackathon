import React from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RadialGauge } from '../components/common/RadialGauge';
import { TechnicalSchematic } from '../components/twin/TechnicalSchematic';
import { ComponentDetailModal } from '../components/twin/ComponentDetailModal';
import type { ViewId } from '../components/layout/Sidebar';
import type { ComponentMetric, SystemAlert } from '../types/digitalTwin';
import {
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Bell,
  Activity,
  ArrowUpRight,
  Eye,
  CheckCircle,
  AlertCircle
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

interface OverviewViewProps {
  onNavigate: (view: ViewId) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const {
    overallHealth,
    missionEvaluation,
    faultPrediction,
    rulPrediction,
    alerts,
    sensorHistory,
    sensors,
    components,
    selectedComponentId,
    selectComponent,
    mode,
    startDemoMode
  } = useDigitalTwin();

  const activeAlerts = alerts.filter((a: SystemAlert) => !a.acknowledged);
  const selectedComp = components.find((c: ComponentMetric) => c.id === selectedComponentId) || null;

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* SIH Demo Banner / Quick Callout */}
      <div className="glass-panel p-4 bg-gradient-to-r from-slate-900 via-[#0c162d] to-slate-900 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              SIH 2026 MISSION CONTROL
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Machine Telemetry & Predictive Twin</span>
          </div>
          <h2 className="text-lg font-bold text-white font-mono mt-1">
            AI-Enabled Digital Twin for Health Monitoring & Fault Prediction
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={startDemoMode}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg glow-cyan flex items-center space-x-2 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>RUN SIH JUDGE DEMO</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Overall Health"
          value={`${overallHealth}%`}
          subtitle="Weighted Component Composite"
          status={overallHealth > 85 ? 'success' : overallHealth > 70 ? 'warning' : 'danger'}
          icon={<HeartPulse className="w-5 h-5" />}
          trend={{ value: mode === 'FAULT' ? '-18%' : mode === 'DEGRADATION' ? '-6%' : '+0.5%', isNegative: mode !== 'NORMAL' }}
          onClick={() => onNavigate('health-analytics')}
        />

        <KpiCard
          title="Mission Reliability"
          value={`${missionEvaluation.currentReliabilityPercent}%`}
          subtitle={`Target: ${missionEvaluation.config.requiredReliabilityPercent}%`}
          status={missionEvaluation.currentReliabilityPercent >= missionEvaluation.config.requiredReliabilityPercent ? 'success' : 'danger'}
          icon={<ShieldCheck className="w-5 h-5" />}
          trend={{ value: missionEvaluation.likelihoodStatus, isNegative: missionEvaluation.currentReliabilityPercent < 90 }}
          onClick={() => onNavigate('mission-reliability')}
        />

        <KpiCard
          title="Fault Probability"
          value={`${faultPrediction.probability}%`}
          subtitle={faultPrediction.predictedFault}
          status={faultPrediction.probability > 60 ? 'danger' : faultPrediction.probability > 25 ? 'warning' : 'success'}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend={{ value: faultPrediction.severity, isNegative: faultPrediction.probability > 25 }}
          onClick={() => onNavigate('fault-prediction')}
        />

        <KpiCard
          title="Remaining Useful Life"
          value={rulPrediction.currentRULHours}
          unit="hrs"
          subtitle={`Failure: ~${rulPrediction.currentRULHours}h`}
          status={rulPrediction.currentRULHours > 100 ? 'info' : rulPrediction.currentRULHours > 40 ? 'warning' : 'danger'}
          icon={<Clock className="w-5 h-5" />}
          trend={{ value: rulPrediction.trend === 'STABLE' ? 'STABLE' : 'DECAYING', isNegative: rulPrediction.trend !== 'STABLE' }}
          onClick={() => onNavigate('fault-prediction')}
        />

        <KpiCard
          title="Active Alerts"
          value={activeAlerts.length}
          subtitle={`${alerts.filter((a: SystemAlert) => a.severity === 'CRITICAL').length} Critical`}
          status={activeAlerts.length > 0 ? 'warning' : 'success'}
          icon={<Bell className="w-5 h-5" />}
          trend={{ value: activeAlerts.length > 0 ? 'REQUIRES ATTN' : 'NOMINAL', isNegative: activeAlerts.length > 0 }}
          onClick={() => onNavigate('alerts')}
        />

        <KpiCard
          title="System Status"
          value="ONLINE"
          subtitle="Twin Synced 100%"
          status="info"
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: '1.2s LATENCY', isNegative: false }}
          onClick={() => onNavigate('digital-twin')}
        />
      </div>

      {/* Main Grid: Digital Twin Schematic & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Interactive Digital Twin Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>DIGITAL TWIN REAL-TIME SCHEMATIC</span>
            </h3>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>FULL TWIN VIEW</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <TechnicalSchematic compact onSelectComponent={(comp: ComponentMetric) => selectComponent(comp.id)} />
        </div>

        {/* Right 5 cols: Live Sensor Stream Chart */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>LIVE SENSOR TELEMETRY STREAM</span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">Temperature (°C) & Vibration (mm/s)</p>
            </div>
            <button
              onClick={() => onNavigate('live-monitoring')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>ALL CHARTS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#ef4444" tick={{ fontSize: 10 }} domain={[60, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 10 }} domain={[1, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="vibration" name="Vib (mm/s)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Sensor Snapshot */}
          <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-800 text-[11px] font-mono">
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">TEMP</div>
              <div className="text-rose-400 font-bold">{sensors.temperature.toFixed(1)}°C</div>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">VIB</div>
              <div className="text-amber-400 font-bold">{sensors.vibration.toFixed(2)}mm/s</div>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">PRESS</div>
              <div className="text-cyan-400 font-bold">{sensors.pressure.toFixed(1)}kPa</div>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">RPM</div>
              <div className="text-emerald-400 font-bold">{Math.round(sensors.rpm)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Fault Summary + Mission Gauge + Active Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. AI Fault Prediction & XAI Summary */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>AI FAULT PREDICTION & XAI</span>
            </h3>
            <button onClick={() => onNavigate('fault-prediction')} className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
              DETAILS
            </button>
          </div>

          <div className="space-y-3 font-mono">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">PREDICTED FAULT</div>
                <div className="text-sm font-bold text-white mt-0.5">{faultPrediction.predictedFault}</div>
              </div>
              <StatusBadge status={faultPrediction.severity === 'CRITICAL' ? 'CRITICAL' : faultPrediction.severity === 'HIGH' ? 'WARNING' : 'NORMAL'} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px]">PROBABILITY</span>
                <div className="text-base font-bold text-amber-400">{faultPrediction.probability}%</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px]">EST. TIME TO FAILURE</span>
                <div className="text-base font-bold text-cyan-400">{faultPrediction.estimatedTimeToFailureHours} hrs</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/80 leading-relaxed">
              <span className="text-cyan-400 font-bold">XAI RATIONALE: </span>
              {faultPrediction.explanation}
            </div>
          </div>
        </div>

        {/* 2. Mission Reliability Dial */}
        <div className="glass-panel p-4 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MISSION SURVIVAL GAUGE</span>
            </h3>
            <button onClick={() => onNavigate('mission-reliability')} className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
              PLANNER
            </button>
          </div>

          <RadialGauge
            score={missionEvaluation.currentReliabilityPercent}
            title="Reliability"
            subtitle={missionEvaluation.likelihoodStatus}
            size={170}
          />

          <div className="w-full bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs mt-2">
            <div className="text-slate-400 text-[10px]">CONFIGURED MISSION</div>
            <div className="text-slate-200 font-bold truncate">{missionEvaluation.config.missionName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Duration: {missionEvaluation.config.durationHours}h | Target: {missionEvaluation.config.requiredReliabilityPercent}%
            </div>
          </div>
        </div>

        {/* 3. Real-Time Active Alerts Feed */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>ACTIVE SYSTEM ALERTS</span>
            </h3>
            <button onClick={() => onNavigate('alerts')} className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
              VIEW ALL ({alerts.length})
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 font-mono">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-36 text-center text-slate-500 font-mono text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500/40 mb-1" />
                <span>NO ACTIVE ALERTS</span>
                <span className="text-[10px]">System telemetry nominal</span>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alt: SystemAlert) => (
                <div
                  key={alt.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                    alt.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {alt.componentName}
                    </span>
                    <span className="text-[10px] opacity-75">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] mt-1 text-slate-200">{alt.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Component Modal */}
      <ComponentDetailModal component={selectedComp} onClose={() => selectComponent(null)} />
    </div>
  );
};

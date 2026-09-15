import React, { useState, useEffect } from 'react';
import { useDigitalTwin, DEMO_STEPS } from '../../context/DigitalTwinContext';
import { Play, Pause, Bell, Activity, Cpu, Radio, Zap } from 'lucide-react';

interface TopNavProps {
  onOpenAlertsModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenAlertsModal }) => {
  const {
    systemMetadata,
    mode,
    setSimulationMode,
    isLivePaused,
    togglePauseLive,
    alerts,
    isDemoMode,
    demoStep,
    startDemoMode,
    stopDemoMode
  } = useDigitalTwin();

  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalCount = unacknowledgedAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="h-16 bg-[#0c1220]/90 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md font-mono">
      {/* Left: System Title & Badges */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-slate-100 text-sm tracking-wider uppercase">{systemMetadata.systemName}</h1>
              <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700">
                {systemMetadata.systemId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>SIH 2026 DIGITAL TWIN CONTROL</span>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-slate-800">
          {/* Live Data Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{systemMetadata.connectionStatus}</span>
          </div>

          {/* Twin Synced Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-400 font-mono">
            <Radio className="w-3 h-3 animate-spin text-cyan-400" />
            <span>TWIN: {systemMetadata.digitalTwinStatus}</span>
          </div>

          {/* AI Engine Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-300 font-mono">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>AI ENGINE: {systemMetadata.aiEngineStatus}</span>
          </div>
        </div>
      </div>

      {/* Center: Mode Control Switcher & SIH Demo Button */}
      <div className="flex items-center space-x-3">
        {/* SIH Demo Mode Trigger */}
        {isDemoMode ? (
          <div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-500/50 px-3 py-1 rounded-lg text-amber-300 text-xs font-mono glow-amber">
            <Zap className="w-4 h-4 animate-bounce text-amber-400" />
            <span>DEMO RUNNING ({demoStep}/3): {DEMO_STEPS[demoStep - 1]?.title}</span>
            <button
              onClick={stopDemoMode}
              className="ml-2 bg-amber-500/30 hover:bg-amber-500/50 px-2 py-0.5 rounded text-[10px] text-white font-bold"
            >
              EXIT
            </button>
          </div>
        ) : (
          <button
            onClick={startDemoMode}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-lg transition-all glow-cyan"
            title="Start automated 3-step SIH Judge presentation"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="tracking-wide">START SIH DEMO</span>
          </button>
        )}

        {/* Manual Mode Selector */}
        <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 px-2">MODE:</span>
          <button
            onClick={() => setSimulationMode('NORMAL')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              mode === 'NORMAL'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NORMAL
          </button>
          <button
            onClick={() => setSimulationMode('DEGRADATION')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              mode === 'DEGRADATION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DEGRADATION
          </button>
          <button
            onClick={() => setSimulationMode('FAULT')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              mode === 'FAULT'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FAULT
          </button>
        </div>

        {/* Live Pause Switch */}
        <button
          onClick={togglePauseLive}
          className={`p-1.5 rounded-lg border text-xs font-mono flex items-center transition-all ${
            isLivePaused
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title={isLivePaused ? 'Resume Sensor Feed' : 'Pause Sensor Feed'}
        >
          {isLivePaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>

      {/* Right: Notifications & Time */}
      <div className="flex items-center space-x-4">
        {/* Alert Bell */}
        <button
          onClick={onOpenAlertsModal}
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlerts.length > 0 && (
            <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${criticalCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}>
              {unacknowledgedAlerts.length}
            </span>
          )}
        </button>

        {/* Clock */}
        <div className="hidden sm:block text-right">
          <div className="text-xs font-mono font-bold text-slate-200">{timeStr}</div>
          <div className="text-[10px] text-slate-400 font-mono">UTC+05:30 IST</div>
        </div>
      </div>
    </header>
  );
};

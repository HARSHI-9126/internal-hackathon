import React from 'react';
import {
  LayoutDashboard,
  Box,
  Activity,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  Bell,
  Database,
  BrainCircuit,
  Settings
} from 'lucide-react';
import { useDigitalTwin } from '../../context/DigitalTwinContext';

export type ViewId =
  | 'overview'
  | 'digital-twin'
  | 'live-monitoring'
  | 'health-analytics'
  | 'fault-prediction'
  | 'mission-reliability'
  | 'alerts'
  | 'historical-data'
  | 'ai-insights'
  | 'settings';

interface SidebarProps {
  currentView: ViewId;
  onSelectView: (view: ViewId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const { alerts, overallHealth, faultPrediction } = useDigitalTwin();

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const navItems: { id: ViewId; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'digital-twin', label: 'Digital Twin', icon: <Box className="w-4 h-4" /> },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: <Activity className="w-4 h-4" /> },
    {
      id: 'health-analytics',
      label: 'Health Analytics',
      icon: <HeartPulse className="w-4 h-4" />,
      badge: `${overallHealth}%`,
      badgeColor: overallHealth > 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
    },
    {
      id: 'fault-prediction',
      label: 'Fault Prediction',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: faultPrediction.severity === 'CRITICAL' ? 'CRITICAL' : faultPrediction.severity === 'HIGH' ? 'HIGH' : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { id: 'mission-reliability', label: 'Mission Reliability', icon: <ShieldCheck className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
      badge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'historical-data', label: 'Historical Data', icon: <Database className="w-4 h-4" /> },
    { id: 'ai-insights', label: 'AI Insights', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-[#0c1220] border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
          System Modules
        </div>

        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 m-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold">
          <span>SMART INDIA HACKATHON</span>
          <span className="text-cyan-400">2026</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          AI Digital Twin Mission Control Platform
        </p>
      </div>
    </aside>
  );
};

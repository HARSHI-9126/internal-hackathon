import React from 'react';
import type { ComponentHealthStatus, AlertSeverity } from '../../types/digitalTwin';

interface StatusBadgeProps {
  status: ComponentHealthStatus | AlertSeverity | 'ONLINE' | 'OFFLINE' | 'SYNCHRONIZED';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';

  const styles = {
    NORMAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    ONLINE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    SYNCHRONIZED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    INFO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
    OFFLINE: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  const dots = {
    NORMAL: 'bg-emerald-400',
    ONLINE: 'bg-emerald-400',
    SYNCHRONIZED: 'bg-cyan-400',
    INFO: 'bg-cyan-400',
    WARNING: 'bg-amber-400',
    CRITICAL: 'bg-rose-400',
    OFFLINE: 'bg-slate-500'
  };

  const currentStyle = styles[status] || styles.NORMAL;
  const currentDot = dots[status] || dots.NORMAL;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono font-semibold rounded-full border ${currentStyle} ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`} />
      <span>{status}</span>
    </span>
  );
};

import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isNegative?: boolean;
  };
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  icon,
  status = 'info',
  onClick
}) => {
  const statusStyles = {
    success: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/50 glow-emerald',
    warning: 'border-amber-500/30 text-amber-400 bg-amber-500/5 hover:border-amber-500/50 glow-amber',
    danger: 'border-rose-500/30 text-rose-400 bg-rose-500/5 hover:border-rose-500/50 glow-red',
    info: 'border-slate-800 text-cyan-400 bg-slate-900/60 hover:border-cyan-500/40 glow-cyan'
  };

  const iconStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 transition-all duration-300 relative overflow-hidden group cursor-pointer ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">{title}</p>
          <div className="flex items-baseline space-x-1.5 mt-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
            {unit && <span className="text-xs font-mono text-slate-400 font-medium">{unit}</span>}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${iconStyles[status]}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] font-mono border-t border-slate-800/80 pt-2">
        <span className="text-slate-400 truncate max-w-[150px]">{subtitle}</span>
        {trend && (
          <span className={`font-semibold ${trend.isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

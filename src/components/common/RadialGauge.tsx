import React from 'react';

interface RadialGaugeProps {
  score: number; // 0 to 100
  title: string;
  subtitle?: string;
  size?: number;
  strokeWidth?: number;
  thresholds?: { warning: number; danger: number };
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  title,
  subtitle,
  size = 180,
  strokeWidth = 14,
  thresholds = { warning: 80, danger: 65 }
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Arc angle (270 degrees sweep)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  let colorClass = '#10b981'; // Emerald
  if (score < thresholds.danger) {
    colorClass = '#ef4444'; // Red
  } else if (score < thresholds.warning) {
    colorClass = '#f59e0b'; // Amber
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-225"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colorClass}66)`
            }}
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold font-mono tracking-tight text-white">{Math.round(score)}%</span>
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">{title}</span>
        </div>
      </div>

      {subtitle && (
        <span className="text-xs font-mono text-slate-400 mt-1">{subtitle}</span>
      )}
    </div>
  );
};

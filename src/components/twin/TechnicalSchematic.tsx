import React from 'react';
import { useDigitalTwin } from '../../context/DigitalTwinContext';
import type { ComponentMetric } from '../../types/digitalTwin';

interface TechnicalSchematicProps {
  onSelectComponent?: (comp: ComponentMetric) => void;
  compact?: boolean;
}

export const TechnicalSchematic: React.FC<TechnicalSchematicProps> = ({ onSelectComponent, compact = false }) => {
  const { components, selectedComponentId, selectComponent } = useDigitalTwin();

  const getComponent = (id: string) => components.find(c => c.id === id);

  const getStatusColor = (status: ComponentMetric['status']) => {
    switch (status) {
      case 'CRITICAL': return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.15)', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'WARNING': return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default: return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const handleComponentClick = (comp: ComponentMetric) => {
    selectComponent(comp.id);
    if (onSelectComponent) {
      onSelectComponent(comp);
    }
  };

  return (
    <div className={`glass-panel p-4 relative overflow-hidden bg-[#0a0f1d] border-slate-800 ${compact ? 'h-[360px]' : 'h-[520px]'}`}>
      {/* Background CAD Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Schematic Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2 relative z-10 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">
            2D TECHNICAL SCHEMATIC - TURBOPROP DIGITAL TWIN
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> NORMAL</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> WARNING</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/> CRITICAL</span>
        </div>
      </div>

      {/* SVG Canvas Schematic Diagram */}
      <div className="relative w-full h-[calc(100%-40px)] flex items-center justify-center">
        <svg
          viewBox="0 0 900 500"
          className="w-full h-full max-h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Pulsing ring filter */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Machine Outer Structural Shell */}
          <g stroke="#334155" strokeWidth="2" fill="none">
            {/* Fuselage / Main Engine Housing Blueprint Outline */}
            <path d="M 120,250 C 120,150 250,120 450,120 C 650,120 780,180 820,250 C 780,320 650,380 450,380 C 250,380 120,350 120,250 Z" strokeDasharray="6 4" stroke="#1e293b" />
            
            {/* Main Turbine Core Axis Line */}
            <line x1="100" y1="250" x2="840" y2="250" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="10 5" opacity="0.4" />
            
            {/* Compressor Stage Lines */}
            <line x1="260" y1="160" x2="260" y2="340" stroke="#334155" strokeDasharray="3 3" />
            <line x1="380" y1="140" x2="380" y2="360" stroke="#334155" strokeDasharray="3 3" />
            <line x1="520" y1="140" x2="520" y2="360" stroke="#334155" strokeDasharray="3 3" />
            <line x1="680" y1="170" x2="680" y2="330" stroke="#334155" strokeDasharray="3 3" />
          </g>

          {/* Telemetry Interconnect Flow Lines */}
          <g stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.6">
            <path d="M 280,250 L 380,250 L 480,250 L 680,250" strokeDasharray="4 4" className="animate-pulse" />
            <path d="M 380,250 L 380,120 L 520,120 L 520,250" />
            <path d="M 480,250 L 480,380 L 640,380 L 640,250" />
          </g>

          {/* Render Component Hotspots */}

          {/* 1. Main Turboprop Engine */}
          {(() => {
            const comp = getComponent('comp-engine');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <circle
                  cx="450"
                  cy="250"
                  r="52"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all duration-300 hover:scale-105"
                />
                <circle cx="450" cy="250" r="38" fill="#111726" stroke={colors.stroke} strokeWidth="1" strokeDasharray="4 2" />
                <text x="450" y="244" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  ENGINE
                </text>
                <text x="450" y="262" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}

          {/* 2. High-Speed Bearing Assembly #01 */}
          {(() => {
            const comp = getComponent('comp-bearing');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <rect
                  x="280"
                  y="215"
                  width="90"
                  height="70"
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                />
                <text x="325" y="244" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  BEARING #01
                </text>
                <text x="325" y="262" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}

          {/* 3. Closed-Loop Cooling System */}
          {(() => {
            const comp = getComponent('comp-cooling');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <rect
                  x="450"
                  y="80"
                  width="110"
                  height="65"
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                />
                <text x="505" y="108" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  COOLING
                </text>
                <text x="505" y="126" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}

          {/* 4. Auxiliary Power Battery Unit */}
          {(() => {
            const comp = getComponent('comp-battery');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <rect
                  x="630"
                  y="215"
                  width="95"
                  height="70"
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                />
                <text x="677" y="244" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  BATTERY
                </text>
                <text x="677" y="262" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}

          {/* 5. Flight Control Avionics Unit */}
          {(() => {
            const comp = getComponent('comp-control');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <rect
                  x="140"
                  y="215"
                  width="95"
                  height="70"
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                />
                <text x="187" y="244" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  CONTROL UNIT
                </text>
                <text x="187" y="262" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}

          {/* 6. Hydraulic Actuator System */}
          {(() => {
            const comp = getComponent('comp-hydraulic');
            if (!comp) return null;
            const colors = getStatusColor(comp.status);
            const isSelected = selectedComponentId === comp.id;
            return (
              <g
                className="cursor-pointer group transition-all"
                onClick={() => handleComponentClick(comp)}
              >
                <rect
                  x="450"
                  y="350"
                  width="110"
                  height="65"
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                />
                <text x="505" y="378" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  HYDRAULIC
                </text>
                <text x="505" y="396" textAnchor="middle" fill={colors.stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {comp.health}%
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Floating Interactive Legend Overlay */}
      <div className="absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-2 rounded-lg text-[10px] font-mono text-slate-300">
        <span className="text-cyan-400 font-bold">PRO-TIP:</span> Click any schematic component node to inspect real-time sensor metrics & failure risks.
      </div>
    </div>
  );
};

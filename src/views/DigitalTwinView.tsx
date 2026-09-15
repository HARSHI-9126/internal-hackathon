import React from 'react';
import { useDigitalTwin } from '../context/DigitalTwinContext';
import { TechnicalSchematic } from '../components/twin/TechnicalSchematic';
import { ComponentDetailModal } from '../components/twin/ComponentDetailModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { Box, Radio } from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { components, selectedComponentId, selectComponent } = useDigitalTwin();

  const selectedComp = components.find(c => c.id === selectedComponentId) || null;

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              PHYSICAL TO VIRTUAL MAPPING
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-time CAD/Schematic Telemetry Mirror</span>
          </div>
          <h2 className="text-lg font-bold text-white font-mono mt-1">
            Digital Twin Synchronized Machine Schematic
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center space-x-2">
            <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>SYNCHRONIZATION: 100% (REALTIME)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Schematic on Left, Component Cards List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schematic Canvas (8 Cols) */}
        <div className="lg:col-span-8">
          <TechnicalSchematic onSelectComponent={(comp) => selectComponent(comp.id)} />
        </div>

        {/* Component Health & Telemetry Cards List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2 mb-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>TWIN SUB-SYSTEM COMPONENTS</span>
          </h3>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {components.map(comp => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => selectComponent(comp.id)}
                  className={`glass-panel p-3.5 transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'border-cyan-500/80 bg-cyan-500/10 shadow-lg glow-cyan'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 font-mono">{comp.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{comp.location}</p>
                    </div>
                    <StatusBadge status={comp.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3 text-center text-[10px] font-mono border-t border-slate-800/80 pt-2">
                    <div>
                      <span className="text-slate-400 block">HEALTH</span>
                      <span className="font-bold text-white text-xs">{comp.health}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">TEMP</span>
                      <span className="font-bold text-rose-400 text-xs">{comp.temperature.toFixed(1)}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">VIB</span>
                      <span className="font-bold text-amber-400 text-xs">{comp.vibration.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">RUL</span>
                      <span className="font-bold text-cyan-400 text-xs">{comp.rulHours}h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component Telemetry Detail Modal */}
      <ComponentDetailModal component={selectedComp} onClose={() => selectComponent(null)} />
    </div>
  );
};

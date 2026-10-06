'use client';

import React from 'react';
import {
  Lightbulb,
  Fan,
  Refrigerator,
  AirVent,
  Flame,
  CookingPot,
  Sparkles,
} from 'lucide-react';
import { getApplianceEquivalents } from '../utils/calculator';

interface ApplianceBreakdownProps {
  watts: number;
}

export function ApplianceBreakdown({ watts }: ApplianceBreakdownProps) {
  const appliances = getApplianceEquivalents(watts);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'Fan':
        return <Fan className="w-5 h-5 text-cyan-400" />;
      case 'Refrigerator':
        return <Refrigerator className="w-5 h-5 text-sky-400" />;
      case 'AirVent':
        return <AirVent className="w-5 h-5 text-teal-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'CookingPot':
        return <CookingPot className="w-5 h-5 text-orange-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Household Appliance Equivalency
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Current Load: <span className="text-cyan-300 font-bold">{Math.round(watts)} W</span>
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-5 leading-relaxed">
        See what devices could run simultaneously to consume this exact amount of electricity:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {appliances.map((app, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                {renderIcon(app.icon)}
              </div>
              <span className="text-[10px] font-mono text-slate-500">{app.watts}W</span>
            </div>

            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-white">
                {app.count}
                <span className="text-xs font-normal text-slate-400 ml-1">×</span>
              </div>
              <div className="text-xs font-medium text-slate-300 line-clamp-1 mt-0.5">
                {app.name}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {app.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

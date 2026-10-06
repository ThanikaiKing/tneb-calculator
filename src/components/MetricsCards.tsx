'use client';

import React from 'react';
import { Zap, Calendar, CalendarDays, Receipt, Activity, ChevronRight } from 'lucide-react';
import { CalculationResult } from '../types/calculator';

interface MetricsCardsProps {
  metrics: CalculationResult;
  currencySymbol?: string;
  onOpenTariffModal: () => void;
  tariffMode: 'tangedco' | 'flat';
}

export function MetricsCards({
  metrics,
  currencySymbol = '₹',
  onOpenTariffModal,
  tariffMode,
}: MetricsCardsProps) {
  const {
    watts,
    kilowatts,
    unitsPerDay,
    unitsPerMonth,
    unitsBiMonthly,
    costPerDay,
    costPerMonth,
    costBiMonthly,
    blinksPerMinute,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Real-Time Active Load */}
      <div className="relative p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 box-glow-cyan/20 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 sm:mb-2">
          <span className="uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            Active Power
          </span>
          <span className="font-mono text-slate-500 text-[10px] hidden sm:inline">Instant</span>
        </div>
        <div className="my-1 sm:my-2">
          <div className="text-xl sm:text-3xl font-extrabold font-mono text-white glow-cyan">
            {watts >= 1000 ? watts.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : watts.toFixed(1)}{' '}
            <span className="text-sm sm:text-xl font-normal text-cyan-400">W</span>
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-400 mt-0.5">
            {kilowatts.toFixed(3)} kW draw
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span>Speed:</span>
          <span className="font-mono text-cyan-300 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 text-red-400 animate-pulse shrink-0" />
            {blinksPerMinute.toFixed(1)} BPM
          </span>
        </div>
      </div>

      {/* 2. Units Per Day */}
      <div className="relative p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 box-glow-emerald/20 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 sm:mb-2">
          <span className="uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            Daily Units
          </span>
          <span className="font-mono text-slate-500 text-[10px] hidden sm:inline">24 Hours</span>
        </div>
        <div className="my-1 sm:my-2">
          <div className="text-xl sm:text-3xl font-extrabold font-mono text-white glow-emerald">
            {unitsPerDay.toFixed(2)}{' '}
            <span className="text-sm sm:text-xl font-normal text-emerald-400">Units</span>
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-emerald-400/90 mt-0.5 font-medium">
            ≈ {currencySymbol}{costPerDay.toFixed(1)}/day
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] text-slate-400 flex justify-between">
          <span>24h draw:</span>
          <span className="font-mono text-slate-300">{(unitsPerDay).toFixed(1)} kWh</span>
        </div>
      </div>

      {/* 3. Monthly Projection (30 Days) */}
      <div className="relative p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 box-glow-amber/20 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 sm:mb-2">
          <span className="uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            Monthly
          </span>
          <span className="font-mono text-slate-500 text-[10px] hidden sm:inline">30 Days</span>
        </div>
        <div className="my-1 sm:my-2">
          <div className="text-xl sm:text-3xl font-extrabold font-mono text-white glow-amber">
            {unitsPerMonth.toFixed(1)}{' '}
            <span className="text-sm sm:text-xl font-normal text-amber-400">kWh</span>
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-amber-400/90 mt-0.5 font-medium">
            ≈ {currencySymbol}{costPerMonth.toFixed(0)}/mo
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] text-slate-400 flex justify-between">
          <span>Units (30d):</span>
          <span className="font-mono text-slate-300">{Math.round(unitsPerMonth)} u</span>
        </div>
      </div>

      {/* 4. Tamil Nadu Bi-Monthly (60 Days) Billing */}
      <div className="relative p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-400/50 box-glow-cyan/40 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 sm:mb-2">
          <span className="uppercase tracking-wider font-semibold text-cyan-300 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
            <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            {tariffMode === 'tangedco' ? 'TN Bill (60d)' : 'Bill (60d)'}
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
            60 Days
          </span>
        </div>
        <div className="my-1 sm:my-2">
          <div className="text-xl sm:text-3xl font-extrabold font-mono text-cyan-300 glow-cyan">
            {currencySymbol}{costBiMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-slate-300 mt-0.5">
            {unitsBiMonthly.toFixed(1)} u / 60 days
          </div>
        </div>
        <button
          onClick={onOpenTariffModal}
          className="w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors group cursor-pointer"
        >
          <span>Slab Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
}

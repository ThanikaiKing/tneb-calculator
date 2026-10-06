'use client';

import React from 'react';
import { Gauge, ShieldAlert, Sparkles } from 'lucide-react';
import { CalculationResult } from '../types/calculator';

interface PowerGaugeProps {
  watts: number;
  kilowatts: number;
  category: CalculationResult['loadCategory'];
}

export function PowerGauge({ watts, kilowatts, category }: PowerGaugeProps) {
  // Max scale defaults to 6000W for standard single phase domestic meters, or scales up
  const maxScale = Math.max(6000, Math.ceil(watts / 1000) * 1000);
  const percentage = Math.min(Math.max(watts / maxScale, 0), 1);

  // SVG Gauge dimensions (220 degree arc)
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;

  // Arc angles (from -200 deg to 20 deg) = 220 degrees total
  const arcTotalAngle = 220;
  const startAngle = 160; // 160 deg from positive x-axis

  // Circumference of full circle
  const circumference = 2 * Math.PI * radius;
  // Arc length for 220 degrees
  const arcLength = (arcTotalAngle / 360) * circumference;
  // Filled stroke dashoffset
  const strokeDashoffset = arcLength - percentage * arcLength;

  // Category styling
  const categoryConfig: Record<
    CalculationResult['loadCategory'],
    { label: string; color: string; bg: string; border: string; glow: string }
  > = {
    standby: {
      label: 'Standby / Idle Load',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'glow-emerald',
    },
    low: {
      label: 'Light Domestic Load',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'glow-cyan',
    },
    moderate: {
      label: 'Moderate Load (1 AC / Appliances)',
      color: 'text-sky-300',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      glow: 'glow-cyan',
    },
    high: {
      label: 'Heavy Load (Multiple High-Wattage Units)',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'glow-amber',
    },
    peak: {
      label: 'Peak Load / Heavy Grid Draw',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      glow: 'glow-red',
    },
  };

  const currentCat = categoryConfig[category];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-cyan-500/20 box-glow-cyan/30">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <Gauge className="w-4 h-4" />
          <span>Real-Time Power Meter</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Scale: 0 – {(maxScale / 1000).toFixed(0)} kW</span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-[260px] h-[210px] flex items-center justify-center mt-2">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* Gradient definition for arc */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />

          {/* Active filled arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glowFilter)"
            className="transition-all duration-500 ease-out"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Active Power</span>
          </div>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-white glow-cyan my-0.5">
            {watts >= 1000 ? watts.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : watts.toFixed(0)}
            <span className="text-xl font-normal text-cyan-400 ml-1">W</span>
          </div>
          <div className="text-sm font-mono text-slate-300 font-semibold">
            {kilowatts.toFixed(3)} <span className="text-slate-400 text-xs">kW</span>
          </div>
        </div>
      </div>

      {/* Category status badge */}
      <div className="mt-2 w-full flex items-center justify-center">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentCat.bg} ${currentCat.border} ${currentCat.color}`}
        >
          {category === 'peak' && <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
          <span>{currentCat.label}</span>
        </div>
      </div>
    </div>
  );
}

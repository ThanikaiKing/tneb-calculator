'use client';

import React from 'react';
import { Zap, MapPin, Gauge } from 'lucide-react';

interface NavbarProps {
  tariffMode: 'tangedco' | 'flat';
}

export function Navbar({ tariffMode }: NavbarProps) {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-lg">
                Pulse<span className="text-cyan-400">Watt</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-800 font-semibold tracking-wider">
                EB Monitor
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              imp/kWh & Blink Interval Electricity Consumption Calculator
            </p>
          </div>
        </div>

        {/* State / Tariff pill */}
        <div className="flex items-center gap-2">
          {tariffMode === 'tangedco' ? (
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-slate-300">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline text-slate-400">Tariff:</span>
              <span className="font-semibold text-white">
                <span className="sm:hidden">TN TANGEDCO</span>
                <span className="hidden sm:inline">Tamil Nadu (TANGEDCO)</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-slate-300">
              <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-white">Flat Rate</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

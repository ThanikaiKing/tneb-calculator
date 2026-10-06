'use client';

import React from 'react';
import { X, Receipt, CheckCircle, Info } from 'lucide-react';
import { SlabBreakdownItem } from '../types/calculator';

interface TariffBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitsBiMonthly: number;
  totalCostBiMonthly: number;
  breakdown: SlabBreakdownItem[];
  currencySymbol?: string;
}

export function TariffBreakdownModal({
  isOpen,
  onClose,
  unitsBiMonthly,
  totalCostBiMonthly,
  breakdown,
  currencySymbol = '₹',
}: TariffBreakdownModalProps) {
  if (!isOpen) return null;

  const isUnder500Tier = unitsBiMonthly <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">TN EB Tariff Breakdown</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Official TANGEDCO Bi-Monthly (60 Days)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto pr-1 py-3 space-y-3 sm:space-y-4 flex-1">
          {/* Tier badge indicator */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
            <div>
              <div className="text-[11px] sm:text-xs text-slate-400">Total Bi-Monthly:</div>
              <div className="text-base sm:text-lg font-mono font-bold text-cyan-300">
                {unitsBiMonthly.toFixed(1)} <span className="text-xs font-normal text-slate-300">Units (kWh)</span>
              </div>
            </div>
            <div>
              <span
                className={`inline-block text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  isUnder500Tier
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                }`}
              >
                {isUnder500Tier ? '≤ 500u (200 Free Units)' : '> 500u (100 Free Units)'}
              </span>
            </div>
          </div>

          {/* Slabs breakdown table with horizontal scroll safety */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-[11px] sm:text-xs font-mono min-w-[280px]">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-2.5 sm:px-3">Slab</th>
                  <th className="py-2 px-2 sm:px-3 text-right">Units</th>
                  <th className="py-2 px-2 sm:px-3 text-right">Rate</th>
                  <th className="py-2 px-2.5 sm:px-3 text-right">Cost</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    {item.rate === 0 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span>{item.slab}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{item.units.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right">
                    {item.rate === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `${currencySymbol}${item.rate.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">
                    {currencySymbol}{item.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total calculation footer */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-900 border border-cyan-500/30 flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Estimated 60-Day Bill</div>
            <div className="text-[11px] text-slate-500">Official Tamil Nadu bi-monthly cycle</div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 glow-cyan">
            {currencySymbol}{totalCostBiMonthly.toFixed(2)}
          </div>
        </div>

        </div>

        {/* Note inside modal body */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 shrink-0">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Note: Fixed charges and duty may be added by TANGEDCO. Slabs show energy charges according to the tariff.
          </span>
        </div>

        {/* Modal bottom actions (always visible without scrolling) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer min-h-[40px]"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}

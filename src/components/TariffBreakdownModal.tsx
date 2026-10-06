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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tamil Nadu EB Tariff Breakdown</h3>
              <p className="text-xs text-slate-400">Official TANGEDCO Bi-Monthly (60 Days) Billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier badge indicator */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Bi-Monthly Projection:</div>
            <div className="text-lg font-mono font-bold text-cyan-300">
              {unitsBiMonthly.toFixed(1)} <span className="text-xs font-normal text-slate-300">Units (kWh)</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${
                isUnder500Tier
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}
            >
              {isUnder500Tier ? '≤ 500 Units Slab (200 Free Units)' : '> 500 Units CM Tariff (100 Free Units)'}
            </span>
          </div>
        </div>

        {/* Slabs breakdown table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 mb-4">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Slab Range</th>
                <th className="py-2.5 px-3 text-right">Units</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
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

        <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Note: Fixed charges, meter rent, and electricity duty may be added by TANGEDCO on the physical bill. Calculations represent energy charges based on the latest tariff notification.
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}

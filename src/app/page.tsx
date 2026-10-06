'use client';

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Sliders,
  Timer,
  IndianRupee,
  ChevronRight,
  Info,
  Clock,
  Settings,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { BlinkTapper } from '../components/BlinkTapper';
import { SimulatedMeterLed } from '../components/SimulatedMeterLed';
import { PowerGauge } from '../components/PowerGauge';
import { MetricsCards } from '../components/MetricsCards';
import { ApplianceBreakdown } from '../components/ApplianceBreakdown';
import { SessionLogger } from '../components/SessionLogger';
import { FormulaGuide } from '../components/FormulaGuide';
import { TariffBreakdownModal } from '../components/TariffBreakdownModal';
import {
  calculatePowerMetrics,
  COMMON_IMP_PRESETS,
  TariffMode,
} from '../utils/calculator';

export default function Home() {
  // Calculator inputs
  const [impPerKwh, setImpPerKwh] = useState<number>(3200);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(3.6);
  const [tariffMode, setTariffMode] = useState<TariffMode>('tangedco');
  const [flatRate, setFlatRate] = useState<number>(7.0);
  const [currencySymbol] = useState<string>('₹');

  // Mobile visual view mode for the interactive 3-card section
  const [mobileLiveView, setMobileLiveView] = useState<'all' | 'tapper' | 'led' | 'gauge'>('all');

  // Modal state
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  // Calculate real-time results
  const metrics = useMemo(() => {
    return calculatePowerMetrics(impPerKwh, intervalSeconds, tariffMode, flatRate);
  }, [impPerKwh, intervalSeconds, tariffMode, flatRate]);

  // Handle manual input change
  const handleIntervalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setIntervalSeconds(val);
    } else if (e.target.value === '') {
      setIntervalSeconds(0);
    }
  };

  const adjustInterval = (delta: number) => {
    setIntervalSeconds((prev) => {
      const next = Math.max(0.1, Number((prev + delta).toFixed(2)));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black pb-16 lg:pb-0">
      {/* Navbar */}
      <Navbar tariffMode={tariffMode} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Top Hero Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 box-glow-cyan/20 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Real-Time Electricity & Bill Calculator</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1.5 sm:mb-2">
              Measure Your Power Draw in Seconds
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed">
              Count seconds between calibration LED blinks or tap along with your meter to calculate instantaneous Watts, daily units, and Tamil Nadu EB bill.
            </p>
          </div>
        </div>

        {/* Configuration Bar (Presets, Inputs & Tariff Mode) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5">
          {/* Card 1: Meter Constant (imp/kWh) */}
          <div className="md:col-span-6 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 sm:gap-2">
                  <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                  Meter Constant (imp/kWh)
                </label>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Found on meter glass</span>
              </div>

              {/* Quick Preset Buttons with mobile scroll */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 mb-3 sm:mb-4 scrollbar-none">
                {COMMON_IMP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setImpPerKwh(preset)}
                    className={`px-3 py-1.5 sm:py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 min-h-[38px] flex items-center justify-center cursor-pointer ${
                      impPerKwh === preset
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="relative mt-1 sm:mt-2">
              <input
                type="number"
                inputMode="numeric"
                min="100"
                max="20000"
                step="100"
                value={impPerKwh || ''}
                onChange={(e) => setImpPerKwh(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter custom imp/kWh"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                imp/kWh
              </span>
            </div>
          </div>

          {/* Card 2: Manual Seconds Interval */}
          <div className="md:col-span-6 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 sm:gap-2">
                  <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                  Blink Interval (Seconds)
                </label>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Time between 2 blinks</span>
              </div>

              {/* Stepper adjust buttons - thumb friendly on mobile */}
              <div className="grid grid-cols-4 gap-1.5 mb-3 sm:mb-4">
                <button
                  type="button"
                  onClick={() => adjustInterval(-1)}
                  className="py-2 sm:py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] flex items-center justify-center cursor-pointer"
                >
                  -1.0s
                </button>
                <button
                  type="button"
                  onClick={() => adjustInterval(-0.1)}
                  className="py-2 sm:py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] flex items-center justify-center cursor-pointer"
                >
                  -0.1s
                </button>
                <button
                  type="button"
                  onClick={() => adjustInterval(0.1)}
                  className="py-2 sm:py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] flex items-center justify-center cursor-pointer"
                >
                  +0.1s
                </button>
                <button
                  type="button"
                  onClick={() => adjustInterval(1)}
                  className="py-2 sm:py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] flex items-center justify-center cursor-pointer"
                >
                  +1.0s
                </button>
              </div>
            </div>

            {/* Manual numeric input */}
            <div className="relative mt-1 sm:mt-2">
              <input
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.01"
                value={intervalSeconds || ''}
                onChange={handleIntervalInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter interval (seconds)"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                seconds
              </span>
            </div>
          </div>
        </div>

        {/* Tariff Mode Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Electricity Tariff Mode:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setTariffMode('tangedco')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer ${
                tariffMode === 'tangedco'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5 shrink-0" />
              <span>TN TANGEDCO Slabs</span>
            </button>

            <button
              type="button"
              onClick={() => setTariffMode('flat')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all min-h-[38px] flex items-center justify-center cursor-pointer ${
                tariffMode === 'flat'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Flat Rate
            </button>

            {tariffMode === 'flat' && (
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">₹/unit:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={flatRate}
                  onChange={(e) => setFlatRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 bg-transparent text-cyan-300 font-mono text-xs focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile View Mode Switcher for the 3 Live Cards */}
        <div className="flex lg:hidden items-center justify-between bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 pl-2">Live View:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileLiveView('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mobileLiveView === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setMobileLiveView('tapper')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mobileLiveView === 'tapper'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tap Meter
            </button>
            <button
              type="button"
              onClick={() => setMobileLiveView('led')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mobileLiveView === 'led'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Blink LED
            </button>
            <button
              type="button"
              onClick={() => setMobileLiveView('gauge')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                mobileLiveView === 'gauge'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gauge
            </button>
          </div>
        </div>

        {/* Core Live Interaction Grid: Tap Button + Simulated LED + Power Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6">
          {/* Interactive Tap Button */}
          <div className={`lg:col-span-4 ${mobileLiveView !== 'all' && mobileLiveView !== 'tapper' ? 'hidden lg:block' : ''}`}>
            <BlinkTapper
              onIntervalMeasured={(avgSec) => setIntervalSeconds(avgSec)}
              currentInterval={intervalSeconds}
              watts={metrics.watts}
              impPerKwh={impPerKwh}
            />
          </div>

          {/* Simulated LED */}
          <div className={`lg:col-span-4 ${mobileLiveView !== 'all' && mobileLiveView !== 'led' ? 'hidden lg:block' : ''}`}>
            <SimulatedMeterLed
              intervalSeconds={intervalSeconds}
              watts={metrics.watts}
            />
          </div>

          {/* Real-Time Power Gauge */}
          <div className={`lg:col-span-4 ${mobileLiveView !== 'all' && mobileLiveView !== 'gauge' ? 'hidden lg:block' : ''}`}>
            <PowerGauge
              watts={metrics.watts}
              kilowatts={metrics.kilowatts}
              category={metrics.loadCategory}
            />
          </div>
        </div>

        {/* Calculated Metrics Cards */}
        <MetricsCards
          metrics={metrics}
          currencySymbol={currencySymbol}
          onOpenTariffModal={() => setIsTariffModalOpen(true)}
          tariffMode={tariffMode}
        />

        {/* Household Appliance Load Breakdown */}
        <ApplianceBreakdown watts={metrics.watts} />

        {/* Load Comparison Logger */}
        <SessionLogger
          currentWatts={metrics.watts}
          currentInterval={intervalSeconds}
          currentImp={impPerKwh}
          currentUnitsPerDay={metrics.unitsPerDay}
          currentUnitsBiMonthly={metrics.unitsBiMonthly}
          currentCostBiMonthly={metrics.costBiMonthly}
          currencySymbol={currencySymbol}
        />

        {/* Educational Guide */}
        <FormulaGuide />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-5 sm:py-6 mt-8 sm:mt-12 text-center text-xs text-slate-500 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">PulseWatt</span>
            <span>— Precision Electricity Meter</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500">
            Tamil Nadu TANGEDCO Domestic Tariff Presets • Mobile Optimized
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Quick Bar for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3.5 py-2.5 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.6)] pb-safe">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white glow-cyan leading-tight">
              {Math.round(metrics.watts)} W
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80 leading-tight">
              {intervalSeconds.toFixed(2)}s • {impPerKwh} imp
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => adjustInterval(-0.1)}
            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 active:bg-slate-800"
            title="Decrease 0.1s"
          >
            -0.1s
          </button>
          <button
            type="button"
            onClick={() => adjustInterval(0.1)}
            className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 active:bg-slate-800"
            title="Increase 0.1s"
          >
            +0.1s
          </button>
          <button
            type="button"
            onClick={() => setIsTariffModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold font-mono active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          >
            {currencySymbol}{Math.round(metrics.costBiMonthly)}
          </button>
        </div>
      </div>

      {/* Tamil Nadu EB Tariff Breakdown Modal */}
      <TariffBreakdownModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
        unitsBiMonthly={metrics.unitsBiMonthly}
        totalCostBiMonthly={metrics.costBiMonthly}
        breakdown={metrics.costBreakdownBiMonthly}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

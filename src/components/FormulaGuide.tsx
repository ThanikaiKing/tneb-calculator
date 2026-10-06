'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, Lightbulb, Calculator, Zap } from 'lucide-react';

export function FormulaGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              How It Works & Tamil Nadu EB Tariff Guide
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Learn the physics behind energy meter blinks and how TANGEDCO calculates your bill
            </p>
          </div>
        </div>
        <div className="text-slate-400 p-1 rounded-lg bg-slate-800">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-slate-800/80 space-y-6 text-xs text-slate-300">
          {/* Section 1: The Physics and Math */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              1. The Pulse-to-Wattage Formula
            </h4>
            <p className="leading-relaxed mb-3">
              Modern electronic energy meters (like those installed by TANGEDCO) have a red calibration LED labeled with a meter constant $C$ in <strong className="text-white">imp/kWh</strong> (commonly 1600 or 3200 imp/kWh).
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-cyan-400 mb-3 space-y-1">
              <div>• 1 impulse = (1 / C) kWh = (1,000 / C) Watt-hours</div>
              <div>• In 1 hour (3,600 seconds), number of blinks = 3,600 / T</div>
              <div className="text-white font-bold text-sm pt-1">
                Active Power (Watts) = (3,600 × 1,000) ÷ (T × imp/kWh)
              </div>
            </div>
            <p className="leading-relaxed text-slate-400">
              Where <strong className="text-white">T</strong> is the interval in seconds between two consecutive red blinks.
              If your meter is 3200 imp/kWh and blinks once every 3.6 seconds:
              <br />
              <span className="font-mono text-emerald-400 font-bold">
                Power = 3,600,000 ÷ (3.6 × 3200) = 312.5 Watts
              </span>
            </p>
          </div>

          {/* Section 2: How to find imp/kWh */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              2. Where to Find imp/kWh on Your Meter
            </h4>
            <p className="leading-relaxed text-slate-300">
              Look directly at the front glass faceplate of your electricity meter. Next to the red blinking LED (often labeled &ldquo;CAL&rdquo; or &ldquo;kWh&rdquo;), you will see text stamped like:
            </p>
            <div className="flex flex-wrap gap-2 my-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-amber-500/30 text-amber-300">
                1600 imp/kWh (Very common)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-amber-500/30 text-amber-300">
                3200 imp/kWh (Very common)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                800 imp/kWh
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                6400 imp/kWh
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Tip: The faster the red LED flashes, the more electricity is currently flowing into your house. If you turn off an AC or water heater, the flashes will noticeably slow down.
            </p>
          </div>

          {/* Section 3: Tamil Nadu TANGEDCO Domestic Tariff Slabs */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              3. Tamil Nadu Domestic Tariff Slabs (TANGEDCO)
            </h4>
            <p className="leading-relaxed mb-3 text-slate-300">
              In Tamil Nadu, residential power is metered and billed on a <strong className="text-white">bi-monthly (60 days)</strong> cycle. There are two major billing tiers:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30">
                <div className="font-bold text-emerald-400 mb-1">Tier 1: Up to 500 Units / 60-days</div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li>• 0 – 200 units: <span className="text-emerald-400 font-bold">FREE (Subsidy)</span></li>
                  <li>• 201 – 400 units: ₹4.70 / unit</li>
                  <li>• 401 – 500 units: ₹6.30 / unit</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30">
                <div className="font-bold text-amber-400 mb-1">Tier 2: Above 500 Units (New CM Tariff)</div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li>• 0 – 100 units: <span className="text-emerald-400 font-bold">FREE</span></li>
                  <li>• 101 – 400 units: ₹4.70 / unit</li>
                  <li>• 401 – 500 units: ₹6.30 / unit</li>
                  <li>• 501 – 600 units: ₹8.40 / unit</li>
                  <li>• 601 – 800 units: ₹9.45 / unit</li>
                  <li>• 801 – 1000 units: ₹10.50 / unit</li>
                  <li>• 1000+ units: ₹11.55 / unit</li>
                </ul>
              </div>
            </div>

            <p className="text-slate-400 text-[11px]">
              Notice the penalty jump: If your 60-day consumption crosses 500 units even by 1 unit, the free units subsidy drops from 200 units down to 100 units, and the subsequent slabs carry significantly higher rates.
            </p>
          </div>

          {/* Section 4: Power Saving Pro-Tips */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              4. Energy Saving Pro-Tips
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Use the <strong className="text-white">Load Comparison Log</strong> to check your house base load when all lights & ACs are off (identifies vampire drain from standby electronics).</li>
              <li>Running an Inverter AC at 24°C–26°C instead of 18°C can reduce blink frequency by 30%–40% once the room reaches target temperature.</li>
              <li>Inspect your water pump and refrigerator gasket if your baseline blink rate is unexpectedly fast.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Play, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';

interface BlinkTapperProps {
  onIntervalMeasured: (intervalSeconds: number) => void;
  currentInterval: number;
}

export function BlinkTapper({ onIntervalMeasured, currentInterval }: BlinkTapperProps) {
  const [taps, setTaps] = useState<number[]>([]);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const lastTapRef = useRef<number | null>(null);

  const handleTap = useCallback(() => {
    const now = performance.now();
    setRippleKey((prev) => prev + 1);
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Haptic feedback if available on mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignore vibration errors
      }
    }

    if (lastTapRef.current !== null) {
      const deltaSec = (now - lastTapRef.current) / 1000;

      // Filter out accidental double taps under 0.15s or long pauses (> 120s)
      if (deltaSec >= 0.15 && deltaSec <= 120) {
        setIntervals((prev) => {
          const updated = [...prev.slice(-9), deltaSec]; // keep last 10 intervals
          const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
          onIntervalMeasured(Number(avg.toFixed(3)));
          return updated;
        });
      } else if (deltaSec > 120) {
        // Treated as fresh start after long pause
        setIntervals([]);
      }
    }

    lastTapRef.current = now;
    setTaps((prev) => [...prev, now]);
  }, [onIntervalMeasured]);

  const handleReset = () => {
    lastTapRef.current = null;
    setTaps([]);
    setIntervals([]);
  };

  const currentAverage =
    intervals.length > 0
      ? (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(2)
      : null;

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/20 box-glow-cyan/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
            Live Tap-to-Measure
          </h3>
        </div>
        {taps.length > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Taps
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Stand in front of your electric meter. Tap the button every time the red LED blinks to measure the exact interval.
      </p>

      {/* Big Tactical Tap Button */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <button
          onClick={handleTap}
          type="button"
          className={`relative group w-full py-8 px-6 rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-100 border ${
            isPressing
              ? 'scale-[0.98] bg-cyan-600/30 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)]'
              : 'bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 border-cyan-500/40 hover:border-cyan-400 shadow-[0_4px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-95'
          }`}
        >
          {/* Subtle neon ring outline */}
          <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors pointer-events-none" />

          {/* Pulse circle in center */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform duration-100 ${
              isPressing
                ? 'bg-cyan-400 text-slate-950 scale-110 shadow-[0_0_30px_#22d3ee]'
                : 'bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            <Zap className={`w-8 h-8 ${isPressing ? 'fill-current animate-bounce' : ''}`} />
          </div>

          <div className="text-base font-bold text-white tracking-wide">
            {taps.length === 0 ? 'TAP ON EACH BLINK' : 'TAP ON NEXT BLINK'}
          </div>

          <div className="text-xs text-cyan-400/80 mt-1 font-mono">
            {taps.length === 0
              ? 'Press once when LED flashes'
              : `${taps.length} blink${taps.length > 1 ? 's' : ''} recorded`}
          </div>

          {/* Ripple animation element */}
          {rippleKey > 0 && (
            <span
              key={rippleKey}
              className="absolute inset-0 rounded-2xl border-2 border-cyan-400/80 animate-ping pointer-events-none"
            />
          )}
        </button>
      </div>

      {/* Live Measurement Feedback */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {intervals.length > 0 ? (
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Averaged ({intervals.length} intervals):</span>
            </span>
          ) : (
            <span className="text-slate-500 font-mono flex items-center gap-1">
              <Play className="w-3 h-3 text-cyan-400/60" />
              <span>Ready for first blink</span>
            </span>
          )}
        </div>

        <div className="text-right">
          {currentAverage ? (
            <span className="text-base font-mono font-bold text-cyan-300 glow-cyan">
              {currentAverage}s
            </span>
          ) : (
            <span className="text-slate-400 font-mono">
              {currentInterval > 0 ? `${currentInterval.toFixed(2)}s (manual)` : '—'}
            </span>
          )}
        </div>
      </div>

      {intervals.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-slate-500 uppercase mr-1">Recent samples:</span>
          {intervals.slice(-5).map((inv, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
            >
              {inv.toFixed(2)}s
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

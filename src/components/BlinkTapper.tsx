'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Play, RotateCcw, Zap, CheckCircle2, Flashlight, FlashlightOff, Activity } from 'lucide-react';

interface BlinkTapperProps {
  onIntervalMeasured: (intervalSeconds: number) => void;
  currentInterval: number;
  watts?: number;
  impPerKwh?: number;
}

export function BlinkTapper({
  onIntervalMeasured,
  currentInterval,
  watts = 0,
  impPerKwh = 3200,
}: BlinkTapperProps) {
  const [taps, setTaps] = useState<number[]>([]);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [torchActive, setTorchActive] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lastTapRef = useRef<number | null>(null);

  // Check and toggle camera torch or screen torch for meter reading in dark areas
  const toggleTorch = async () => {
    if (torchActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setTorchActive(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        mediaStreamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        const imageCapture = track as unknown as {
          getCapabilities?: () => { torch?: boolean };
          applyConstraints: (constraints: unknown) => Promise<void>;
        };
        const capabilities = imageCapture.getCapabilities?.();

        if (capabilities && capabilities.torch) {
          await imageCapture.applyConstraints({
            advanced: [{ torch: true }],
          });
        }
      }
      setTorchActive(true);
    } catch {
      // Screen torch fallback mode
      setTorchActive(true);
    }
  };

  const handleTap = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = performance.now();
    setRippleKey((prev) => prev + 1);
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35]);
      } catch {
        // Ignore vibration errors
      }
    }

    if (lastTapRef.current !== null) {
      const deltaSec = (now - lastTapRef.current) / 1000;

      // Filter out accidental double taps under 0.15s or long pauses (> 120s)
      if (deltaSec >= 0.15 && deltaSec <= 120) {
        setIntervals((prev) => {
          const updated = [...prev.slice(-9), deltaSec];
          const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
          onIntervalMeasured(Number(avg.toFixed(3)));
          return updated;
        });
      } else if (deltaSec > 120) {
        setIntervals([]);
      }
    }

    lastTapRef.current = now;
    setTaps((prev) => [...prev, now]);
  }, [onIntervalMeasured]);

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    lastTapRef.current = null;
    setTaps([]);
    setIntervals([]);
  };

  const currentAverage =
    intervals.length > 0
      ? (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(2)
      : null;

  return (
    <>
      {/* Screen Torch Overlay (useful when reading meter outdoors/stairwell at night) */}
      {torchActive && (
        <div
          onClick={toggleTorch}
          className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col items-center justify-between p-6 select-none cursor-pointer"
        >
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 pt-safe">
            Meter Screen Torch Active
          </div>
          <div className="text-center">
            <Flashlight className="w-16 h-16 mx-auto mb-2 text-amber-500 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800">
              Hold phone near meter glass to illuminate
            </p>
            <p className="text-xs text-slate-500 mt-1">Tap anywhere to turn off</p>
          </div>
          <button
            onClick={toggleTorch}
            className="w-full max-w-xs py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl pb-safe"
          >
            Turn Off Torch
          </button>
        </div>
      )}

      <div className="flex flex-col bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-cyan-500/20 box-glow-cyan/40">
        {/* Header with torch and reset */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-wider">
              Live Tap-to-Measure
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Dark meter inspection torch */}
            <button
              onClick={toggleTorch}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                torchActive
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-300'
              }`}
              title="Toggle Torch for reading meter in dark areas"
              type="button"
            >
              {torchActive ? (
                <>
                  <FlashlightOff className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Torch On</span>
                </>
              ) : (
                <>
                  <Flashlight className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Meter Torch</span>
                </>
              )}
            </button>

            {taps.length > 0 && (
              <button
                onClick={handleReset}
                type="button"
                className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4 leading-relaxed">
          Stand in front of your electric meter. Tap each time the red LED blinks to measure the exact interval.
        </p>

        {/* Big Tactical Tap Button */}
        <div className="relative flex flex-col items-center justify-center my-1 sm:my-2">
          <button
            onClick={handleTap}
            type="button"
            style={{ touchAction: 'manipulation' }}
            className={`relative group w-full py-7 sm:py-9 px-4 sm:px-6 rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-100 border cursor-pointer ${
              isPressing
                ? 'scale-[0.98] bg-cyan-600/30 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                : 'bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 border-cyan-500/40 hover:border-cyan-400 shadow-[0_4px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-95'
            }`}
          >
            {/* Subtle neon ring outline */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors pointer-events-none" />

            {/* Pulse circle in center */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2.5 sm:mb-3 transition-transform duration-100 ${
                isPressing
                  ? 'bg-cyan-400 text-slate-950 scale-110 shadow-[0_0_30px_#22d3ee]'
                  : 'bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              <Zap className={`w-7 h-7 sm:w-8 sm:h-8 ${isPressing ? 'fill-current animate-bounce' : ''}`} />
            </div>

            <div className="text-sm sm:text-base font-bold text-white tracking-wide">
              {taps.length === 0 ? 'TAP ON EACH BLINK' : 'TAP ON NEXT BLINK'}
            </div>

            <div className="text-[11px] sm:text-xs text-cyan-400/90 mt-1 font-mono">
              {taps.length === 0
                ? 'Press once when LED flashes'
                : `${taps.length} blink${taps.length > 1 ? 's' : ''} recorded`}
            </div>

            {/* In-button live power badge on mobile */}
            {watts > 0 && (
              <div className="mt-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 font-mono text-xs text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Active Load: <strong className="text-white">{Math.round(watts)} W</strong></span>
              </div>
            )}

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
        <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {intervals.length > 0 ? (
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Avg ({intervals.length} intervals):</span>
              </span>
            ) : (
              <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px] sm:text-xs">
                <Play className="w-3 h-3 text-cyan-400/60 shrink-0" />
                <span>Ready for first blink</span>
              </span>
            )}
          </div>

          <div className="text-right">
            {currentAverage ? (
              <span className="text-sm sm:text-base font-mono font-bold text-cyan-300 glow-cyan">
                {currentAverage}s
              </span>
            ) : (
              <span className="text-slate-400 font-mono text-[11px] sm:text-xs">
                {currentInterval > 0 ? `${currentInterval.toFixed(2)}s (manual)` : '—'}
              </span>
            )}
          </div>
        </div>

        {intervals.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Recent:</span>
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
    </>
  );
}

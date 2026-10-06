'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';

interface SimulatedMeterLedProps {
  intervalSeconds: number;
  watts: number;
}

export function SimulatedMeterLed({ intervalSeconds, watts }: SimulatedMeterLedProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthesized tick/beep on flash if enabled
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext may be blocked before first user interaction
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (intervalSeconds <= 0) return;

    // Trigger flash immediately once
    setIsFlashing(true);
    playBeep();
    const flashTimeout = setTimeout(() => setIsFlashing(false), 140);

    // Set recurring interval
    const intervalMs = intervalSeconds * 1000;
    const intervalId = setInterval(() => {
      setIsFlashing(true);
      playBeep();
      setTimeout(() => setIsFlashing(false), 140);
    }, intervalMs);

    return () => {
      clearTimeout(flashTimeout);
      clearInterval(intervalId);
    };
  }, [intervalSeconds, playBeep]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900/90 rounded-2xl border border-red-500/20 box-glow-red/40 overflow-hidden">
      {/* Background radial gradient glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isFlashing ? 'opacity-30' : 'opacity-5'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.45) 0%, transparent 70%)',
        }}
      />

      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4 z-10 text-xs tracking-wider uppercase">
        <div className="flex items-center gap-1.5 text-red-400 font-mono font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>Meter LED Pulse</span>
        </div>
        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs transition-all ${
            soundEnabled
              ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle audio click on LED blink"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tick On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Tick Off</span>
            </>
          )}
        </button>
      </div>

      {/* Real LED simulation */}
      <div className="relative my-3 flex items-center justify-center">
        {/* Outer metallic bezel ring */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_10px_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {/* Inner ring */}
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center p-2 border border-slate-800">
            {/* The LED bulb itself */}
            <div
              className={`w-14 h-14 rounded-full transition-all duration-75 flex items-center justify-center ${
                isFlashing
                  ? 'bg-red-500 shadow-[0_0_35px_12px_rgba(239,68,68,0.9),0_0_80px_30px_rgba(220,38,38,0.6)] scale-105'
                  : 'bg-red-950/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] scale-95 opacity-50'
              }`}
            >
              {/* LED internal light specular point */}
              <div
                className={`w-4 h-4 rounded-full transition-opacity duration-75 ${
                  isFlashing ? 'bg-white/90 shadow-[0_0_10px_white]' : 'bg-red-500/20'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Ambient pulse wave */}
        {isFlashing && (
          <span className="absolute w-28 h-28 rounded-full border border-red-500/60 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Status metrics below LED */}
      <div className="mt-3 text-center z-10">
        <div className="text-xs text-slate-400 font-mono">
          Blinking every <span className="text-red-400 font-bold">{intervalSeconds > 0 ? intervalSeconds.toFixed(2) : '—'}s</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          {intervalSeconds > 0
            ? `${(60 / intervalSeconds).toFixed(1)} blinks / minute • ${watts.toFixed(0)}W load`
            : 'Enter interval or tap to simulate'}
        </div>
      </div>
    </div>
  );
}

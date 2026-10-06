'use client';

import React, { useState, useEffect } from 'react';
import { History, Plus, Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { SavedSessionLog } from '../types/calculator';

interface SessionLoggerProps {
  currentWatts: number;
  currentInterval: number;
  currentImp: number;
  currentUnitsPerDay: number;
  currentUnitsBiMonthly: number;
  currentCostBiMonthly: number;
  currencySymbol?: string;
}

const STORAGE_KEY = 'eb_meter_calculator_logs';

export function SessionLogger({
  currentWatts,
  currentInterval,
  currentImp,
  currentUnitsPerDay,
  currentUnitsBiMonthly,
  currentCostBiMonthly,
  currencySymbol = '₹',
}: SessionLoggerProps) {
  const [logs, setLogs] = useState<SavedSessionLog[]>([]);
  const [labelInput, setLabelInput] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveLog = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentWatts <= 0) return;

    const newLog: SavedSessionLog = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      label: labelInput.trim() || `Reading @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      impPerKwh: currentImp,
      intervalSeconds: currentInterval,
      watts: currentWatts,
      unitsPerDay: currentUnitsPerDay,
      unitsBiMonthly: currentUnitsBiMonthly,
      costBiMonthly: currentCostBiMonthly,
    };

    const updated = [newLog, ...logs];
    setLogs(updated);
    setLabelInput('');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage limit
    }
  };

  const deleteLog = (id: string) => {
    const updated = logs.filter((item) => item.id !== id);
    setLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const clearAll = () => {
    if (confirm('Clear all saved load readings?')) {
      setLogs([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
            Load Comparison Log
          </h3>
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] sm:text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-850 hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <p className="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4 leading-relaxed">
        Save readings before and after turning appliances on/off to measure their exact power draw and added cost.
      </p>

      {/* Input form */}
      <form onSubmit={saveLog} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-5">
        <div className="relative flex-1">
          <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Label (e.g. 'Night Idle', 'AC ON', 'Water Pump')"
            value={labelInput}
            enterKeyHint="done"
            onChange={(e) => setLabelInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={currentWatts <= 0}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 flex items-center justify-center gap-1.5 transition-colors shrink-0 min-h-[40px] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Reading ({Math.round(currentWatts)}W)
        </button>
      </form>

      {/* Logs Table / List */}
      {logs.length === 0 ? (
        <div className="py-6 sm:py-8 text-center border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500">No saved readings yet.</p>
          <p className="text-[11px] text-slate-600 mt-1">
            Tap or enter a blink interval, label it, and click &ldquo;Save Reading&rdquo; above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, index) => {
            // Compare against previous older reading in the list
            const prevLog = logs[index + 1];
            const wattsDiff = prevLog ? log.watts - prevLog.watts : null;
            const costDiff = prevLog ? log.costBiMonthly - prevLog.costBiMonthly : null;

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {log.intervalSeconds.toFixed(2)}s interval • {log.impPerKwh} imp/kWh
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right font-mono">
                    <div className="font-bold text-cyan-300 text-sm">
                      {Math.round(log.watts)} W
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {log.unitsPerDay.toFixed(1)} u/day • {currencySymbol}{Math.round(log.costBiMonthly)}/60d
                    </div>
                  </div>

                  {/* Difference badge */}
                  {wattsDiff !== null && (
                    <div
                      className={`text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-0.5 ${
                        wattsDiff > 0
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : wattsDiff < 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {wattsDiff > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : wattsDiff < 0 ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : null}
                      <span>
                        {wattsDiff > 0 ? '+' : ''}
                        {Math.round(wattsDiff)}W
                      </span>
                      {costDiff !== null && Math.abs(costDiff) > 1 && (
                        <span className="opacity-80">
                          ({costDiff > 0 ? '+' : ''}{currencySymbol}{Math.round(costDiff)})
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => deleteLog(log.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete reading"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

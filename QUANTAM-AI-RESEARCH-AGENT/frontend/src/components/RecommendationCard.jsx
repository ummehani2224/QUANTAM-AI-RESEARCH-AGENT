import React from "react";
import { Shield, AlertTriangle, ArrowRight } from "lucide-react";

export default function RecommendationCard({ finalDecision, symbol, technical, fundamental, sentiment }) {
  if (!finalDecision) return null;

  const {
    market_bias,
    confidence,
    key_drivers = [],
    watchlist_factors = [],
    summary,
  } = finalDecision;

  const isIndian = symbol && (symbol.endsWith(".NS") || symbol.endsWith(".BO"));

  // Bias helpers
  const bias = market_bias ? market_bias.toUpperCase() : "BULLISH";
  const getBiasColor = (b) => {
    const l = b.toLowerCase();
    if (l.includes("bull") || l.includes("strong") || l.includes("positive") || l.includes("buy")) return "text-emerald-400";
    if (l.includes("bear") || l.includes("weak") || l.includes("negative") || l.includes("sell")) return "text-red-400";
    return "text-amber-400";
  };

  // Ring progress calculations
  const radius = 42;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const percentage = confidence || 50;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 fade-in-up">
      
      {/* ── Synthesis Narrative (Left) ── */}
      <div className="lg:col-span-8 bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between min-h-[260px]">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">SYNTHESIS NARRATIVE</span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-orange-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>AI AGENT STATUS: ACTIVE</span>
            </div>
          </div>

          {/* Narrative text */}
          <p className="text-slate-200 text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Drivers and Triggers Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4 mt-4 text-xs font-mono">
          
          {/* Key Decision Drivers */}
          <div className="space-y-2.5">
            <span className="text-slate-500 font-bold text-[8.5px] uppercase tracking-wider block">Key Decision Drivers</span>
            <ul className="space-y-2">
              {key_drivers.slice(0, 2).map((drv, idx) => (
                <li key={idx} className="flex gap-2 items-start text-slate-350 leading-relaxed">
                  <span className="text-[#FFBA9D] font-bold">→</span>
                  <span>{drv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Watchlist & Risk Triggers */}
          <div className="space-y-2.5">
            <span className="text-slate-500 font-bold text-[8.5px] uppercase tracking-wider block">Watchlist & Risk Triggers</span>
            <ul className="space-y-2">
              {watchlist_factors.slice(0, 2).map((fac, idx) => (
                <li key={idx} className="flex gap-2 items-start text-slate-350 leading-relaxed">
                  <AlertTriangle size={10} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Consensus Verdict Ring Gauge (Right) ── */}
      <div className="lg:col-span-4 bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between items-center text-center min-h-[260px]">
        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">CONSENSUS VERDICT</span>
        
        {/* Ring progress circle */}
        <div className="relative w-32 h-32 flex items-center justify-center my-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Gray track circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Colored progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#gaugeBiasGrad)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Color Gradient mapping based on bias */}
          <svg className="hidden">
            <defs>
              <linearGradient id="gaugeBiasGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={bias.includes("BULL") ? "#10b981" : bias.includes("BEAR") ? "#ef4444" : "#f59e0b"} />
                <stop offset="100%" stopColor="#ffb088" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
            <span className="text-2xl font-black text-white leading-none">{percentage}%</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Confidence</span>
          </div>
        </div>

        {/* Verdict bias text */}
        <div className={`text-lg font-black font-mono tracking-widest uppercase ${getBiasColor(bias)}`}>
          {bias}
        </div>
      </div>

    </div>
  );
}

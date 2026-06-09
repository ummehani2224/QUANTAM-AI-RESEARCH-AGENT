// AgentCard.jsx — Redesigned as Premium Glassmorphism Terminal Card
import React from "react";
import { Cpu, TrendingUp, Landmark, Newspaper, Award, Activity } from "lucide-react";

function AgentCard({ title, icon, verdict, confidence, reason, details, delay = 0, onExpand }) {
  const isTech = title.toLowerCase().includes("technical");
  const isFund = title.toLowerCase().includes("fundamental");
  const isSent = title.toLowerCase().includes("sentiment");

  // Style helpers based on verdict
  function getVerdictBadgeStyle(v) {
    const l = v ? v.toLowerCase() : "";
    if (["bullish", "strong", "positive"].includes(l)) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (["bearish", "weak", "negative"].includes(l)) {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  function getConfFillStyle(v) {
    const l = v ? v.toLowerCase() : "";
    if (["bullish", "strong", "positive"].includes(l)) return "bg-emerald-500";
    if (["bearish", "weak", "negative"].includes(l)) return "bg-red-500";
    return "bg-amber-500";
  }

  return (
    <div
      onClick={onExpand}
      className="quantum-card group relative flex flex-col justify-between p-5 cursor-pointer overflow-hidden active:scale-98 select-none"
      style={{
        animationDelay: `${delay}s`,
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-slate-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header Title Row */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
              {isTech && <TrendingUp size={14} className="text-slate-300" />}
              {isFund && <Landmark size={14} className="text-slate-300" />}
              {isSent && <Newspaper size={14} className="text-slate-300" />}
            </div>
            <div>
              <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono">{title.split(" ")[0]} NODE</h4>
              <p className="text-[10px] text-slate-500 font-mono font-semibold">CO-PROCESSOR</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono tracking-wide ${getVerdictBadgeStyle(verdict)}`}>
            {verdict}
          </span>
        </div>

        {/* Confidence Indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Conviction</span>
            <span className="text-white font-black">{confidence}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#060816] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${getConfFillStyle(verdict)}`} 
              style={{ width: `${confidence}%` }} 
            />
          </div>
        </div>

        {/* Custom Quick Metrics summary */}
        {isTech && details && (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#060816]/60 p-2.5 rounded-xl border border-white/5 mb-4">
            <div>
              <span className="text-slate-500 block">S/R Proximity</span>
              <span className="text-white font-bold block mt-0.5">{(details.distance_to_support || 0).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Volatility</span>
              <span className="text-white font-bold block mt-0.5">{(details.volatility || 0).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {isFund && details && (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#060816]/60 p-2.5 rounded-xl border border-white/5 mb-4">
            <div>
              <span className="text-slate-500 block">Health Rating</span>
              <span className="text-white font-bold block mt-0.5">{details.health_score}/100</span>
            </div>
            <div>
              <span className="text-slate-500 block">Valuation</span>
              <span className="text-white font-bold block mt-0.5">{details.valuation_score}/100</span>
            </div>
          </div>
        )}

        {isSent && details && (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#060816]/60 p-2.5 rounded-xl border border-white/5 mb-4">
            <div>
              <span className="text-slate-500 block">Bullish Ratio</span>
              <span className="text-emerald-400 font-bold block mt-0.5">{Math.round(details.positive_ratio * 100)}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Bearish Ratio</span>
              <span className="text-red-400 font-bold block mt-0.5">{Math.round(details.negative_ratio * 100)}%</span>
            </div>
          </div>
        )}

        {/* Narrative Summary */}
        <p className="text-slate-400 text-[10px] leading-relaxed font-light line-clamp-3">
          {reason || details?.summary}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold tracking-wider group-hover:text-white transition-colors duration-200">
        <span>LAUNCH TERMINAL</span>
        <span>→</span>
      </div>
    </div>
  );
}

export default AgentCard;

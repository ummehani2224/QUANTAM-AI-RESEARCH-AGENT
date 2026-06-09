import React from "react";
import { Shield } from "lucide-react";

function SystemStatusCard({ systemStatus }) {
  if (!systemStatus) return null;

  const {
    backend_status,
    groq_status,
    yfinance_status,
    news_status,
    cache_status,
    cache_ttl_sec,
    execution_time_sec,
  } = systemStatus;

  // Status badge styling helper
  function getStatusBadge(status) {
    const s = status ? status.toLowerCase() : "";
    if (s === "online" || s === "hit" || s === "active" || s === "ok") {
      return { text: "Online", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500 shadow-emerald-500/40" };
    }
    if (s === "fallback mode" || s === "fallback") {
      return { text: "Fallback Active", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500 shadow-amber-500/40 animate-pulse" };
    }
    if (s === "miss") {
      return { text: "Bypassed (Miss)", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", dot: "bg-blue-500 shadow-blue-500/40" };
    }
    return { text: "Offline", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500 shadow-red-500/40" };
  }

  const backend = getStatusBadge(backend_status);
  const groq = getStatusBadge(groq_status);
  const yfinance = getStatusBadge(yfinance_status);
  const news = getStatusBadge(news_status);
  const cache = getStatusBadge(cache_status);

  return (
    <div className="quantum-card p-5 mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div>
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">Gateway Telemetry</span>
          <h3 className="text-white font-black text-base mt-1 flex items-center gap-1.5">
            <Shield size={16} className="text-blue-400" /> System Infrastructure Status
          </h3>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[10px] block">Latency</span>
          <span className="text-xs font-mono font-bold text-blue-400">{execution_time_sec}s</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Backend Node */}
        <div className={`rounded-xl border ${backend.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Backend API</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${backend.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${backend.color}`}>{backend.text}</span>
          </div>
        </div>

        {/* Groq Node */}
        <div className={`rounded-xl border ${groq.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Groq LLM Gateway</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${groq.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${groq.color}`}>{groq.text}</span>
          </div>
        </div>

        {/* Yahoo Finance Node */}
        <div className={`rounded-xl border ${yfinance.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Yahoo Finance</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${yfinance.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${yfinance.color}`}>{yfinance.text}</span>
          </div>
        </div>

        {/* News Service Node */}
        <div className={`rounded-xl border ${news.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">News Harvester</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${news.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${news.color}`}>{news.text}</span>
          </div>
        </div>

        {/* Cache In-Memory Node */}
        <div className={`rounded-xl border ${cache.bg} p-3 flex flex-col justify-between col-span-2 sm:col-span-1`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Cache Layer</span>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cache.dot} shadow-[0_0_8px]`} />
              <span className={`text-xs font-bold ${cache.color}`}>{cache.text}</span>
            </div>
            {cache_status.toLowerCase() === "hit" && (
              <span className="text-[9px] text-slate-500 font-mono">TTL: {cache_ttl_sec}s</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemStatusCard;

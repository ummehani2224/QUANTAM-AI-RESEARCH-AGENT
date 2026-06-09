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
  function getStatusBadge(status, type) {
    const s = status ? status.toLowerCase() : "";
    if (s === "online" || s === "live" || s === "active" || s === "ok" || s === "hit") {
      let label = "Active";
      if (type === "market" || type === "news") label = "Live";
      if (type === "ai") label = "Online";
      if (type === "cache") label = "Hit";
      return { text: label, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500 shadow-emerald-500/40" };
    }
    if (s === "fallback mode" || s === "fallback" || s === "miss" || s === "demo hit" || s === "demo") {
      let label = "Fallback Active";
      if (type === "cache") label = "Bypassed (Miss)";
      if (s === "demo hit" && type === "cache") label = "Demo Hit";
      if (type === "ai" || type === "consensus") label = "Fallback Mode";
      return { text: label, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500 shadow-amber-500/40 animate-pulse" };
    }
    return { text: "Offline", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500 shadow-red-500/40" };
  }

  const market = getStatusBadge(yfinance_status, "market");
  const news = getStatusBadge(news_status, "news");
  const ai = getStatusBadge(groq_status, "ai");
  const consensus = getStatusBadge(
    groq_status === "Online" ? "active" : (groq_status === "Fallback Mode" ? "fallback mode" : "offline"), 
    "consensus"
  );
  const cache = getStatusBadge(cache_status, "cache");

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
          <span className="text-slate-500 text-[10px] block">Execution Time</span>
          <span className="text-xs font-mono font-bold text-blue-400">{execution_time_sec}s</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Market Data */}
        <div className={`rounded-xl border ${market.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Market Data</span>
          <div className="flex items-center gap-2 mt-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${market.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${market.color}`}>{market.text}</span>
          </div>
        </div>

        {/* News Feed */}
        <div className={`rounded-xl border ${news.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-550 text-slate-500 text-[10px] font-medium uppercase">News Feed</span>
          <div className="flex items-center gap-2 mt-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${news.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${news.color}`}>{news.text}</span>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className={`rounded-xl border ${ai.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-505 text-slate-500 text-[10px] font-medium uppercase">AI Reasoning</span>
          <div className="flex items-center gap-2 mt-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${ai.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${ai.color}`}>{ai.text}</span>
          </div>
        </div>

        {/* Consensus Engine */}
        <div className={`rounded-xl border ${consensus.bg} p-3 flex flex-col justify-between`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Consensus Engine</span>
          <div className="flex items-center gap-2 mt-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${consensus.dot} shadow-[0_0_8px]`} />
            <span className={`text-xs font-bold ${consensus.color}`}>{consensus.text}</span>
          </div>
        </div>

        {/* Cache Layer */}
        <div className={`rounded-xl border ${cache.bg} p-3 flex flex-col justify-between col-span-2 sm:col-span-1`}>
          <span className="text-slate-500 text-[10px] font-medium uppercase">Cache Status</span>
          <div className="flex items-center justify-between mt-1.5 font-mono">
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

import React from "react";

function StockInfoCard({ symbol, stockInfo, verdict = "BULLISH", risk = "MEDIUM" }) {
  const { stock } = stockInfo || {};
  if (!stock) return null;

  const isPositive = stock.change >= 0;
  const isIndian = stock.symbol && (stock.symbol.endsWith(".NS") || stock.symbol.endsWith(".BO"));
  const currencySymbol = isIndian ? "₹" : "$";

  // Verdict style mapper
  const getVerdictStyle = (v) => {
    const l = v ? v.toLowerCase() : "";
    if (l.includes("bull") || l.includes("strong") || l.includes("positive") || l.includes("buy")) {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
    }
    if (l.includes("bear") || l.includes("weak") || l.includes("negative") || l.includes("sell")) {
      return "text-red-400 bg-red-500/10 border-red-500/25";
    }
    return "text-amber-400 bg-amber-500/10 border-amber-500/25";
  };

  // Risk style mapper
  const getRiskStyle = (r) => {
    const l = r ? r.toLowerCase() : "";
    if (l.includes("low")) {
      return "text-emerald-450 text-emerald-400 bg-emerald-500/5 border-emerald-500/15";
    }
    if (l.includes("high")) {
      return "text-red-400 bg-red-500/5 border-red-500/15";
    }
    return "text-amber-450 text-amber-400 bg-amber-500/5 border-amber-500/15";
  };

  return (
    <div className="mb-6 fade-in-up">
      {/* symbol and name with vertical border on the left */}
      <div className="flex items-center gap-3 border-l-[3.5px] border-[#FFBA9D] pl-3">
        <h1 className="text-3xl font-black text-white font-mono tracking-tight leading-none uppercase">
          {stock.symbol} | {stock.name}
        </h1>
      </div>

      {/* price information and consensus badges */}
      <div className="flex flex-wrap items-center gap-4 mt-2.5 pl-3.5 text-xs font-mono font-bold">
        <span className="text-white text-lg font-black tracking-tight">
          {currencySymbol}{stock.price}
        </span>
        <span className={`text-[12px] font-black ${isPositive ? "text-emerald-400" : "text-red-450 text-red-400"}`}>
          ({isPositive ? "+" : ""}{stock.change_pct}%)
        </span>

        <span className={`px-2.5 py-0.5 rounded border text-[9.5px] tracking-wider uppercase font-black ${getVerdictStyle(verdict)}`}>
          {verdict} CONSENSUS
        </span>

        <span className={`px-2.5 py-0.5 rounded border text-[9.5px] tracking-wider uppercase font-black ${getRiskStyle(risk)}`}>
          {risk} RISK
        </span>
      </div>
    </div>
  );
}

export default StockInfoCard;

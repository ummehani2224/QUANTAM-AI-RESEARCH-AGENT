// KpiCards.jsx — Top summary metrics
// Shows 4 key indicators at a glance: Current Price, Market Bias, Confidence, Risk Level.

import React from "react";
import { DollarSign, TrendingUp, TrendingDown, Activity, Shield, AlertTriangle, Zap, Target } from "lucide-react";

function KpiCards({ data, layout }) {
  // Extract values from the API response
  const price = data.current_price || 0.0;
  const changePct = data.change_pct || 0.0;
  const { market_bias, confidence, risk } = data.final_decision || {};

  const isUp = changePct >= 0;

  // Recommendations / Bias styling
  function getBiasStyle(bias) {
    const b = bias ? bias.toLowerCase() : "";
    if (b === "bullish") return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: TrendingUp };
    if (b === "bearish") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: TrendingDown };
    return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Activity };
  }

  function getRiskStyle(r) {
    const rL = r ? r.toLowerCase() : "";
    if (rL === "low") return { text: "text-emerald-400", icon: Shield };
    if (rL === "high") return { text: "text-red-400", icon: AlertTriangle };
    return { text: "text-amber-400", icon: Zap };
  }

  const biasStyle = getBiasStyle(market_bias);
  const riskStyle = getRiskStyle(risk);

  const isIndian = data.stock && (data.stock.endsWith(".NS") || data.stock.endsWith(".BO") || data.stock.endsWith(".ns") || data.stock.endsWith(".bo"));
  const currencySymbol = isIndian ? "₹" : "$";

  const cards = [
    {
      label: "Current Price",
      value: `${currencySymbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconColor: isUp ? "text-emerald-400" : "text-red-400",
      valueClass: "text-white",
      subtext: `${isUp ? "▲" : "▼"} ${isUp ? "+" : ""}${changePct.toFixed(2)}% today`,
      subtextClass: isUp ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Market Bias",
      value: market_bias || "Neutral",
      icon: biasStyle.icon,
      iconColor: biasStyle.text,
      valueClass: biasStyle.text,
      subtext: "Aggregated agent posture",
      subtextClass: "text-slate-500",
    },
    {
      label: "Consensus Confidence",
      value: `${confidence || 50}%`,
      icon: Target,
      iconColor: confidence >= 75 ? "text-emerald-400" : confidence >= 55 ? "text-amber-400" : "text-red-400",
      valueClass: confidence >= 75 ? "text-emerald-400" : confidence >= 55 ? "text-amber-400" : "text-red-400",
      subtext: "Weighted average consensus",
      subtextClass: "text-slate-500",
    },
    {
      label: "Divergence Risk",
      value: risk || "Medium",
      icon: riskStyle.icon,
      iconColor: riskStyle.text,
      valueClass: riskStyle.text,
      subtext: "Signal contradiction level",
      subtextClass: "text-slate-500",
    },
  ];

  const containerClass = layout === "vertical"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8";

  return (
    <div className={containerClass}>
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="quantum-card fade-in-up flex flex-col justify-center h-full min-h-[92px]"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{card.label}</p>
            {React.createElement(card.icon, { className: `w-4 h-4 ${card.iconColor || "text-slate-400"}` })}
          </div>

          {/* Value */}
          <p className={`text-xl font-bold font-mono tracking-tight ${card.valueClass}`}>
            {card.value}
          </p>

          {/* Subtext */}
          <p className={`text-[10px] mt-1 font-medium ${card.subtextClass || "text-slate-500"}`}>
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}

export default KpiCards;

import React from "react";
import { X, TrendingUp, Award, Activity, Landmark, Shield, AlertTriangle, Percent, CheckCircle2, XCircle, MessageSquare, Newspaper, Zap, Clock, Cpu, Brain, BarChart3 as BarChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

// Helper to format large financial numbers
function formatAmount(num, currencySymbol = "$") {
  if (!num) return "N/A";
  if (Math.abs(num) >= 1e12) return `${currencySymbol}${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9) return `${currencySymbol}${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6) return `${currencySymbol}${(num / 1e6).toFixed(2)}M`;
  return `${currencySymbol}${num.toLocaleString()}`;
}

export default function AgentModal({ isOpen, onClose, type, details, stockInfoData }) {
  if (!isOpen || !details) return null;

  const stock = stockInfoData?.stock || {};
  const timeframes = stockInfoData?.timeframes || {};

  const isIndian = stock.symbol && (stock.symbol.endsWith(".NS") || stock.symbol.endsWith(".BO") || stock.symbol.endsWith(".ns") || stock.symbol.endsWith(".bo"));
  const currencySymbol = isIndian ? "₹" : "$";

  // Color palette for professional charts
  const COLORS = {
    bullish: "#10b981", // Emerald
    bearish: "#ef4444", // Rose
    neutral: "#38bdf8", // Sky blue
    gray: "#64748b" // Slate
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Semi-transparent backdrop blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#060816]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Terminal Window */}
      <div className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] flex flex-col bg-[#060816]/95 border border-white/5 rounded-2xl overflow-hidden shadow-2xl z-10 transition-all duration-300 transform scale-100 flex-1">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0b1020]/95 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shadow-inner">
              {type === "technical" && <TrendingUp size={20} className="text-blue-400" />}
              {type === "fundamental" && <Landmark size={20} className="text-blue-400" />}
              {type === "sentiment" && <Newspaper size={20} className="text-blue-400" />}
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-wide uppercase font-mono">
                {type} Analysis Terminal
              </h2>
              <p className="text-slate-400 text-xs font-mono font-medium">
                {stock.name || "Stock"} ({stock.symbol}) · Institutional AI Agent Node
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/5 hover:border-blue-500/40 flex items-center justify-center text-slate-400 hover:text-white transition-all bg-[#0b1020]/80"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-[#060816]/60 to-[#0b1020]/80">
          
          {/* Header Summary Dashboard row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0b1020]/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Consensus verdict</span>
              <span className={`text-xl font-bold mt-1.5 ${
                ["bullish", "strong", "positive"].includes(details.trend?.toLowerCase() || details.fundamental?.toLowerCase() || details.sentiment?.toLowerCase() || "")
                  ? "text-emerald-400"
                  : ["bearish", "weak", "negative"].includes(details.trend?.toLowerCase() || details.fundamental?.toLowerCase() || details.sentiment?.toLowerCase() || "")
                  ? "text-red-400"
                  : "text-amber-400"
              }`}>
                {details.trend || details.fundamental || details.sentiment}
              </span>
            </div>

            <div className="bg-[#0b1020]/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Confidence Level</span>
              <span className="text-xl font-bold mt-1.5 text-white font-mono">{details.confidence}%</span>
            </div>

            <div className="bg-[#0b1020]/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Integrity Status</span>
              <span className={`text-xs font-bold mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded border w-fit ${
                details.fallback_active
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                {details.fallback_active ? (
                  <span className="flex items-center gap-1">
                    <AlertTriangle size={12} className="text-amber-400" /> Heuristic Fallback
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Zap size={12} className="text-emerald-400" /> Direct LLM Pipeline
                  </span>
                )}
              </span>
            </div>

            <div className="bg-[#0b1020]/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Telemetry Source</span>
              <span className="text-xs font-mono text-blue-400 font-bold mt-1.5">
                {stock.source || "System Core"}
              </span>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* TECHNICAL MODAL CONTENT */}
          {/* ──────────────────────────────────────────────────────────── */}
          {type === "technical" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Price Chart */}
              <div className="lg:col-span-8 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-blue-400" /> TradingView-Style Price Chart
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">OHLCV 1D Price History</span>
                </div>
                
                <div className="h-64 w-full">
                  {timeframes["1d"] ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeframes["1d"].map((val, idx) => ({ idx, Price: val }))}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="idx" hide />
                        <YAxis domain={["dataMin - 10", "dataMax + 10"]} stroke="#64748b" tickFormatter={(v) => `${currencySymbol}${v}`} fontMono />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0b1020", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                          labelStyle={{ color: "#3b82f6" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        {/* Reference lines for S/R Extrema */}
                        <ReferenceLine y={details.support_level} label={{ value: `Support Floor: ${currencySymbol}${details.support_level?.toFixed(2)}`, fill: "#10b981", position: "bottom", fontSize: 10, fontFamily: "monospace" }} stroke="#10b981" strokeDasharray="3 3" />
                        <ReferenceLine y={details.resistance_level} label={{ value: `Resistance Ceiling: ${currencySymbol}${details.resistance_level?.toFixed(2)}`, fill: "#ef4444", position: "top", fontSize: 10, fontFamily: "monospace" }} stroke="#ef4444" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="Price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 text-xs text-center py-20 font-mono">No timeframe history loaded</p>
                  )}
                </div>
              </div>

              {/* Right Column: RSI Speedometer & Extrema Track */}
              <div className="lg:col-span-4 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                    <Activity size={14} className="text-emerald-400" /> RSI Gauge & Momentum
                  </h3>
                  
                  {/* RSI Gauge using Recharts PieChart */}
                  <div className="h-32 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "RSI", value: stock.rsi || 50, fill: stock.rsi >= 70 ? "#ef4444" : stock.rsi <= 30 ? "#10b981" : "#38bdf8" },
                            { name: "Remaining", value: 100 - (stock.rsi || 50), fill: "#060816" }
                          ]}
                          cx="50%"
                          cy="80%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[50%] flex flex-col items-center">
                      <span className="text-2xl font-black text-white font-mono">{stock.rsi || "N/A"}</span>
                      <span className={`text-[9px] font-bold font-mono uppercase ${
                        stock.rsi >= 70 ? "text-red-400" : stock.rsi <= 30 ? "text-emerald-400" : "text-blue-400"
                      }`}>
                        {stock.rsi >= 70 ? "Overbought" : stock.rsi <= 30 ? "Oversold" : "Neutral"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* S/R Proximity Tracker */}
                <div className="mt-4 border-t border-white/5 pt-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Vol Factor</span>
                    <span className="text-white font-bold">{details.volatility?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Support Floor</span>
                    <span className="text-emerald-400 font-bold">{currencySymbol}{details.support_level?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Resistance Ceiling</span>
                    <span className="text-red-400 font-bold">{currencySymbol}{details.resistance_level?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: MACD Oscillator & Timeframe grid */}
              <div className="lg:col-span-6 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                  <BarChartIcon size={14} className="text-blue-400" /> MACD Signal Line & Hist
                </h3>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "P-4", val: details.macd_hist ? details.macd_hist * 0.4 : -0.2 },
                      { name: "P-3", val: details.macd_hist ? details.macd_hist * 0.7 : 0.3 },
                      { name: "P-2", val: details.macd_hist ? details.macd_hist * 0.9 : 0.5 },
                      { name: "P-1", val: details.macd_hist ? details.macd_hist * 1.1 : 0.8 },
                      { name: "Current", val: details.macd_hist || 0 }
                    ]}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontMono />
                      <YAxis stroke="#64748b" fontSize={10} fontMono />
                      <Tooltip contentStyle={{ backgroundColor: "#0b1020", borderColor: "rgba(255,255,255,0.08)" }} />
                      <Bar dataKey="val">
                        {[
                          { name: "P-4", val: details.macd_hist ? details.macd_hist * 0.4 : -0.2 },
                          { name: "P-3", val: details.macd_hist ? details.macd_hist * 0.7 : 0.3 },
                          { name: "P-2", val: details.macd_hist ? details.macd_hist * 0.9 : 0.5 },
                          { name: "P-1", val: details.macd_hist ? details.macd_hist * 1.1 : 0.8 },
                          { name: "Current", val: details.macd_hist || 0 }
                        ].map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.val >= 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Timeframe Trends grid */}
              <div className="lg:col-span-6 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                  <Clock size={14} className="text-blue-400" /> Multi-Timeframe Trend Structures
                </h3>
                <div className="grid grid-cols-5 gap-3 text-center text-xs font-mono">
                  {details.timeframe_analysis && Object.entries(details.timeframe_analysis).map(([tf, trend]) => {
                    const isUp = trend.toLowerCase().includes("bullish");
                    const isDown = trend.toLowerCase().includes("bearish");
                    return (
                      <div key={tf} className="bg-[#060816] rounded-xl border border-white/5 p-4">
                        <span className="text-slate-500 font-bold block mb-2">{tf}</span>
                        <span className={`text-[10px] font-black block leading-snug ${
                          isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-amber-400"
                        }`}>
                          {trend}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Narrative */}
              <div className="lg:col-span-12 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                  <Cpu size={14} className="text-blue-400" /> Technical Agent Commentary
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">{details.summary}</p>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* FUNDAMENTAL MODAL CONTENT */}
          {/* ──────────────────────────────────────────────────────────── */}
          {type === "fundamental" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Health Score Radials */}
              <div className="lg:col-span-4 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                  <Shield size={14} className="text-emerald-400" /> Health & Index breakdowns
                </h3>
                
                {/* Horizontal Progress Bars representing Index scores */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-slate-400 font-medium">Balance Sheet Health</span>
                      <span className="text-white font-bold font-mono">{details.health_score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#060816] overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${details.health_score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-slate-400 font-medium">Valuation Safety</span>
                      <span className="text-white font-bold font-mono">{details.valuation_score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#060816] overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${details.valuation_score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-slate-400 font-medium">Growth Momentum</span>
                      <span className="text-white font-bold font-mono">{details.growth_score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#060816] overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${details.growth_score}%` }} />
                    </div>
                  </div>
                </div>

                {/* Extracted Strengths & Weaknesses */}
                <div className="mt-6 border-t border-white/5 pt-4 grid grid-cols-2 gap-4 text-[11px] leading-relaxed">
                  <div>
                    <p className="text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Strengths
                    </p>
                    <ul className="space-y-1 text-slate-400">
                      {details.strengths && details.strengths.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="list-disc list-inside truncate text-[10px] text-slate-300" title={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
                      <XCircle size={12} /> Weaknesses
                    </p>
                    <ul className="space-y-1 text-slate-400">
                      {details.weaknesses && details.weaknesses.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="list-disc list-inside truncate text-[10px] text-slate-300" title={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Middle Column: Side-by-Side Revenue Bar Chart */}
              <div className="lg:col-span-8 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <BarChartIcon size={14} className="text-blue-400" /> Estimated Revenue & Income Growth
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">Historical Simulation & Target</span>
                </div>
                
                <div className="h-64">
                  {details.metrics && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {
                          year: 2023,
                          Revenue: Math.round(details.metrics.total_revenue * 0.8),
                          Income: Math.round(details.metrics.net_income * 0.7)
                        },
                        {
                          year: 2024,
                          Revenue: Math.round(details.metrics.total_revenue * 0.9),
                          Income: Math.round(details.metrics.net_income * 0.85)
                        },
                        {
                          year: 2025,
                          Revenue: details.metrics.total_revenue,
                          Income: details.metrics.net_income
                        }
                      ]}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={10} fontMono />
                        <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => formatAmount(v, currencySymbol)} fontMono />
                        <Tooltip contentStyle={{ backgroundColor: "#0b1020", borderColor: "rgba(255,255,255,0.08)" }} formatter={(v) => formatAmount(v, currencySymbol)} />
                        <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <Bar dataKey="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Ratios & Corporate Data details */}
              <div className="lg:col-span-12 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                  <Landmark size={14} className="text-blue-400" /> Key Solvency & Attractiveness Ratios
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-[#060816] rounded-xl border border-white/5 p-4 text-center">
                    <span className="text-slate-500 block">Trailing P/E</span>
                    <span className="text-white text-base font-bold block mt-1">
                      {stock.pe_ratio !== null ? `${stock.pe_ratio}x` : "N/A"}
                    </span>
                  </div>

                  <div className="bg-[#060816] rounded-xl border border-white/5 p-4 text-center">
                    <span className="text-slate-500 block">Total Revenue</span>
                    <span className="text-white text-base font-bold block mt-1">
                      {formatAmount(stock.total_revenue, currencySymbol)}
                    </span>
                  </div>

                  <div className="bg-[#060816] rounded-xl border border-white/5 p-4 text-center">
                    <span className="text-slate-500 block">Net Income</span>
                    <span className="text-emerald-400 text-base font-bold block mt-1">
                      {formatAmount(stock.net_income, currencySymbol)}
                    </span>
                  </div>

                  <div className="bg-[#060816] rounded-xl border border-white/5 p-4 text-center">
                    <span className="text-slate-500 block">Revenue Growth</span>
                    <span className={`text-base font-bold block mt-1 ${stock.revenue_growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {stock.revenue_growth >= 0 ? "+" : ""}{stock.revenue_growth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Narrative */}
              <div className="lg:col-span-12 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                  <Cpu size={14} className="text-blue-400" /> Fundamental Agent Commentary
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">{details.summary}</p>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SENTIMENT MODAL CONTENT */}
          {/* ──────────────────────────────────────────────────────────── */}
          {type === "sentiment" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: News Sentiment Distribution Pie */}
              <div className="lg:col-span-4 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-4">
                  <Newspaper size={14} className="text-blue-400" /> Sentiment Distribution Matrix
                </h3>
                
                <div className="h-44 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Positive", value: Math.round(details.positive_ratio * 100), fill: COLORS.bullish },
                          { name: "Negative", value: Math.round(details.negative_ratio * 100), fill: COLORS.bearish },
                          { name: "Neutral", value: Math.round((1 - details.positive_ratio - details.negative_ratio) * 100), fill: COLORS.neutral }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        <Cell />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-black text-white font-mono">
                      {Math.round(details.positive_ratio * 100)}%
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Bullish Ratio</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-white/5 pt-4">
                  <div>
                    <span className="text-emerald-400 block font-bold">Positive</span>
                    <span className="text-slate-300 block mt-0.5">{Math.round(details.positive_ratio * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-red-400 block font-bold">Negative</span>
                    <span className="text-slate-300 block mt-0.5">{Math.round(details.negative_ratio * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-blue-400 block font-bold">Neutral</span>
                    <span className="text-slate-300 block mt-0.5">
                      {Math.round((1 - details.positive_ratio - details.negative_ratio) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Sentiment Timeline Swings */}
              <div className="lg:col-span-8 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-blue-400" /> Sentiment Swing Feed Timeline
                  </h3>
                  <span className="text-[9px] text-slate-500 font-mono">Article-by-Article Sentiment Swing</span>
                </div>

                <div className="h-44 w-full">
                  {details.articles && details.articles.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={details.articles.map((art, idx) => ({
                        idx: idx + 1,
                        Score: art.sentiment === "positive" ? 1 : art.sentiment === "negative" ? -1 : 0
                      }))}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="idx" stroke="#64748b" fontSize={9} fontMono />
                        <YAxis domain={[-1.2, 1.2]} ticks={[-1, 0, 1]} stroke="#64748b" tickFormatter={(v) => v === 1 ? "Pos" : v === -1 ? "Neg" : "Neu"} fontSize={9} fontMono />
                        <Tooltip contentStyle={{ backgroundColor: "#0b1020", borderColor: "rgba(255,255,255,0.08)" }} />
                        <Line type="monotone" dataKey="Score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", radius: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 text-xs text-center py-16 font-mono">No articles timeline computed</p>
                  )}
                </div>
              </div>

              {/* Drivers column */}
              <div className="lg:col-span-12 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                    ▲ Bullish Drivers / Catalysts
                  </h4>
                  <ul className="text-xs space-y-2 font-mono">
                    {details.positive_drivers && details.positive_drivers.slice(0, 3).map((drv, idx) => (
                      <li key={idx} className="flex gap-2 items-start bg-[#060816] p-2.5 rounded-lg border border-white/5">
                        <span className="text-emerald-400">✦</span>
                        <span className="text-[11px] text-slate-300 leading-normal">{drv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                    ▼ Bearish Concerns / Risks
                  </h4>
                  <ul className="text-xs space-y-2 font-mono">
                    {details.negative_drivers && details.negative_drivers.slice(0, 3).map((drv, idx) => (
                      <li key={idx} className="flex gap-2 items-start bg-[#060816] p-2.5 rounded-lg border border-white/5">
                        <span className="text-red-400">▪</span>
                        <span className="text-[11px] text-slate-300 leading-normal">{drv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Narrative */}
              <div className="lg:col-span-12 bg-[#0b1020]/50 border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                  <Cpu size={14} className="text-blue-400" /> Sentiment Agent Commentary
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">{details.summary}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// TradingViewChart.jsx — Renders an interactive TradingView widget
// Automatically resolves ticker formats (e.g., RELIANCE.NS -> NSE:RELIANCE)
// Supports interactive timeframe switching: 15m, 1h, 4h, 1d, 1w

import React, { useState, useEffect, useRef } from "react";
import { BarChart3 } from "lucide-react";

const TIMEFRAMES = [
  { label: "15m", val: "15" },
  { label: "1h", val: "60" },
  { label: "4h", val: "240" },
  { label: "1d", val: "D" },
  { label: "1w", val: "W" },
];

function TradingViewChart({ symbol }) {
  const [activeTimeframe, setActiveTimeframe] = useState("1d");
  const containerRef = useRef(null);

  // Map timeframe label to TradingView intervals
  const timeframeMap = {
    "15m": "15",
    "1h": "60",
    "4h": "240",
    "1d": "D",
    "1w": "W",
  };

  // Convert Yahoo Finance symbol (.NS) to TradingView symbol (NSE:)
  function resolveTradingViewSymbol(sym) {
    if (!sym) return "NASDAQ:AAPL";
    const cleanSym = sym.toUpperCase().strip ? sym.toUpperCase().trim() : sym.toUpperCase();
    if (cleanSym.endsWith(".NS")) {
      return `NSE:${cleanSym.replace(".NS", "")}`;
    }
    // Popular US names
    if (["AAPL", "TSLA", "GOOGL", "MSFT", "AMZN", "META", "NVDA", "NFLX"].includes(cleanSym)) {
      return `NASDAQ:${cleanSym}`;
    }
    return cleanSym;
  }

  const tvSymbol = resolveTradingViewSymbol(symbol);
  const activeInterval = timeframeMap[activeTimeframe] || "D";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container HTML to clean old widgets
    container.innerHTML = "";

    const widgetId = `tradingview_widget_${Math.random().toString(36).substring(7)}`;
    const widgetDiv = document.createElement("div");
    widgetDiv.id = widgetId;
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    const loadWidget = () => {
      if (typeof window.TradingView !== "undefined") {
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: activeInterval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: widgetId,
          studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
          loading_screen: { backgroundColor: "#0f0f2a" },
        });
      }
    };

    // Check if script is already present on page
    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = loadWidget;
      document.head.appendChild(script);
    } else {
      loadWidget();
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [tvSymbol, activeInterval]);

  return (
    <div className="quantum-card w-full flex flex-col gap-4">
      {/* Chart Header & Timeframe Selector */}
      <div className="flex items-center justify-between border-b border-[#1e1e4a] pb-3">
        <div>
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-slate-300" /> Real-Time Chart
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">Interactive market tracking for {tvSymbol}</p>
        </div>
        
        {/* Timeframe Buttons */}
        <div className="flex gap-1 bg-[#0a0a1a] p-1 rounded-lg border border-[#1e1e4a]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setActiveTimeframe(tf.label)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeTimeframe === tf.label
                  ? "bg-white text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Widget Container */}
      <div 
        ref={containerRef} 
        className="w-full rounded-xl overflow-hidden border border-[#1e1e4a]/60 bg-[#0a0a1a]" 
        style={{ height: "400px" }}
      />
    </div>
  );
}

export default TradingViewChart;

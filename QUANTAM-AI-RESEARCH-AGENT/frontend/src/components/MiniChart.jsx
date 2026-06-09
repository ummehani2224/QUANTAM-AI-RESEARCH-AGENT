// MiniChart.jsx — A simple SVG line chart
// Displays the weekly stock price trend without any external chart library.
// Pure SVG — easy to understand and zero dependencies!

import React from "react";

function MiniChart({ prices = [], labels = [] }) {
  // Chart dimensions
  const width = 400;
  const height = 80;
  const padding = 10;

  // If no data, show placeholder
  if (!prices || prices.length === 0) {
    return (
      <div className="h-20 flex items-center justify-center text-slate-600 text-sm">
        No chart data available
      </div>
    );
  }

  // Find the min and max values to scale the chart
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1; // Avoid division by zero

  // Convert price data into SVG x,y coordinates
  const points = prices.map((price, index) => {
    const x = padding + (index / (prices.length - 1)) * (width - 2 * padding);
    // Invert Y because SVG's Y-axis goes downward
    const y = height - padding - ((price - minPrice) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  // The polyline "d" attribute string
  const polylinePoints = points.join(" ");

  // Determine color: green if last price > first price, else red
  const isUp = prices[prices.length - 1] >= prices[0];
  const lineColor = isUp ? "#10b981" : "#ef4444"; // emerald or red
  const glowColor = isUp ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        {/* Gradient fill below the line */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Filled area under the chart line */}
        <polygon
          points={`${polylinePoints} ${points[points.length - 1].split(",")[0]},${height} ${padding},${height}`}
          fill="url(#chartGradient)"
        />

        {/* The main chart line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dot at the last (current) price point */}
        {points.length > 0 && (() => {
          const lastPoint = points[points.length - 1].split(",");
          return (
            <circle
              cx={lastPoint[0]}
              cy={lastPoint[1]}
              r="4"
              fill={lineColor}
              stroke="#0f0f2a"
              strokeWidth="2"
            />
          );
        })()}
      </svg>

      {/* Price range labels below chart */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">${minPrice.toFixed(2)}</span>
        <span className={`text-xs font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? "▲" : "▼"} ${Math.abs(prices[prices.length - 1] - prices[0]).toFixed(2)}
        </span>
        <span className="text-xs text-slate-600">${maxPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default MiniChart;

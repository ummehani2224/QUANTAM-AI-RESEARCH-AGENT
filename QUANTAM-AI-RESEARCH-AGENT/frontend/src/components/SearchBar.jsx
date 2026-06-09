// SearchBar.jsx — Stock symbol search input
// The user types a ticker (AAPL, TSLA, etc.) and clicks Analyze.

import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

// Common stock symbols shown as quick-select chips
const QUICK_SYMBOLS = ["AAPL", "TSLA", "INFY", "TCS", "GOOGL", "MSFT"];

function SearchBar({ onSearch, isLoading }) {
  // Local state for the text input value
  const [inputValue, setInputValue] = useState("");

  // Called when the form is submitted (button click or Enter key)
  function handleSubmit(e) {
    e.preventDefault(); // Prevent page refresh
    const symbol = inputValue.trim().toUpperCase();
    if (symbol) {
      onSearch(symbol); // Pass symbol up to parent (App.jsx)
    }
  }

  // Called when user clicks a quick-select chip
  function handleQuickSelect(symbol) {
    setInputValue(symbol);
    onSearch(symbol); // Immediately trigger search
  }

  return (
    <div className="quantum-card mb-8">
      {/* ── Search Input Row ──────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Search size={16} className="text-slate-500" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol... (AAPL, TSLA, INFY)"
            className="search-input w-full pl-12"
            disabled={isLoading}
            maxLength={10}
          />
        </div>

        <button
          type="submit"
          className="btn-primary px-8"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            // Show spinning indicator while loading
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block spin-slow" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              Analyze <ArrowRight size={14} />
            </span>
          )}
        </button>
      </form>

      {/* ── Quick Select Chips ────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-slate-500 text-sm">Quick:</span>
        {QUICK_SYMBOLS.map((sym) => (
          <button
            key={sym}
            onClick={() => handleQuickSelect(sym)}
            disabled={isLoading}
            className="px-3 py-1 text-xs font-mono font-semibold rounded-lg
                       bg-[#0b1020] text-slate-300 border border-white/5
                       hover:border-blue-500/50 hover:text-blue-400
                       transition-all duration-200 disabled:opacity-50"
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;

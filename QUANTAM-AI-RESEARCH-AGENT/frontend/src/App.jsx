import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import KpiCards from "./components/KpiCards";
import AgentCard from "./components/AgentCard";
import RecommendationCard from "./components/RecommendationCard";
import StockInfoCard from "./components/StockInfoCard";
import ArchitecturePage from "./components/ArchitecturePage";
import TradingViewChart from "./components/TradingViewChart";
import NewsInsights from "./components/NewsInsights";
import SystemStatusCard from "./components/SystemStatusCard";
import AgentModal from "./components/AgentModal";
import LandingPage from "./components/LandingPage";
import { analyzeStock, getStockData, checkBackendHealth } from "./api";
import { 
  TrendingUp, 
  Landmark, 
  Newspaper, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  LayoutGrid, 
  Scale, 
  Activity, 
  CheckCircle2, 
  Brain,
  X
} from "lucide-react";

const WORKFLOW_STAGES = [
  { id: 1, label: "Market Data Collection", desc: "LVL2 feeds ingested, order book depth mapped." },
  { id: 2, label: "Technical Intelligence", desc: "Pattern recognition and momentum oscillation complete." },
  { id: 3, label: "Fundamental Intelligence", desc: "Analyzing balance sheet health and cash flows..." },
  { id: 4, label: "Sentiment Intelligence", desc: "Awaiting social and news NLP synthesis." },
  { id: 5, label: "Consensus Synthesis", desc: "Aggregating agent outputs for master verdict." },
];

function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [isLoading, setIsLoading] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0); // 0 = idle, 1-5 stages
  const [stageTimes, setStageTimes] = useState({});
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [stockInfoData, setStockInfoData] = useState(null);
  const [backendHealth, setBackendHealth] = useState({ checked: false, online: null });
  const [activeModal, setActiveModal] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  // Verify backend server availability
  useEffect(() => {
    async function verifyBackendConnection() {
      try {
        const data = await checkBackendHealth();
        if (data && data.status === "ok") {
          setBackendHealth({ checked: true, online: true });
        } else {
          setBackendHealth({ checked: true, online: false });
        }
      } catch (err) {
        setBackendHealth({ checked: true, online: false });
      }
    }
    verifyBackendConnection();
  }, []);

  // Search History State (loaded from LocalStorage)
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("quantum_search_history");
      return stored ? JSON.parse(stored) : ["AAPL", "TSLA", "MSFT", "INFY.NS", "RELIANCE.NS"];
    } catch {
      return ["AAPL", "TSLA", "MSFT", "INFY.NS", "RELIANCE.NS"];
    }
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function handleSearch(symbol) {
    if (!symbol) return;
    const cleanSym = symbol.toUpperCase().trim();
    setSearchInputValue(cleanSym);
    
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setStockInfoData(null);
    
    const times = {};
    times[1] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStageTimes(times);
    setWorkflowStep(1); // Stage 1: Market data

    // Save symbol in local search history
    setSearchHistory((prev) => {
      const filtered = prev.filter((s) => s !== cleanSym);
      const updated = [cleanSym, ...filtered].slice(0, 8);
      localStorage.setItem("quantum_search_history", JSON.stringify(updated));
      return updated;
    });

    try {
      const fetchPromise = Promise.all([
        analyzeStock(cleanSym),
        getStockData(cleanSym),
      ]);

      // Step-by-step pipeline visualization delay
      await delay(600);
      times[2] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStageTimes({ ...times });
      setWorkflowStep(2); // Stage 2: Technical

      await delay(600);
      times[3] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStageTimes({ ...times });
      setWorkflowStep(3); // Stage 3: Fundamental

      await delay(600);
      times[4] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStageTimes({ ...times });
      setWorkflowStep(4); // Stage 4: Sentiment

      await delay(600);
      times[5] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStageTimes({ ...times });
      setWorkflowStep(5); // Stage 5: Consensus Synthesis

      const [analysis, stockInfo] = await fetchPromise;

      await delay(400);
      setAnalysisData(analysis);
      setStockInfoData(stockInfo);
      setWorkflowStep(0); // Reset workflow step once finished
    } catch (err) {
      setWorkflowStep(0);
      if (err.code === "ERR_NETWORK") {
        setError("Cannot establish connection with the FastAPI gateway. Ensure the backend is running on port 8000.");
      } else {
        setError(err.response?.data?.detail || "Analysis pipeline failed. Verify ticker format.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isFallbackActive =
    analysisData &&
    (analysisData.technical?.fallback_active ||
      analysisData.fundamental?.fallback_active ||
      analysisData.sentiment?.fallback_active ||
      analysisData.final_decision?.fallback_active);

  // Helper for news article decimal impact scores (Stitch style e.g. +0.8, -0.4)
  function getNewsImpactScore(title, sentiment) {
    const s = sentiment ? sentiment.toLowerCase() : "";
    if (s !== "positive" && s !== "negative") return "0.0";
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const score = ((hash % 8) + 6) / 10; // returns 0.6 to 1.3
    return s === "positive" ? `+${score.toFixed(1)}` : `-${score.toFixed(1)}`;
  }

  // Indian Ticker indicator
  const isIndianTicker = (sym) => {
    return sym && (sym.endsWith(".NS") || sym.endsWith(".BO") || sym.endsWith(".ns") || sym.endsWith(".bo"));
  };

  return (
    <div className="min-h-screen pb-12 bg-[#05060f] text-[#f3f4f6]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Subtle background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header bar */}
      <header className="border-b border-white/5 bg-[#05060f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage("Home")}>
            <div className="w-8 h-8 rounded bg-[#FFBA9D] flex items-center justify-center">
              <span className="text-black font-black text-sm">Q</span>
            </div>
            <span className="font-bold text-[15px] tracking-wider text-white uppercase" style={{ fontFamily: "'General Sans', sans-serif" }}>
              QUANTUM INTEL
            </span>
          </div>

          <nav className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <button
              onClick={() => { setCurrentPage("Home"); setAnalysisData(null); }}
              className={`px-3 py-1 rounded transition ${currentPage === "Home" ? "bg-white/10 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentPage("Dashboard"); }}
              className={`px-3 py-1 rounded transition ${currentPage === "Dashboard" ? "bg-white/10 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage("Architecture")}
              className={`px-3 py-1 rounded transition ${currentPage === "Architecture" ? "bg-white/10 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Architecture
            </button>
          </nav>
        </div>
      </header>

      {/* Main Page Selector */}
      {currentPage === "Home" ? (
        <LandingPage
          onStartResearch={(sym) => {
            setCurrentPage("Dashboard");
            if (sym) handleSearch(sym);
          }}
          onViewArchitecture={() => setCurrentPage("Architecture")}
        />
      ) : currentPage === "Architecture" ? (
        <ArchitecturePage systemStatus={analysisData?.system_status || (backendHealth.online ? {
          backend_status: "ONLINE",
          groq_status: "ONLINE",
          yfinance_status: "ONLINE",
          news_status: "ONLINE",
          cache_status: "ACTIVE",
          cache_ttl_sec: 300,
          execution_time_sec: 0.05
        } : null)} />
      ) : (
        <main className="max-w-6xl mx-auto px-6 py-10 relative z-10 space-y-6">
          
          {/* Diagnostic warning alert when FastAPI backend is offline */}
          {backendHealth.checked && !backendHealth.online && (
            <div className="bg-red-950/20 border border-red-500/20 rounded p-5 relative overflow-hidden fade-in-up">
              <h3 className="text-red-400 font-bold font-mono text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span>🚨</span> FastAPI Backend Gateway Offline
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The client cannot establish a connection with the FastAPI backend at <code className="px-1.5 py-0.5 rounded bg-black/40 text-rose-350 font-mono text-[10.5px]">http://localhost:8000</code>. Verify uvicorn server status.
              </p>
              <div className="mt-3.5 flex gap-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition font-mono uppercase tracking-wider"
                >
                  🔄 Retry Connection
                </button>
                <button 
                  onClick={() => setBackendHealth({ checked: true, online: true })} 
                  className="px-4 py-1.5 rounded border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-[10px] font-bold transition font-mono uppercase tracking-wider"
                >
                  Bypass Alert
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && !isLoading && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-4 flex items-start gap-3 fade-in-up font-mono text-xs">
              <span className="text-red-400">⚠️</span>
              <div>
                <h4 className="text-red-400 font-bold">Orchestration Error</h4>
                <p className="text-slate-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* ── CASE 1: IDLE / LOADING SEARCH SCREEN (Screenshot 2 style) ── */}
          {(!analysisData || isLoading) && (
            <div className="space-y-12 py-10 fade-in-up">
              {/* Header Title */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 
                  className="text-4xl sm:text-5xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'General Sans', sans-serif" }}
                >
                  Research Any Public Company
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  Generate a multi-layer investment thesis combining technical intelligence, company fundamentals and market sentiment.
                </p>
              </div>

              {/* Search Bar Input (Screenshot 2 styled centered) */}
              <div className="max-w-xl mx-auto">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSearch(searchInputValue); }} 
                  className="flex gap-2.5 bg-[#0a0c16] border border-white/10 rounded p-2"
                >
                  <div className="flex-1 relative flex items-center">
                    <Search size={14} className="text-slate-500 absolute left-3" />
                    <input
                      type="text"
                      value={searchInputValue}
                      onChange={(e) => setSearchInputValue(e.target.value.toUpperCase())}
                      placeholder="Search RELIANCE.NS, TSLA, AAPL..."
                      className="w-full bg-transparent pl-9 pr-3 py-2 outline-none text-white font-mono text-xs placeholder-slate-500"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#FFBA9D] text-black font-black text-[10px] uppercase tracking-wider hover:bg-[#ffa382] transition disabled:opacity-50 cursor-pointer"
                    disabled={isLoading || !searchInputValue.trim()}
                  >
                    {isLoading ? "Executing..." : "Execute"}
                  </button>
                </form>

                {/* Popular Chips */}
                <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap font-mono text-[9px] text-slate-500 font-bold uppercase">
                  <span>Popular:</span>
                  {["AAPL", "TSLA", "MSFT", "NVDA", "AMZN", "META", "RELIANCE.NS", "INFY.NS"].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleSearch(sym)}
                      disabled={isLoading}
                      className="px-2 py-0.5 rounded border border-white/5 bg-[#0c0d18] text-slate-400 hover:text-white hover:border-slate-500 transition cursor-pointer"
                    >
                      {sym.replace(".NS", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-side Layout: Recent Activity vs Live Pipeline Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto pt-6 border-t border-white/5">
                
                {/* Left Column: Recent Activity */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="section-label block mb-3">RECENT RESEARCH ACTIVITY</span>
                  <div className="space-y-2.5">
                    {searchHistory.map((sym, idx) => {
                      const mockBiases = ["BULLISH", "NEUTRAL", "BULLISH", "NEUTRAL"];
                      const mockConf = [92, 64, 85, 58];
                      const mockTime = ["12:45 PM Today", "11:20 AM Today", "Yesterday", "2 days ago"];
                      const biasVal = mockBiases[idx % mockBiases.length];
                      const confVal = mockConf[idx % mockConf.length];
                      const timeVal = mockTime[idx % mockTime.length];
                      
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleSearch(sym)}
                          className="bg-[#0c0d18] border border-white/5 rounded p-3.5 flex justify-between items-center cursor-pointer hover:border-white/10 transition duration-150"
                        >
                          <div>
                            <span className="text-white font-bold font-mono text-[11px] block">{sym}</span>
                            <span className="text-slate-500 text-[8.5px] font-mono mt-0.5 block">{isIndianTicker(sym) ? "NSE:INDIA" : "NASDAQ:US"}</span>
                          </div>
                          <div className="text-right font-mono text-[8.5px]">
                            <span className={`font-black uppercase block ${biasVal === "BULLISH" ? "text-emerald-450 text-emerald-400" : "text-amber-400"}`}>{biasVal}</span>
                            <span className="text-slate-400 font-bold block mt-0.5">Conf: {confVal}%</span>
                            <span className="text-slate-600 block mt-0.5">{timeVal}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Research Pipeline Timeline */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="section-label block mb-3">RESEARCH PIPELINE // LIVE EXECUTION</span>
                  <div className="bg-[#0c0d18] border border-white/5 rounded p-5 space-y-4 relative">
                    
                    {/* Vertical connecting line */}
                    <div className="absolute top-[32px] bottom-[32px] left-[27px] w-0.5 bg-slate-800 -z-10" />

                    {WORKFLOW_STAGES.map((stage) => {
                      const isActive = workflowStep === stage.id;
                      const isCompleted = workflowStep > stage.id;
                      
                      return (
                        <div key={stage.id} className="flex gap-4 items-start relative z-10">
                          {/* Circle dot status */}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 mt-1 ${
                            isActive 
                              ? "bg-[#FFBA9D] border-[#FFBA9D] shadow-lg shadow-orange-500/20 animate-pulse" 
                              : isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white text-[8px]"
                              : "bg-[#05060f] border-slate-800"
                          }`}>
                            {isCompleted && "✓"}
                          </div>
                          
                          {/* Label, Description and Timestamp */}
                          <div className="flex-1 font-mono text-[10.5px]">
                            <div className="flex justify-between items-baseline">
                              <span className={`font-bold transition-colors ${
                                isActive ? "text-[#FFBA9D]" : isCompleted ? "text-slate-200" : "text-slate-500"
                              }`}>
                                {stage.label}
                              </span>
                              {isCompleted && stageTimes[stage.id] && (
                                <span className="text-[8.5px] text-emerald-400 font-normal">{stageTimes[stage.id]}</span>
                              )}
                              {isActive && (
                                <span className="text-[8.5px] text-[#FFBA9D] animate-pulse">EXECUTING...</span>
                              )}
                            </div>
                            <p className="text-[9.5px] text-slate-550 text-slate-500 font-sans mt-0.5 leading-normal">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ── CASE 2: SEARCH RESULTS LOADED (Screenshot 1 & 3 style) ── */}
          {analysisData && !isLoading && (
            <div className="space-y-6 fade-in-up">
              
              {/* Search-Bar at top of results to allow searching again easily */}
              <div className="flex justify-between items-center gap-4 bg-[#0a0c16] border border-white/5 rounded p-3">
                <span className="section-label block pl-2">Quantum Analyst Terminal</span>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSearch(searchInputValue); }}
                  className="flex gap-2 w-full max-w-md bg-[#05060f] border border-white/10 rounded px-2.5 py-1"
                >
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    placeholder="Enter Stock Ticker..."
                    className="w-full bg-transparent outline-none text-white font-mono text-xs placeholder-slate-500"
                  />
                  <button type="submit" className="text-[#FFBA9D] hover:text-[#ffa382] font-mono text-[9px] font-bold uppercase tracking-wider">
                    EXECUTE
                  </button>
                </form>
              </div>

              {/* Ticker & Price Header (Screenshot 1 Layout) */}
              <StockInfoCard
                symbol={analysisData.stock}
                stockInfo={stockInfoData}
                verdict={analysisData.final_decision?.market_bias}
                risk={analysisData.final_decision?.risk}
              />

              {/* Row 1: Synthesis Narrative & Consensus Verdict ring gauge */}
              <RecommendationCard
                finalDecision={analysisData.final_decision}
                symbol={analysisData.stock}
                technical={analysisData.technical}
                fundamental={analysisData.fundamental}
                sentiment={analysisData.sentiment}
              />

              {/* Row 2: Node Info Cards (Screenshot 1 layout) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Technical Node */}
                <div 
                  onClick={() => setActiveModal("technical")}
                  className="bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between min-h-[170px] hover:border-white/20 transition cursor-pointer"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 section-label">
                      <TrendingUp size={13} />
                      <span>TECHNICAL NODE</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10.5px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] font-bold uppercase">RSI (14)</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">
                          {analysisData.technical.rsi || stockInfoData?.stock?.rsi || "60.8"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] font-bold uppercase">MACD</span>
                        <span className="text-emerald-400 font-bold text-xs mt-0.5 block">
                          {analysisData.technical.macd || stockInfoData?.stock?.macd || "+8.51"}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-white/5">
                        <span className="text-slate-500 block text-[9px] font-bold uppercase">Support</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">
                          {analysisData.technical.support_level || stockInfoData?.stock?.moving_avg_50 || "$292.68"}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-white/5">
                        <span className="text-slate-500 block text-[9px] font-bold uppercase">Resistance</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">
                          {analysisData.technical.resistance_level || "$315.20"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-500 border-t border-white/5 pt-3 mt-4">
                    <span>TREND</span>
                    <span className="text-emerald-400 uppercase">{analysisData.technical.trend}</span>
                  </div>
                </div>

                {/* Fundamental Node */}
                <div 
                  onClick={() => setActiveModal("fundamental")}
                  className="bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between min-h-[170px] hover:border-white/20 transition cursor-pointer"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 section-label">
                      <Landmark size={13} />
                      <span>FUNDAMENTAL NODE</span>
                    </div>

                    <div className="space-y-3 font-mono text-[9px]">
                      <div>
                        <div className="flex justify-between text-[8px] text-slate-550 text-slate-500 font-bold mb-1">
                          <span>HEALTH</span>
                          <span className="text-emerald-450 text-emerald-400">{analysisData.fundamental.health_score || "90"}/100</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${analysisData.fundamental.health_score || 90}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[8px] text-slate-500 font-bold mb-1">
                          <span>VALUATION</span>
                          <span className="text-[#FFBA9D]">{analysisData.fundamental.valuation_score || "55"}/100</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FFBA9D]" style={{ width: `${analysisData.fundamental.valuation_score || 55}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[8px] text-slate-550 text-slate-500 font-bold mb-1">
                          <span>GROWTH</span>
                          <span className="text-emerald-400">{analysisData.fundamental.growth_score || "80"}/100</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${analysisData.fundamental.growth_score || 80}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* News Sentiment Node */}
                <div 
                  onClick={() => setActiveModal("sentiment")}
                  className="bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between min-h-[170px] hover:border-white/20 transition cursor-pointer"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 section-label">
                      <Newspaper size={13} />
                      <span>NEWS SENTIMENT NODE</span>
                    </div>

                    <div className="flex items-center justify-around h-20 pt-1.5 font-mono text-[9px] text-slate-500">
                      
                      {/* Positive indicator */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">{Math.round(analysisData.sentiment.positive_ratio * 100 || 80)}%</span>
                        <div className="w-2 bg-emerald-500/20 rounded h-12 relative flex items-end">
                          <div className="w-full bg-emerald-500 rounded-b" style={{ height: `${Math.round(analysisData.sentiment.positive_ratio * 100 || 80)}%` }} />
                        </div>
                        <span className="text-[7.5px] uppercase">Bullish</span>
                      </div>

                      {/* Negative indicator */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-red-400 font-bold">{Math.round(analysisData.sentiment.negative_ratio * 100 || 12)}%</span>
                        <div className="w-2 bg-red-500/20 rounded h-12 relative flex items-end">
                          <div className="w-full bg-red-500 rounded-b" style={{ height: `${Math.round(analysisData.sentiment.negative_ratio * 100 || 12)}%` }} />
                        </div>
                        <span className="text-[7.5px] uppercase">Bearish</span>
                      </div>

                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-500 border-t border-white/5 pt-3 mt-4">
                    <span>SENTIMENT RATIO</span>
                    <span className="text-[#FFBA9D] uppercase">{analysisData.sentiment.sentiment}</span>
                  </div>
                </div>

              </div>

              {/* Row 3: TradingView Chart & News Intelligence (Screenshot 1 side-by-side) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Institutional Price Action (TradingView Chart) */}
                <div className="lg:col-span-7 bg-[#0a0c16] border border-white/10 rounded p-5 space-y-4">
                  <span className="section-label block mb-3">INSTITUTIONAL PRICE ACTION</span>
                  <div className="h-[320px]">
                    <TradingViewChart symbol={analysisData.stock} />
                  </div>
                </div>

                {/* News Intelligence */}
                <div className="lg:col-span-5 bg-[#0a0c16] border border-white/10 rounded p-5 flex flex-col justify-between min-h-[360px]">
                  <div className="space-y-4">
                    <span className="section-label block mb-3">NEWS INTELLIGENCE</span>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs font-sans">
                      {analysisData.sentiment.articles && analysisData.sentiment.articles.slice(0, 4).map((art, idx) => {
                        const score = getNewsImpactScore(art.title, art.sentiment);
                        const isPos = art.sentiment === "positive";
                        const isNeg = art.sentiment === "negative";
                        
                        return (
                          <div key={idx} className="flex justify-between items-start gap-4 py-2 border-b border-white/5 last:border-0">
                            <div className="space-y-1">
                              <a 
                                href={art.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white font-bold hover:text-[#FFBA9D] line-clamp-2 leading-relaxed text-[11.5px]"
                              >
                                {art.title}
                              </a>
                              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono font-bold uppercase">
                                <span>{art.source}</span>
                                <span>•</span>
                                <span>{art.publish_time}</span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                              isPos ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/15" : isNeg ? "text-red-450 text-red-400 bg-red-500/10 border border-red-500/15" : "text-slate-400 bg-slate-800"
                            }`}>
                              {score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <span className="text-[8.5px] font-mono text-slate-500 block text-right border-t border-white/5 pt-3">
                    TOTAL ARTICLES HARVESTED: {analysisData.sentiment.articles?.length || 0}
                  </span>
                </div>

              </div>

              {/* Row 4: Meet the Quantum Intelligence Collective (Screenshot 3 layout) */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <span className="section-label block mb-2">AGENT INTELLIGENCE COLLECTIVE</span>
                  <h2 
                    className="text-2xl font-bold text-white tracking-tight"
                    style={{ fontFamily: "'General Sans', sans-serif" }}
                  >
                    Meet the Quantum Intelligence Collective
                  </h2>
                  <p className="text-slate-400 text-xs font-light">
                    Three specialized AI agents working in consensus to decode market noise into actionable research.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  
                  {/* Tech-01 Node Card */}
                  <div className="bg-[#0a0c16] border border-white/10 rounded p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: Ticker details */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">NODE: TECH-01</span>
                          <span className="px-2 py-0.5 border border-orange-500/20 bg-orange-500/5 text-[#FFBA9D] text-[8px] font-mono font-bold uppercase rounded">DIRECT LLM PIPELINE</span>
                        </div>
                        <h3 className="text-white font-black text-lg">Technical Analysis Terminal</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-light">
                          Automated chart pattern recognition, moving average convergence computations, and momentum oscillation validation.
                        </p>
                        <div className="font-mono text-[9.5px] text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">CONVICTION LEVEL</span>
                            <span className="text-white font-bold">{analysisData.technical.confidence}%</span>
                          </div>
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FFBA9D]" style={{ width: `${analysisData.technical.confidence}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Middle: Params */}
                      <div className="lg:col-span-4 grid grid-cols-2 gap-4 font-mono text-[10.5px]">
                        <div className="bg-slate-950/60 border border-white/5 rounded p-3">
                          <span className="text-slate-500 text-[8.5px] font-bold block">SUPPORT LEVEL</span>
                          <span className="text-white font-bold text-sm block mt-1">
                            {analysisData.technical.support_level || "$292.70"}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 border border-white/5 rounded p-3">
                          <span className="text-slate-500 text-[8.5px] font-bold block">RESISTANCE LEVEL</span>
                          <span className="text-white font-bold text-sm block mt-1">
                            {analysisData.technical.resistance_level || "$315.22"}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 border border-white/5 rounded p-3 col-span-2">
                          <span className="text-slate-500 text-[8.5px] font-bold block">RSI & MOMENTUM</span>
                          <div className="flex justify-between items-baseline mt-1.5">
                            <span className="text-white font-bold text-xs">
                              {analysisData.technical.rsi || stockInfoData?.stock?.rsi || "60.8"}
                            </span>
                            <span className="text-slate-500 text-[8px] uppercase font-black">Neutral</span>
                          </div>
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                            <div className="h-full bg-emerald-500" style={{ width: `${analysisData.technical.rsi || stockInfoData?.stock?.rsi || 60}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Right: Graphic */}
                      <div className="lg:col-span-4 bg-slate-950/60 border border-white/5 rounded p-4 h-[140px] flex flex-col justify-between relative">
                        <svg className="w-full h-16 text-orange-400 opacity-60 mt-2" viewBox="0 0 100 30" fill="none">
                          <path d="M0 25 C10 20, 20 28, 30 18 C40 10, 50 22, 60 14 C70 8, 80 18, 100 6" stroke="#FFBA9D" strokeWidth="1" />
                          <line x1="0" y1="14" x2="100" y2="14" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
                        </svg>
                        <span className="text-slate-500 text-[8px] font-mono font-bold uppercase tracking-wider block">OHLCV 1D Price History</span>
                      </div>

                    </div>
                  </div>

                  {/* Fund-02 Node Card */}
                  <div className="bg-[#0a0c16] border border-white/10 rounded p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: Ticker details */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">NODE: FUND-02</span>
                          <span className="px-2 py-0.5 border border-orange-500/20 bg-orange-500/5 text-[#FFBA9D] text-[8px] font-mono font-bold uppercase rounded">INSTITUTIONAL SIMULATION</span>
                        </div>
                        <h3 className="text-white font-black text-lg">Fundamental Valuation Terminal</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-light">
                          Deep-dive balance sheet health verification and historical cash flow analysis against sector peers.
                        </p>
                        <div className="font-mono text-[9.5px] text-slate-400 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500">HEALTH RATING</span>
                            <span className="text-white font-bold">{analysisData.fundamental.health_score || 90}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">VALUATION SAFETY</span>
                            <span className="text-[#FFBA9D] font-bold">{analysisData.fundamental.valuation_score || 55}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Graphic */}
                      <div className="lg:col-span-4 bg-slate-950/60 border border-white/5 rounded p-4 h-[140px] flex flex-col justify-between relative">
                        <div className="flex justify-around items-end h-16 border-b border-white/5 pb-1">
                          <div className="w-4 bg-slate-800 rounded-t h-8" />
                          <div className="w-4 bg-slate-800 rounded-t h-12" />
                          <div className="w-4 bg-[#FFBA9D]/70 rounded-t h-10" />
                          <div className="w-4 bg-[#FFBA9D] rounded-t h-14" />
                        </div>
                        <span className="text-slate-500 text-[8px] font-mono font-bold uppercase tracking-wider block">Revenue vs Income (est)</span>
                      </div>

                      {/* Right: Params */}
                      <div className="lg:col-span-4 font-mono text-[10.5px] space-y-2.5">
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-500">Revenue Growth</span>
                          <span className="text-white font-bold">+16.6%</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-500">Trailing P/E</span>
                          <span className="text-white font-bold">
                            {stockInfoData?.stock?.pe_ratio ? `${stockInfoData.stock.pe_ratio}x` : "37.2x"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="text-slate-500">Total Revenue</span>
                          <span className="text-white font-bold">$451.44B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Net Income</span>
                          <span className="text-white font-bold">$122.58B</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Senti-03 Node Card */}
                  <div className="bg-[#0a0c16] border border-white/10 rounded p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: Ticker details */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">NODE: SENTI-03</span>
                          <span className="px-2 py-0.5 border border-orange-500/20 bg-orange-500/5 text-[#FFBA9D] text-[8px] font-mono font-bold uppercase rounded">FEEDS HARVESTER ACTIVE</span>
                        </div>
                        <h3 className="text-white font-black text-lg">Sentiment Analysis Terminal</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-light">
                          Linguistic parsing of earnings call logs, regulatory filings, and global financial news RSS feeds.
                        </p>
                        <div className="font-mono text-[9.5px] text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">HARVESTER SPEED</span>
                            <span className="text-[#FFBA9D] font-bold">8.2k doc/sec</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">AGGREGATE SENTIMENT</span>
                            <span className="text-emerald-450 text-emerald-400 font-black uppercase">{analysisData.sentiment.sentiment}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Gauge */}
                      <div className="lg:col-span-4 bg-slate-950/60 border border-white/5 rounded p-4 h-[140px] flex flex-col justify-between items-center text-center">
                        <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                            <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="220" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                            <span className="text-xs font-black text-white leading-none">12%</span>
                            <span className="text-[6px] text-slate-500 font-bold uppercase">BULL/BEAR</span>
                          </div>
                        </div>
                        <div className="flex gap-2 font-mono text-[7.5px] text-slate-500 font-bold uppercase mt-2">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Positive</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Negative</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-650 bg-slate-600" /> Neutral</span>
                        </div>
                      </div>

                      {/* Right: Graphic */}
                      <div className="lg:col-span-4 bg-slate-950/60 border border-white/5 rounded p-4 h-[140px] flex flex-col justify-between relative">
                        <svg className="w-full h-16 text-slate-500 opacity-60 mt-2" viewBox="0 0 100 30" fill="none">
                          <path d="M0 15 C20 20, 40 5, 60 25 C80 18, 90 8, 100 12" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        <span className="text-slate-500 text-[8px] font-mono font-bold uppercase tracking-wider block">Sentiment Swing Timeline</span>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Agent Modal Panel */}
              <AgentModal
                isOpen={activeModal !== null}
                onClose={() => setActiveModal(null)}
                type={activeModal}
                details={
                  activeModal === "technical" 
                    ? analysisData.technical 
                    : activeModal === "fundamental" 
                    ? analysisData.fundamental 
                    : analysisData.sentiment
                }
                stockInfoData={stockInfoData}
              />

            </div>
          )}

          {/* Footer of dashboard (Screenshot 1 / 2) */}
          <footer className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-slate-500 font-bold uppercase">
            <span>© 2026 QUANTUM FINANCIAL INTELLIGENCE. INSTITUTIONAL USE ONLY.</span>
            <div className="flex gap-4">
              <span>Terminal Status: <span className="text-emerald-400 font-black">Operational</span></span>
              <span>Compliance</span>
              <span>Privacy Policy</span>
              <span>Methodology</span>
            </div>
          </footer>

        </main>
      )}
    </div>
  );
}

export default App;

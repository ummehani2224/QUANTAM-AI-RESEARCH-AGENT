// ArchitecturePage.jsx — Shows the agent workflow diagram
// This is a pure CSS/SVG architecture visualization — no external libraries needed.
// Upgraded to support Section 15: Cache checking and ingestion flows.

import React from "react";
import { User, Database, Radio, TrendingUp, Landmark, Newspaper, Brain, BarChart3, RefreshCw, Cpu, Settings } from "lucide-react";
import SystemStatusCard from "./SystemStatusCard";

// Node definitions for the workflow diagram
const NODES = [
  {
    id: "input",
    label: "User Input",
    sublabel: "Stock Ticker (AAPL, INFY)",
    icon: User,
    color: "from-slate-700 to-slate-800",
    border: "border-slate-500/40",
  },
  {
    id: "cache",
    label: "Cache Layer",
    sublabel: "In-Memory TTL Audit",
    icon: Database,
    color: "from-blue-900 to-blue-950",
    border: "border-blue-500/40",
  },
  {
    id: "data",
    label: "Market Data Ingestion",
    sublabel: "yfinance & Google News RSS",
    icon: Radio,
    color: "from-indigo-900 to-indigo-950",
    border: "border-indigo-500/40",
  },
  {
    id: "technical",
    label: "Technical Agent",
    sublabel: "S/R Levels · Volatility · RSI",
    icon: TrendingUp,
    color: "from-blue-900 to-blue-950",
    border: "border-blue-500/40",
  },
  {
    id: "fundamental",
    label: "Fundamental Agent",
    sublabel: "P/E safety · Health · Growth",
    icon: Landmark,
    color: "from-indigo-900 to-indigo-950",
    border: "border-indigo-500/40",
  },
  {
    id: "sentiment",
    label: "Sentiment Agent",
    sublabel: "Google RSS news · Lexicons",
    icon: Newspaper,
    color: "from-cyan-900 to-cyan-950",
    border: "border-cyan-500/40",
  },
  {
    id: "master",
    label: "Master Orchestrator",
    sublabel: "Weighted Consensus synthesis",
    icon: Brain,
    color: "from-sky-900 to-sky-950",
    border: "border-sky-500/40",
  },
  {
    id: "output",
    label: "Consensus Dashboard UI",
    sublabel: "Consolidated Intelligence",
    icon: BarChart3,
    color: "from-emerald-900 to-emerald-950",
    border: "border-emerald-500/40",
  },
];

// Arrow component — simple SVG down arrow
function Arrow({ label = "" }) {
  return (
    <div className="flex justify-center my-1">
      <div className="flex flex-col items-center text-blue-500/60">
        {label && <span className="text-[9px] text-slate-500 font-mono tracking-tight mb-1">{label}</span>}
        <div className="w-px h-5 bg-gradient-to-b from-blue-500/60 to-blue-500/20" />
        <span className="text-[10px]">▼</span>
      </div>
    </div>
  );
}

// Node card component
function Node({ node, delay = 0 }) {
  const Icon = node.icon;
  return (
    <div
      className={`rounded-xl border ${node.border} bg-gradient-to-br ${node.color}
                  px-5 py-3 flex items-center gap-3 node-float shadow-lg`}
      style={{
        animationDelay: `${delay}s`,
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)",
      }}
    >
      <Icon className="w-5 h-5 text-blue-400 shrink-0" />
      <div className="text-left">
        <p className="text-white font-semibold text-sm">{node.label}</p>
        <p className="text-slate-400 text-xs font-light">{node.sublabel}</p>
      </div>
    </div>
  );
}

function ArchitecturePage({ systemStatus }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">System Architecture & Orchestration</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          QUANTUM operates as a multi-agent consensus network. User queries are routed via 
          an in-memory caching system to parallel analytical nodes before synthesis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: Flow Diagram ──────────────────────────────────────────── */}
        <div className="quantum-card">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <RefreshCw size={16} className="text-blue-400" /> Orchestrated System Data Flow
          </h3>

          {/* Vertical flow diagram */}
          <div className="max-w-xs mx-auto">
            {/* Step 1: User Input */}
            <Node node={NODES[0]} delay={0} />
            <Arrow />

            {/* Step 2: Cache Layer */}
            <Node node={NODES[1]} delay={0.08} />
            
            {/* Split showing cache logic */}
            <div className="flex justify-between items-center px-4 py-1 text-[9px] font-mono text-blue-400">
              <span>[Cache Hit] ➔ Bypass to UI</span>
              <span>[Cache Miss] ➔ Ingest</span>
            </div>

            <Arrow label="Fetch Fresh Data" />

            {/* Step 3: Market Data Ingestion */}
            <Node node={NODES[2]} delay={0.16} />
            <Arrow />

            {/* Step 4: Three agents in a row — shown as a split */}
            <div className="text-center mb-1">
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono">Parallel Agent Evaluation</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-1">
              {NODES.slice(3, 6).map((node, i) => {
                const NodeIcon = node.icon;
                return (
                  <div
                    key={node.id}
                    className={`rounded-xl border ${node.border} bg-gradient-to-br ${node.color}
                                 px-2 py-2.5 text-center flex flex-col items-center justify-center node-float shadow-md`}
                    style={{ animationDelay: `${0.24 + i * 0.08}s` }}
                  >
                    <NodeIcon className="w-5 h-5 text-blue-400 mb-1" />
                    <p className="text-white text-xs font-semibold leading-tight mt-1">{node.label.split(" ")[0]}</p>
                    <p className="text-slate-500 text-[9px] mt-0.5 font-light leading-tight">{node.sublabel.split(" ")[0]}</p>
                  </div>
                );
              })}
            </div>
            <Arrow label="Weighted Consensus Synthesis" />

            {/* Step 5: Master Agent */}
            <Node node={NODES[6]} delay={0.5} />
            <Arrow />

            {/* Step 6: Final Decision / Dashboard UI */}
            <Node node={NODES[7]} delay={0.58} />
          </div>
        </div>

        {/* ── Right: Agent Descriptions ───────────────────────────────────── */}
        <div className="space-y-4">
          <div className="quantum-card">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-blue-400" /> Orchestrated Node Details
            </h3>

            {/* Agent description list */}
            {[
              {
                icon: Database,
                name: "Cache Layer",
                desc: "Intercepts incoming tickers. If evaluated within the last 5 minutes (300s TTL), instantly serves results to the UI to avoid duplicate network calls.",
                tech: ["In-Memory Cache", "TTL Check", "Low Latency Bypass"],
              },
              {
                icon: TrendingUp,
                name: "Technical Agent",
                desc: "Calculates local extrema price support/resistance levels, measures daily returns volatility, computes 20-period SMA trends cross-checked from 15m to 1w.",
                tech: ["20d local min/max support/resistance", "Timeframe trends (15m to 1w)", "Standard deviation Volatility"],
              },
              {
                icon: Landmark,
                name: "Fundamental Agent",
                desc: "Audits corporate metrics such as P/E valuations against bands, YoY revenue/earnings growth averages, and net margin solvency profiles.",
                tech: ["Valuation multiplier risk", "Health & Growth indexes", "Solvency net margin check"],
              },
              {
                icon: Newspaper,
                name: "Sentiment Agent",
                desc: "Crawls recent articles from Google News search RSS feeds, applies heuristic keyword parsing models for events, and tagging positive/negative headline sentiment ratios.",
                tech: ["Google RSS Ingestion", "Lexicon keyword matching", "Consensus ratio flow"],
              },
              {
                icon: Brain,
                name: "Master Agent",
                desc: "Executes a 40-35-25 weighted consensus conviction formula, calculates mathematical system risk ratings, and generates executive narratives with potential risks and catalysts.",
                tech: ["40-35-25 Weighted average math", "Consensus risk calculation", "Downside risks & catalysts summary"],
              },
            ].map((agent) => {
              const AgentIcon = agent.icon;
              return (
                <div key={agent.name} className="border-b border-white/5 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                  <div className="flex items-start gap-3">
                    <AgentIcon className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">{agent.name}</p>
                      <p className="text-slate-400 text-xs leading-relaxed mb-2 font-light">{agent.desc}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.tech.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20
                                                     text-blue-400 text-[10px] rounded-md font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Tech Stack Card ─────────────────────────────────────────────── */}
          <div className="quantum-card">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Settings size={16} className="text-blue-400" /> Platform Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Frontend Engine", value: "React.js + Vite", color: "text-cyan-400" },
                { label: "Styling System", value: "Tailwind CSS Layouts", color: "text-blue-400" },
                { label: "Backend API Framework", value: "FastAPI (Python)", color: "text-emerald-400" },
                { label: "Server runtime", value: "Uvicorn (Reload Mode)", color: "text-amber-400" },
                { label: "HTTP Connection Engine", value: "Httpx / Axios Client", color: "text-sky-400" },
                { label: "AI Gateway Engine", value: "Groq Cloud Completion", color: "text-teal-400" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0b1020] rounded-lg p-3 border border-white/5">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono">{item.label}</p>
                  <p className={`font-semibold text-sm ${item.color} mt-0.5`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {systemStatus && (
            <div className="fade-in-up">
              <SystemStatusCard systemStatus={systemStatus} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArchitecturePage;

// components/AgentPipelineFlow.jsx — Premium Flow Diagram of Multi-Agent Consensus
import React from "react";
import { Cpu, ArrowRight, Database, TrendingUp, Landmark, MessageSquare, Award, Play } from "lucide-react";
import { motion } from "framer-motion";

const PIPELINE_STEPS = [
  { label: "User Input", sub: "Stock Ticker", icon: Play, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { label: "Market Data", sub: "YFinance Feed", icon: Database, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  { label: "Technical Agent", sub: "EMA & Oscillators", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { label: "Fundamental Agent", sub: "Earnings & Ratios", icon: Landmark, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  { label: "Sentiment Agent", sub: "News NLP Stream", icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { label: "Master Agent", sub: "Consensus Synthesis", icon: Cpu, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  { label: "Final Consensus", sub: "BUY / HOLD / SELL", icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
];

function AgentPipelineFlow() {
  return (
    <div className="card" style={{ padding: "20px" }}>
      <div className="flex items-center gap-2 border-b border-zinc-850 pb-3 mb-4">
        <Cpu size={14} className="text-blue-500" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-manrope">
          Multi-Agent Orchestration Flow
        </h4>
      </div>

      {/* Steps Flow Grid */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2 relative">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === PIPELINE_STEPS.length - 1;

          return (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center gap-3 lg:flex-col lg:text-center z-10 flex-1 w-full lg:w-auto"
              >
                {/* Step Circle Avatar */}
                <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center shadow-lg`}>
                  <Icon size={16} className={step.color} />
                </div>
                
                {/* Step Label Info */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">
                    {step.label}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-semibold font-manrope mt-0.5">
                    {step.sub}
                  </span>
                </div>
              </motion.div>

              {/* Arrow separator (hidden on mobile, visible on desktop) */}
              {!isLast && (
                <div className="hidden lg:flex items-center justify-center text-zinc-700 flex-shrink-0 mx-1">
                  <ArrowRight size={14} className="animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default AgentPipelineFlow;

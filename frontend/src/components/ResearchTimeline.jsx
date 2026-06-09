import React from "react";
import { Clock } from "lucide-react";

export default function ResearchTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="quantum-card p-5 mb-6 fade-in-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div>
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">Execution Log</span>
          <h3 className="text-white font-black text-base mt-1 flex items-center gap-1.5 font-mono">
            <Clock size={16} className="text-[#FFBA9D]" /> Research Timeline
          </h3>
        </div>
      </div>

      <div className="relative pl-5 space-y-4 font-mono text-xs">
        {/* Vertical timeline connector line */}
        <div className="absolute top-[8px] bottom-[8px] left-[7px] w-0.5 bg-slate-800" />

        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isFirst = idx === 0;

          return (
            <div key={idx} className="relative flex items-start justify-between gap-4 group">
              {/* Outer timeline indicator dot */}
              <div className={`absolute -left-[22px] w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 mt-1 bg-[#05060f] ${
                isLast
                  ? "border-[#FFBA9D] shadow-[0_0_8px_rgba(255,186,157,0.4)]"
                  : "border-slate-700"
              }`}>
                {/* Inner dot */}
                <div className={`w-1.5 h-1.5 rounded-full ${isLast ? "bg-[#FFBA9D] animate-pulse" : "bg-slate-700"}`} />
              </div>

              {/* Event Name */}
              <span className={`font-semibold tracking-wide ${isLast ? "text-[#FFBA9D]" : "text-slate-300"}`}>
                {step.event}
              </span>

              {/* Time stamp */}
              <span className={`text-[10px] tabular-nums ${isLast ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                {step.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

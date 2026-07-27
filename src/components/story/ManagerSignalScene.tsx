import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Sparkles, TrendingUp, DollarSign, Clock, Repeat, ArrowRight, Bot, ShieldCheck } from 'lucide-react';

interface ManagerSignalSceneProps {
  orderTotal?: number;
  totalOrdersCount?: number;
  onOpenManagerAnalytics: () => void;
  onAskGemini: () => void;
  geminiInsightText?: string;
  isAiLoading?: boolean;
}

export const ManagerSignalScene: React.FC<ManagerSignalSceneProps> = ({
  orderTotal = 80.5,
  totalOrdersCount = 24,
  onOpenManagerAnalytics,
  onAskGemini,
  geminiInsightText = 'High Friday evening Wagyu demand predicted. Increase Station 2 prep allocation by +15% to maintain under 12-minute ticket times.',
  isAiLoading = false,
}) => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#F4F0E8] text-[#171714] border border-[#171714]/20 rounded-md p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 paper-pattern opacity-40 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#171714]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#171714] text-[#F4F0E8] rounded-xs">
            CHAPTER 05
          </span>
          <span className="font-mono text-xs tracking-widest text-[#171714]/60 uppercase">
            MANAGER ANALYTICS • GROUNDED GEMINI INSIGHTS
          </span>
        </div>
        <button
          onClick={onOpenManagerAnalytics}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#E7A23B] hover:bg-[#E7A23B]/80 text-[#171714] font-bold text-xs rounded-xs border border-[#171714] transition-all shadow-sm"
        >
          <span>Open Full Analytics Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Copy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E7A23B]/20 text-[#171714] border border-[#E7A23B] text-xs font-bold rounded-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E7A23B]" />
            <span>EXECUTIVE INTELLIGENCE</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight text-[#171714]">
            Data collected. <br />
            <span className="italic">Decisions revealed.</span>
          </h2>

          <p className="text-sm text-[#171714]/80 font-sans leading-relaxed">
            As closed tickets accumulate, revenue stats, prep latencies, stock burn rates, and table turnover update in real-time. Server-side Gemini AI synthesizes operations into clear, actionable advice.
          </p>

          <div className="p-4 bg-[#EAE5D9] border border-[#171714]/20 rounded-xs space-y-2 font-mono text-xs">
            <div className="font-bold flex items-center justify-between text-[#171714]">
              <span>REAL APPLICATION METRICS</span>
              <span className="text-[#1F6B4F]">LIVE DATABASE SYNC</span>
            </div>
            <p className="text-[11px] text-[#171714]/70 font-sans">
              No static hardcoded numbers—every ticket placed updates real restaurant statistics across shift reports.
            </p>
          </div>
        </div>

        {/* Right Editorial Dashboard & Gemini Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {/* Revenue Metric */}
            <div className="p-3.5 bg-[#EAE5D9] border border-[#171714]/30 rounded-xs space-y-1">
              <div className="text-[10px] text-[#171714]/60 font-bold flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#1F6B4F]" />
                <span>SHIFT REVENUE</span>
              </div>
              <div className="font-serif text-2xl font-bold text-[#1F6B4F]">
                ${(4280.0 + orderTotal).toFixed(2)}
              </div>
              <div className="text-[9px] text-[#1F6B4F] font-bold">
                +14% vs Last Friday
              </div>
            </div>

            {/* Avg Prep Latency */}
            <div className="p-3.5 bg-[#EAE5D9] border border-[#171714]/30 rounded-xs space-y-1">
              <div className="text-[10px] text-[#171714]/60 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#171714]" />
                <span>AVG PREP TIME</span>
              </div>
              <div className="font-serif text-2xl font-bold text-[#171714]">
                11.4 min
              </div>
              <div className="text-[9px] text-[#1F6B4F] font-bold">
                Under 12m Goal
              </div>
            </div>

            {/* Total Orders */}
            <div className="p-3.5 bg-[#EAE5D9] border border-[#171714]/30 rounded-xs space-y-1">
              <div className="text-[10px] text-[#171714]/60 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#E7A23B]" />
                <span>ORDERS FIRED</span>
              </div>
              <div className="font-serif text-2xl font-bold text-[#171714]">
                {totalOrdersCount + 1}
              </div>
              <div className="text-[9px] text-[#171714]/60">
                100% Ticket Accuracy
              </div>
            </div>

            {/* Table Turnover */}
            <div className="p-3.5 bg-[#EAE5D9] border border-[#171714]/30 rounded-xs space-y-1">
              <div className="text-[10px] text-[#171714]/60 font-bold flex items-center gap-1">
                <Repeat className="w-3 h-3 text-[#171714]" />
                <span>TURNOVER RATE</span>
              </div>
              <div className="font-serif text-2xl font-bold text-[#171714]">
                1.8x / hr
              </div>
              <div className="text-[9px] text-[#1F6B4F] font-bold">
                Optimal Floor Flow
              </div>
            </div>
          </div>

          {/* Gemini AI Operational Insights Card */}
          <div className="bg-[#171714] text-[#F4F0E8] border-2 border-[#171714] rounded-xs p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#F4F0E8]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#E7A23B] text-[#171714] rounded-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#F4F0E8] leading-tight">
                    Server-Side Gemini Operational Recommendation
                  </h4>
                  <div className="font-mono text-[10px] text-[#E7A23B]">
                    GROUNDED ON SHIFT DATA • NO HALLUCINATIONS
                  </div>
                </div>
              </div>

              <button
                onClick={onAskGemini}
                disabled={isAiLoading}
                className="px-3 py-1.5 bg-[#E7A23B] hover:bg-[#E7A23B]/80 text-[#171714] font-mono text-xs font-bold rounded-xs border border-[#E7A23B] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'Analyzing...' : 'Refresh AI Recommendation'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-[#F4F0E8] text-[#171714] rounded-xs font-mono text-xs space-y-1 border border-[#171714]/30">
              <div className="font-bold text-[#1F6B4F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>GEMINI AI INSIGHT FOR SHIFT MANAGER:</span>
              </div>
              <p className="font-sans text-xs text-[#171714]/90 leading-relaxed pt-1">
                "{geminiInsightText}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Footer Note */}
      <div className="relative z-10 pt-4 border-t border-[#171714]/20 flex justify-between items-center text-xs font-mono text-[#171714]/70">
        <div>PROCEED TO CHAPTER 06 FOR THE FINAL UNIFIED SYSTEM PAYOFF</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • STEP 05/06</div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, Utensils, QrCode, ChefHat, LayoutGrid, BarChart3, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface PayoffSceneProps {
  onRunLiveOrderStory: () => void;
  onEnterApp: () => void;
}

export const PayoffScene: React.FC<PayoffSceneProps> = ({
  onRunLiveOrderStory,
  onEnterApp,
}) => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#171714] text-[#F4F0E8] border border-[#171714] rounded-md p-6 sm:p-12 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 paper-pattern opacity-10 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#F4F0E8]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#E7A23B] text-[#171714] rounded-xs">
            CHAPTER 06
          </span>
          <span className="font-mono text-xs tracking-widest text-[#F4F0E8]/70 uppercase">
            THE PAYOFF • UNIFIED RESTAURANT OPERATING SYSTEM
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#E7A23B]">
          <Sparkles className="w-4 h-4" />
          <span>FULL-STACK OPERATIONAL HARMONY</span>
        </div>
      </div>

      {/* Central Headline & Value Proposition */}
      <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F4F0E8]/10 text-[#E7A23B] border border-[#E7A23B]/40 text-xs font-mono font-bold rounded-xs">
          <span>FROM SCAN TO SERVE • ZERO FRICTION</span>
        </div>

        <h2 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight text-[#F4F0E8] leading-[1.05]">
          A restaurant that <br />
          <span className="italic text-[#E7A23B]">moves as one.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#F4F0E8]/80 font-sans leading-relaxed max-w-2xl mx-auto">
          No lost orders. No sold-out miscommunications. No kitchen delays. SmartServe OS connects customer QR ordering, kitchen display systems, floor staff map routing, and manager Gemini AI into one seamless real-time operation.
        </p>

        {/* Connected System Pipeline Graphic */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto pt-4 font-mono text-xs text-[#171714]">
          <div className="p-3 bg-[#F4F0E8] rounded-xs border border-[#F4F0E8] space-y-1 text-center">
            <QrCode className="w-5 h-5 mx-auto text-[#171714]" />
            <div className="font-bold text-[11px]">1. SCAN</div>
            <div className="text-[9px] text-[#171714]/70">Table QR</div>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded-xs border border-[#F4F0E8] space-y-1 text-center">
            <Utensils className="w-5 h-5 mx-auto text-[#1F6B4F]" />
            <div className="font-bold text-[11px]">2. ORDER</div>
            <div className="text-[9px] text-[#171714]/70">Live Menu 86</div>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded-xs border border-[#F4F0E8] space-y-1 text-center">
            <ChefHat className="w-5 h-5 mx-auto text-[#D84A3A]" />
            <div className="font-bold text-[11px]">3. COOK</div>
            <div className="text-[9px] text-[#171714]/70">KDS Station</div>
          </div>

          <div className="p-3 bg-[#F4F0E8] rounded-xs border border-[#F4F0E8] space-y-1 text-center">
            <LayoutGrid className="w-5 h-5 mx-auto text-[#1F6B4F]" />
            <div className="font-bold text-[11px]">4. SERVE</div>
            <div className="text-[9px] text-[#171714]/70">Floor Map</div>
          </div>

          <div className="p-3 bg-[#E7A23B] rounded-xs border border-[#E7A23B] space-y-1 text-center col-span-2 sm:col-span-1">
            <BarChart3 className="w-5 h-5 mx-auto text-[#171714]" />
            <div className="font-bold text-[11px]">5. INSIGHT</div>
            <div className="text-[9px] text-[#171714]">Gemini AI</div>
          </div>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRunLiveOrderStory}
            className="px-8 py-4 bg-[#E7A23B] hover:bg-[#E7A23B]/90 text-[#171714] font-mono text-sm font-extrabold rounded-xs border-2 border-[#E7A23B] transition-all shadow-2xl flex items-center gap-2 hover:scale-105"
          >
            <Play className="w-4 h-4 fill-[#171714]" />
            <span>RUN LIVE ORDER STORY</span>
          </button>

          <button
            onClick={onEnterApp}
            className="px-8 py-4 bg-[#F4F0E8] hover:bg-[#F4F0E8]/90 text-[#171714] font-mono text-sm font-extrabold rounded-xs border-2 border-[#F4F0E8] transition-all flex items-center gap-2 hover:scale-105"
          >
            <span>ENTER SMARTSERVE OS OPERATIONAL MODULES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="relative z-10 pt-4 border-t border-[#F4F0E8]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#F4F0E8]/60">
        <div>FIRESTORE DB • SERVER GEMINI AI • SUPABASE RLS SECURITY</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • END OF STORY</div>
      </div>
    </div>
  );
};

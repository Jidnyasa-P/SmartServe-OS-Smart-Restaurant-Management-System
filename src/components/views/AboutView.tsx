import React from 'react';
import { motion } from 'motion/react';
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  Zap,
  QrCode,
  ChefHat,
  BarChart3,
  Users,
  Award,
  Clock,
  ArrowRight,
  Globe,
  HeartHandshake,
} from 'lucide-react';

interface AboutViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-12 max-w-6xl mx-auto"
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>VIBEATHON 6.0 (2K26) HACKATHON SUBMISSION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Modern Restaurant Operations.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            SmartServe OS was engineered to replace chaotic manual restaurant workflows with real-time digital harmony. From instant table QR scanning and live dish stock availability (86ing) to kitchen KDS sync and server-side Gemini AI analytics, every feature is designed to reduce friction and elevate the dining experience.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('journey')}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Explore Interactive Overview Story</span>
              </button>
            )}

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
              >
                <span>Contact Engineering Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core Operational Bottlenecks Solved */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Real Restaurant Challenges. Real Software Solutions.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Rather than replicating standard food delivery apps, SmartServe OS targets ground-floor operational friction points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero-Wait QR Ordering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diners scan cryptographic table tokens to view live digital menus, customize dietary tags, and send orders directly to kitchen stations without waiting for staff.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant 86 & Kitchen Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When kitchen stock runs out, chefs toggle items off instantly. Sold-out dishes immediately disappear from customer view to eliminate ordering disappointment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Grounded Gemini AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-side Gemini 2.5 Flash analyzes live shift tickets, raw ingredient burn rates, and prep times to generate zero-hallucination management advice.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack & Architecture Highlights */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              SYSTEM ARCHITECTURE
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Built for High Concurrency & Zero Data Exposure</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supabase RLS & Firestore Security</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold">FRONTEND</div>
            <div className="text-white font-sans text-sm font-semibold">React 19 + Vite</div>
            <div className="text-slate-400 text-[11px] font-sans">Tailwind CSS & Motion</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold">BACKEND</div>
            <div className="text-white font-sans text-sm font-semibold">Node.js Express 5</div>
            <div className="text-slate-400 text-[11px] font-sans">Zod & Helmet Protection</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold">DATABASE</div>
            <div className="text-white font-sans text-sm font-semibold">Cloud Firestore</div>
            <div className="text-slate-400 text-[11px] font-sans">Strict Default-Deny Rules</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold">AI INTELLIGENCE</div>
            <div className="text-white font-sans text-sm font-semibold">Gemini 2.5 Flash</div>
            <div className="text-slate-400 text-[11px] font-sans">Server-Side PII Scrubbing</div>
          </div>
        </div>
      </div>

      {/* Team / Mission Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>Built with Passion for VibeAthon6.0</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            SmartServe OS represents a complete full-stack SaaS solution built from scratch to push the boundaries of real-time restaurant technology.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
            TEAM: SMARTSERVE OS
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            100% USER STORIES COMPLETED
          </div>
        </div>
      </div>
    </motion.div>
  );
};

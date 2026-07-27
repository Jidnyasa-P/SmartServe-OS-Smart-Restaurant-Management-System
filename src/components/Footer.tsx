import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  Zap,
  QrCode,
  ChefHat,
  LayoutGrid,
  UtensilsCrossed,
  Grid,
  BarChart3,
  Bot,
  Mail,
  Send,
  CheckCircle2,
  ArrowUp,
  FileText,
  Scale,
  HelpCircle,
} from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 font-sans mt-16 relative">
      {/* Top Banner Status Ribbon */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>ALL SYSTEMS OPERATIONAL</span>
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">Real-time Firestore Sync Active</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-amber-400 hidden md:inline">Gemini 2.5 Flash Online</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => onNavigateTab('about')}
              className="hover:text-amber-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigateTab('contact')}
              className="hover:text-amber-400 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => onNavigateTab('privacy')}
              className="hover:text-amber-400 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigateTab('terms')}
              className="hover:text-amber-400 transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Col 1: Brand & Bio */}
        <div className="lg:col-span-4 space-y-4">
          <div
            onClick={() => onNavigateTab('journey')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white block leading-tight">
                SmartServe OS
              </span>
              <span className="font-mono text-[10px] text-amber-400 tracking-widest uppercase block">
                RESTAURANT OPERATING SYSTEM
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans pr-4">
            A full-stack, zero-friction SaaS platform replacing manual restaurant chaos with real-time digital harmony. Connecting customer QR menus, kitchen KDS screens, staff floor maps, and server-side Gemini AI.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              VibeAthon6.0 2K26
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              PLATINUM TIER
            </span>
          </div>
        </div>

        {/* Col 2: Core Platform Modules */}
        <div className="lg:col-span-3 space-y-3 font-mono text-xs">
          <div className="font-bold text-white tracking-wider uppercase text-[11px] text-amber-400">
            PLATFORM MODULES
          </div>

          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onNavigateTab('journey')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Overview & Story</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('customer')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer QR Menu</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('kitchen')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <ChefHat className="w-3.5 h-3.5 text-rose-400" />
                <span>Kitchen KDS Pass</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('staff')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Staff Floor Map</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('menu')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                <span>Menu & 86 Catalog</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('tables')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Grid className="w-3.5 h-3.5 text-slate-400" />
                <span>Tables & QR Tokens</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Company & Intelligence */}
        <div className="lg:col-span-2 space-y-3 font-mono text-xs">
          <div className="font-bold text-white tracking-wider uppercase text-[11px] text-amber-400">
            COMPANY & AI
          </div>

          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('ai')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Gemini 2.5 Flash</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('security')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Supabase RLS</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('about')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>About System</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('contact')}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Desk</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter & Legal Quick Links */}
        <div className="lg:col-span-3 space-y-4">
          <div className="font-mono font-bold text-white tracking-wider uppercase text-[11px] text-amber-400">
            OPERATIONAL RELEASE NOTES
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Subscribe for SmartServe OS feature updates, release notes, and security advisories.
          </p>

          {isSubscribed ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Subscribed to release notes!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="manager@restaurant.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
            <button
              onClick={() => onNavigateTab('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Back To Top */}
      <div className="border-t border-slate-900 py-6 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2026 SmartServe OS • Built for VibeAthon6.0 Hackathon. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

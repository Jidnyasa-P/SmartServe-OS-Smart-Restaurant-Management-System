import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { JourneyTimeline } from './components/JourneyTimeline';
import { CustomerMenuView } from './components/views/CustomerMenuView';
import { KitchenKdsView } from './components/views/KitchenKdsView';
import { FloorStaffView } from './components/views/FloorStaffView';
import { MenuManagementView } from './components/views/MenuManagementView';
import { TableManagementView } from './components/views/TableManagementView';
import { ManagerAnalyticsView } from './components/views/ManagerAnalyticsView';
import { AiInsightsView } from './components/views/AiInsightsView';
import { SecurityAuditView } from './components/views/SecurityAuditView';
import { AuthSetupView } from './components/views/AuthSetupView';
import { AuthPage } from './components/auth/AuthPage';
import { QrCodeModal } from './components/QrCodeModal';
import {
  QrCode,
  BookOpen,
  ShoppingBag,
  ChefHat,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  Grid,
  UtensilsCrossed,
  BarChart3,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    simulateCustomerOrder,
    isAuthenticated,
  } = useStore();

  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [guestBypassed, setGuestBypassed] = useState<boolean>(false);
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);

  // If user is not authenticated and has not chosen guest demo mode, show the Login Page FIRST
  if (!isAuthenticated && !guestBypassed) {
    return (
      <AuthPage
        onSuccess={() => setGuestBypassed(true)}
        allowGuestAccess={true}
      />
    );
  }

  // If user opened Auth Screen explicitly
  if (showAuthScreen) {
    return (
      <AuthPage
        onSuccess={() => setShowAuthScreen(false)}
        allowGuestAccess={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      <div>
        {/* Top Header Bar */}
        <Header
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenAuthModal={() => setShowAuthScreen(true)}
        />

        {/* Storytelling Timeline Ribbon */}
        <JourneyTimeline />

        {/* Operational Modules Navigation Tabs Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'journey'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'customer'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Customer QR Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('kitchen')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'kitchen'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen KDS</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'staff'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Staff Floor Map</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menu & 86 Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'tables'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tables & QR Tokens</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Gemini AI Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'security'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Supabase RLS</span>
            </button>
          </div>
        </div>

        {/* Tab Content Router */}
        <main className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Hero Showcase Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 rounded-3xl p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="max-w-3xl space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>SmartServe OS • Operational Engine Active</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                      End-to-End Smart Restaurant Operations
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      A complete, zero-friction SaaS platform solving real-world operational challenges: live dish stock toggles, secure QR menu ordering, kitchen display sync (KDS), floor staff alert routing, and server-side Gemini AI analytics.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={simulateCustomerOrder}
                        className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Simulate Live Customer Order</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('customer')}
                        className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
                      >
                        <span>Open Customer QR Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Journey Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    onClick={() => setActiveTab('customer')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg">1. Customer QR Menu & Cart</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Diners scan table QR token, view live dish stock, customize options with prep notes, and send orders directly to the kitchen.
                    </p>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-2">
                      Test QR Menu &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('menu')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg">2. Menu & Category Management</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Zod-validated menu creation, custom category sorting, live dish availability (86ing), and prep time management.
                    </p>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-2">
                      Manage Dishes & Categories &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('tables')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Grid className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg">3. Table Grid & QR Tokens</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Configure restaurant table layout, regenerate cryptographic QR security tokens, and generate printable tent cards.
                    </p>
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 pt-2">
                      Manage Floor Tables & Tokens &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('kitchen')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg">4. Kitchen Order KDS</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      High-visibility order kanban (Pending, Cooking, Ready) with prep timers, overdue alarms, and instant 86 stock toggles.
                    </p>
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1 pt-2">
                      Open Kitchen KDS &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('staff')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg">5. Floor Staff Service Map</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Real-time floor grid with table status visualizer (Occupied, Needs Cleaning, Reserved) and instant waiter assistance alerts.
                    </p>
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-2">
                      View Staff Floor Map &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('ai')}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-3 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 animate-pulse text-purple-400" />
                    </div>
                    <h3 className="font-extrabold text-lg">6. Gemini AI Operational Engine</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Server-side Gemini AI generating dynamic pricing recommendations, yield optimization, waste alerts, and intelligent Q&A.
                    </p>
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1 pt-2">
                      Launch Gemini AI Engine &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'customer' && <CustomerMenuView />}
            {activeTab === 'kitchen' && <KitchenKdsView />}
            {activeTab === 'staff' && <FloorStaffView />}
            {activeTab === 'menu' && <MenuManagementView />}
            {activeTab === 'tables' && <TableManagementView />}
            {activeTab === 'analytics' && <ManagerAnalyticsView />}
            {activeTab === 'ai' && <AiInsightsView />}
            {activeTab === 'security' && <SecurityAuditView />}
            {activeTab === 'setup' && <AuthSetupView />}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>SmartServe OS • Full-Stack Restaurant Management System</span>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <button onClick={() => setActiveTab('journey')} className="hover:text-white">
              Overview
            </button>
            <button onClick={() => setActiveTab('menu')} className="hover:text-white">
              Menu Catalog
            </button>
            <button onClick={() => setActiveTab('tables')} className="hover:text-white">
              Table QR Tokens
            </button>
            <button onClick={() => setActiveTab('security')} className="hover:text-white">
              Supabase RLS
            </button>
          </div>
        </div>
      </footer>

      {/* Printable QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

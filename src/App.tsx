import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
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

import { CinematicStoryOverview } from './components/story/CinematicStoryOverview';

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

        {/* Operational Modules Navigation Tabs Bar */}
        {activeTab !== 'journey' && <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 overflow-x-auto">
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
              <span>Security & RBAC</span>
            </button>
          </div>
        </div>}

        {/* Tab Content Router */}
        <main className={activeTab === 'journey' ? 'w-full' : 'pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-6'}>
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <CinematicStoryOverview />
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
      {activeTab !== 'journey' && <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
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
              Security & RBAC
            </button>
          </div>
        </div>
      </footer>}

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

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import {
  Utensils,
  Bell,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  User,
  ChefHat,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
  Settings,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenQrModal: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQrModal, onOpenAuthModal }) => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    restaurant,
    notifications,
    markNotificationRead,
    auditLogs,
    userProfile,
    isAuthenticated,
    logout,
  } = useStore();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleConfig: Record<
    UserRole,
    { label: string; color: string; icon: React.ReactNode; desc: string }
  > = {
    customer: {
      label: 'Customer (QR Diner)',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <User className="w-4 h-4" />,
      desc: 'QR Ordering, Live Menu, Cart & Table Calling',
    },
    kitchen: {
      label: 'Kitchen Station (Chef)',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <ChefHat className="w-4 h-4" />,
      desc: 'Live KDS Order Kanban, Timer Alarms & Item Checkoff',
    },
    staff: {
      label: 'Floor Staff (Waiter)',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: <Users className="w-4 h-4" />,
      desc: 'Floor Table Map, Service Alerts & Table Clearing',
    },
    manager: {
      label: 'Manager (Admin)',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: <BarChart3 className="w-4 h-4" />,
      desc: 'Full Analytics, Inventory, Menu 86 & Gemini AI Engine',
    },
    admin: {
      label: 'System Owner / RLS Auditor',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: 'Supabase RLS Inspection, Audit Stream & Security',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('journey')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-200 bg-clip-text text-transparent">
                  SmartServe OS
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {restaurant.name}
              </p>
            </div>
          </button>
        </div>

        {/* Quick Navigation / Action Bar */}
        <div className="flex items-center gap-3">
          {/* QR Code Printable Tent Button */}
          <button
            onClick={onOpenQrModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Table QR Simulator</span>
          </button>

          {/* Demo Role Switcher Pill - Active only when VITE_DEMO_MODE=true */}
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${roleConfig[currentRole].color}`}
              >
                {roleConfig[currentRole].icon}
                <span className="hidden sm:inline">
                  Demo View: {roleConfig[currentRole].label.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Role Dropdown */}
              <AnimatePresence>
                {showRoleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                        Demo View Switcher (UI Only)
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Changes UI view for testing. Does NOT grant server API authorization.
                      </p>
                    </div>
                    {(Object.keys(roleConfig) as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setCurrentRole(r);
                          setShowRoleDropdown(false);
                          if (r === 'customer') setActiveTab('customer');
                          else if (r === 'kitchen') setActiveTab('kitchen');
                          else if (r === 'staff') setActiveTab('staff');
                          else if (r === 'manager') setActiveTab('analytics');
                          else if (r === 'admin') setActiveTab('security');
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                          currentRole === r
                            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                          {roleConfig[r].icon}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-100">
                            {roleConfig[r].label}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {roleConfig[r].desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifDrawer && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 text-slate-100"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-xs">Live Operation Alerts</span>
                    </div>
                    <button
                      onClick={() => setShowNotifDrawer(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        No active alerts right now.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-amber-300">{n.title}</span>
                            <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Auth Profile Badge & Logout */}
          {isAuthenticated && userProfile ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-amber-300 leading-tight">
                  {userProfile.fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {userProfile.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-slate-300 transition-all flex items-center gap-1.5"
                title="Sign out of Firebase Auth"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline text-xs font-semibold">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              Sign In
            </button>
          )}

          {/* RLS Security Inspector Button */}
          <button
            onClick={() => setActiveTab('security')}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Inspect Database Security & Audit Logs"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

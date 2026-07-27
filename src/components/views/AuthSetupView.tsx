import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import {
  User,
  Mail,
  Lock,
  Building,
  ShieldCheck,
  CheckCircle2,
  Key,
  Globe,
  Settings,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AuthSetupView: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    restaurant,
    updateRestaurant,
    addAuditLog,
  } = useStore();

  // Auth Form State
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('alex.manager@smartserve.os');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Restaurant Edit State
  const [restName, setRestName] = useState<string>(restaurant.name);
  const [restTagline, setRestTagline] = useState<string>(restaurant.tagline);
  const [restTables, setRestTables] = useState<number>(restaurant.tablesCount);
  const [restCurrency, setRestCurrency] = useState<string>(restaurant.currency);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    setAuthMessage(`Successfully authenticated as ${email} (${selectedRole.toUpperCase()} role)`);
    addAuditLog(
      'USER_AUTHENTICATED',
      `AuthSession:${email}`,
      'success',
      `Issued JWT token session claims for role: ${selectedRole}`
    );
  };

  const handleGoogleAuth = () => {
    setAuthMessage('Google OAuth Session initialized. Syncing credentials...');
    setTimeout(() => {
      setCurrentRole('manager');
      setAuthMessage('Authenticated via Google OAuth as jidnyasapatil019@gmail.com (Manager Role)');
      addAuditLog(
        'GOOGLE_OAUTH_LOGIN',
        'AuthSession:OAuth',
        'success',
        'Google OAuth identity verified and synchronized.'
      );
    }, 1000);
  };

  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant({
      name: restName,
      tagline: restTagline,
      tablesCount: restTables,
      currency: restCurrency,
    });
    setAuthMessage('Restaurant configuration parameters updated!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Authentication & Restaurant OS Setup
            </h1>
            <p className="text-xs text-slate-400">
              User identity authentication • Role scope configuration • Supabase Cloud integration
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono font-bold">
          Active Role: {currentRole.toUpperCase()}
        </span>
      </div>

      {authMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{authMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Auth Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-base">
                {isLogin ? 'User Login Session' : 'Register Account'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-amber-400 font-semibold hover:underline"
            >
              {isLogin ? 'Need an account? Register' : 'Existing user? Login'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Assigned Role Persona
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="customer">Customer (QR Diner)</option>
                <option value="kitchen">Kitchen Station (Chef)</option>
                <option value="staff">Floor Staff (Waiter)</option>
                <option value="manager">Restaurant Manager</option>
                <option value="admin">System Owner / RLS Auditor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {isLogin ? 'Sign In & Set Role' : 'Create Account'}
            </button>

            <div className="relative my-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-semibold">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Sign in with Google OAuth</span>
            </button>
          </form>
        </div>

        {/* Restaurant Parameters Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">Restaurant Configuration</h2>
          </div>

          <form onSubmit={handleSaveRestaurant} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restName}
                onChange={(e) => setRestName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={restTagline}
                onChange={(e) => setRestTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tables Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={restTables}
                  onChange={(e) => setRestTables(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={restCurrency}
                  onChange={(e) => setRestCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Save Restaurant Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

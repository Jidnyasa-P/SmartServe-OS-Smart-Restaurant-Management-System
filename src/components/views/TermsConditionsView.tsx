import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  Scale,
  Ban,
  Clock,
} from 'lucide-react';

export const TermsConditionsView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-10 max-w-5xl mx-auto"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            LEGAL AGREEMENT & SERVICE TERMS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Terms & Conditions
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span>VERSION 1.0 (2K26)</span>
          <span>•</span>
          <span>APPLIES TO ALL ROLES & TENANTS</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 text-xs text-slate-300 font-sans leading-relaxed">
        {/* Term 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">01.</span> Acceptance of Terms
          </h2>
          <p>
            By accessing or using the SmartServe OS platform, digital QR menus, kitchen display system (KDS), or manager analytics, you agree to be bound by these Terms & Conditions. If you do not agree, you must cease using the application immediately.
          </p>
        </section>

        {/* Term 2 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">02.</span> Role-Based Authorization & Credentials
          </h2>
          <p>
            Users are assigned specific roles (`customer`, `staff`, `kitchen`, `manager`, `admin`). Restaurant managers and staff are responsible for maintaining the confidentiality of their login credentials. Any unauthorized attempt to escalate privileges or access restricted management views without permission is logged in our Security Audit Stream and subject to termination of access.
          </p>
        </section>

        {/* Term 3 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">03.</span> Digital Ordering & Pricing Integrity
          </h2>
          <p>
            Orders placed via table QR codes are transmitted directly to kitchen stations. All item prices are calculated exclusively by our server backend from database canonical values. Frontend price manipulation attempts will be automatically rejected by API gateway security validation.
          </p>
        </section>

        {/* Term 4 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">04.</span> Prohibited System Misuse
          </h2>
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
              <Ban className="w-4 h-4" />
              <span>STRICTLY PROHIBITED ACTIONS:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li>Forging or spoofing 256-bit cryptographic table QR tokens to submit fake orders.</li>
              <li>Exceeding automated rate limits or initiating DDoS attacks against Express endpoints.</li>
              <li>Attempting to bypass Supabase RLS policies or Firestore default-deny rules.</li>
            </ul>
          </div>
        </section>

        {/* Term 5 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">05.</span> Intellectual Property & Software
          </h2>
          <p>
            All software code, visual UI elements, brand identities, and Gemini AI integration workflows remain the intellectual property of SmartServe OS and VibeAthon6.0 Hackathon contributors.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

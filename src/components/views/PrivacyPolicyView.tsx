import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
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
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            SECURITY & DATA PRIVACY COMPLIANCE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Privacy Policy
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span>LAST REVISED: JULY 2026</span>
          <span>•</span>
          <span>EFFECTIVE VERSION 2.5</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">ZERO-PII AI GUARANTEE ACTIVE</span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <EyeOff className="w-5 h-5 text-amber-400" />
          <div className="font-bold text-white">PII SANITIZATION</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Names, emails, and table tokens are scrubbed before feeding context to AI models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <div className="font-bold text-white">256-BIT CRYPTO HASHS</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Table QR tokens use crypto random bytes. Only SHA-256 hashes reside in database storage.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <div className="font-bold text-white">ENCRYPTED STORAGE</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            All data in transit is TLS 1.3 encrypted and Firestore databases enforce AES-256 at rest.
          </p>
        </div>
      </div>

      {/* Detailed Policy Content */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 text-xs text-slate-300 font-sans leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">01.</span> Information We Collect
          </h2>
          <p>
            SmartServe OS collects minimal operational data necessary to perform restaurant workflows:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong className="text-white">Account Profiles:</strong> User name, email address, role assignment, and hashed passwords when registering.</li>
            <li><strong className="text-white">Transactional Orders:</strong> Items ordered, table number, total price, payment method, and timestamp.</li>
            <li><strong className="text-white">Security Logs:</strong> IP address, user agent, and action audit logs stored in the security stream.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">02.</span> Zero-PII AI Data Processing
          </h2>
          <p>
            When processing operational insights via Google Gemini 2.5 Flash API, our server pipeline executes strict PII (Personally Identifiable Information) scrubbing:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
            <div className="text-emerald-400 font-bold">RAW PAYLOAD STRIPPING PIPELINE:</div>
            <div>• REMOVED: fullName, email, phone, customerId, tableToken</div>
            <div>• PASSED: Aggregated dish counts, prep latency, ingredient burn rates, revenue total</div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">03.</span> Table Token & Cryptographic Security
          </h2>
          <p>
            Table QR tokens are generated via 256-bit cryptographically secure pseudorandom number generators. The plain token is passed exclusively in QR URL query params. Only the SHA-256 hash is retained in our database to prevent token forgery and unauthorized order placement.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400">04.</span> Data Retention & Rights
          </h2>
          <p>
            Shift logs and transactional history are retained for accounting and analytics purposes. Restaurant managers and users may request profile deletion or data export at any time by contacting privacy@smartserve.os.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

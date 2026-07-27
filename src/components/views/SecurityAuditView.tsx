import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getSupabaseStatus } from '../../lib/supabase';
import { ShieldCheck, Lock, ShieldAlert, Key, Terminal, FileCode, CheckCircle2, XCircle } from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const { auditLogs, currentRole, addAuditLog } = useStore();
  const supabaseStatus = getSupabaseStatus();

  const rlsMatrix = [
    { resource: 'menu_items (Read)', customer: 'ALLOW (Public)', staff: 'ALLOW', kitchen: 'ALLOW', manager: 'ALLOW', admin: 'ALLOW' },
    { resource: 'menu_items (86 Stock Write)', customer: 'DENIED (RLS)', staff: 'DENIED (RLS)', kitchen: 'ALLOW', manager: 'ALLOW', admin: 'ALLOW' },
    { resource: 'orders (Customer Insert)', customer: 'ALLOW (Own Table)', staff: 'ALLOW', kitchen: 'ALLOW', manager: 'ALLOW', admin: 'ALLOW' },
    { resource: 'orders (Status Update)', customer: 'DENIED (RLS)', staff: 'ALLOW', kitchen: 'ALLOW', manager: 'ALLOW', admin: 'ALLOW' },
    { resource: 'inventory_items (Read/Write)', customer: 'DENIED (RLS)', staff: 'DENIED (RLS)', kitchen: 'READ ONLY', manager: 'ALLOW', admin: 'ALLOW' },
    { resource: 'audit_logs (Insert/Inspect)', customer: 'DENIED (RLS)', staff: 'DENIED (RLS)', kitchen: 'DENIED (RLS)', manager: 'READ ONLY', admin: 'FULL ACCESS' },
  ];

  const triggerTestViolation = () => {
    addAuditLog(
      'UNAUTHORIZED_SQL_ATTEMPT',
      'tables:delete_all',
      'blocked',
      `RLS BLOCKED: Active role '${currentRole}' attempted prohibited operation DELETE on database tables.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Security Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Supabase RLS Security Policy & Audit Inspector
            </h1>
            <p className="text-xs text-slate-400">
              Zero-trust architecture • Role claims enforcement • Immutable audit stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {supabaseStatus.status}
          </span>

          <button
            onClick={triggerTestViolation}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
          >
            Simulate RLS Policy Block
          </button>
        </div>
      </div>

      {/* RLS Permission Matrix Table */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Lock className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base">Row Level Security (RLS) Policy Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-2">Table / Action Scope</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Staff</th>
                <th className="py-3 px-2">Kitchen</th>
                <th className="py-3 px-2">Manager</th>
                <th className="py-3 px-2">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rlsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="py-3 px-2 font-bold text-slate-200">{row.resource}</td>
                  <td className={`py-3 px-2 font-mono ${row.customer.includes('DENIED') ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>{row.customer}</td>
                  <td className="py-3 px-2 font-mono text-slate-300">{row.staff}</td>
                  <td className="py-3 px-2 font-mono text-slate-300">{row.kitchen}</td>
                  <td className="py-3 px-2 font-mono text-slate-300">{row.manager}</td>
                  <td className="py-3 px-2 font-mono text-emerald-400 font-bold">{row.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">Real-Time Security Audit Trail Log</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditLogs.length} Events Recorded
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-2xl border text-xs font-mono space-y-1 transition-colors ${
                log.status === 'blocked'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  {log.status === 'blocked' ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-amber-300">[{log.action}]</span>
                  <span>{log.resource}</span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                User: {log.userName} ({log.userRole}) • Details: {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { RestaurantTable, TableStatus } from '../../types';
import {
  Users,
  Bell,
  CheckCircle2,
  Sparkles,
  Utensils,
  Receipt,
  DollarSign,
  RefreshCw,
  X,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloorStaffView: React.FC = () => {
  const {
    tables,
    orders,
    dismissWaiterCall,
    markOrderPaid,
    selectedTableNumber,
    setSelectedTableNumber,
  } = useStore();

  const [activeModalTable, setActiveModalTable] = useState<RestaurantTable | null>(null);

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const alertCount = tables.filter((t) => t.waiterCalled).length;
  const cleaningCount = tables.filter((t) => t.status === 'needs_cleaning').length;

  const statusColors: Record<TableStatus, { bg: string; border: string; text: string; badge: string }> = {
    available: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500 text-slate-950' },
    occupied: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500 text-slate-950' },
    needs_cleaning: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300', badge: 'bg-rose-500 text-white' },
    reserved: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', badge: 'bg-purple-500 text-white' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Floor Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Floor Staff Table Management Map
            </h1>
            <p className="text-xs text-slate-400">
              Interactive table matrix • Waiter call notifications • Instant table reset & bill settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 text-xs font-semibold">
            <span className="text-slate-400">Occupancy:</span>
            <span className="text-amber-300 font-bold">{Math.round((occupiedCount / tables.length) * 100)}%</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 text-xs font-semibold">
            <span className="text-slate-400">Alerts:</span>
            <span className={`font-bold ${alertCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {alertCount} Waiter Calls
            </span>
          </div>
        </div>
      </div>

      {/* Table Floor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          const tableOrder = orders.find((o) => o.id === table.currentOrderId);
          const style = statusColors[table.status];

          return (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={table.id}
              onClick={() => setActiveModalTable(table)}
              className={`rounded-3xl border ${style.border} ${style.bg} p-5 text-slate-100 cursor-pointer shadow-xl relative overflow-hidden transition-all`}
            >
              {/* Waiter Alert Pulsing Ring */}
              {table.waiterCalled && (
                <div className="absolute inset-0 border-2 border-rose-500 animate-pulse rounded-3xl pointer-events-none" />
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-100">
                    Table #{table.number}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({table.capacity} seats)
                  </span>
                </div>

                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${style.badge}`}
                >
                  {table.status.replace('_', ' ')}
                </span>
              </div>

              {/* Table Info Content */}
              <div className="py-4 space-y-2">
                {table.waiterCalled ? (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-400 animate-bounce" />
                      <span className="text-xs font-bold">Assistance Needed!</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissWaiterCall(table.number);
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-500 text-white font-bold text-[10px]"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : tableOrder ? (
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-amber-300">
                      <span>Order #{tableOrder.id}</span>
                      <span>${tableOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {tableOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                      <span>Status: {tableOrder.status.toUpperCase()}</span>
                      <span>{tableOrder.paymentStatus.toUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    Table is currently vacant and clean.
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Assigned: {table.assignedStaffName || 'Floor Team'}
                </span>
                <span className="text-amber-400 font-bold hover:underline">
                  Manage Table &rarr;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Table Detail View */}
      <AnimatePresence>
        {activeModalTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-extrabold">
                    Table #{activeModalTable.number} Controls
                  </h2>
                  <p className="text-xs text-slate-400">
                    Capacity: {activeModalTable.capacity} guests • Status: {activeModalTable.status.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalTable(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Quick Actions */}
              <div className="space-y-3">
                {activeModalTable.waiterCalled && (
                  <button
                    onClick={() => {
                      dismissWaiterCall(activeModalTable.number);
                      setActiveModalTable(null);
                    }}
                    className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Acknowledge & Clear Waiter Call Alert</span>
                  </button>
                )}

                {activeModalTable.currentOrderId && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-amber-300">
                      <span>Active Bill Order #{activeModalTable.currentOrderId}</span>
                      <span>
                        $
                        {orders
                          .find((o) => o.id === activeModalTable.currentOrderId)
                          ?.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (activeModalTable.currentOrderId) {
                          markOrderPaid(activeModalTable.currentOrderId, 'card');
                          setActiveModalTable(null);
                        }
                      }}
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Process Bill Payment (Mark Paid)</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedTableNumber(activeModalTable.number);
                    setActiveModalTable(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Open Customer QR Menu View for Table #{activeModalTable.number}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

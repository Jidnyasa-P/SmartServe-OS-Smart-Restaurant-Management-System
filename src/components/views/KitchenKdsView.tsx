import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const KitchenKdsView: React.FC = () => {
  const { orders, updateOrderStatus, toggleDishAvailability, menuItems } = useStore();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [filterStation, setFilterStation] = useState<string>('all');

  const columns: { id: OrderStatus; label: string; color: string; badgeColor: string }[] = [
    { id: 'pending', label: 'Incoming Orders', color: 'border-amber-500/30 bg-amber-500/5', badgeColor: 'bg-amber-500 text-slate-950' },
    { id: 'cooking', label: 'In Preparation', color: 'border-orange-500/30 bg-orange-500/5', badgeColor: 'bg-orange-500 text-slate-950' },
    { id: 'ready', label: 'Ready for Service', color: 'border-emerald-500/30 bg-emerald-500/5', badgeColor: 'bg-emerald-500 text-slate-950' },
    { id: 'served', label: 'Completed / Served', color: 'border-slate-800 bg-slate-900/40', badgeColor: 'bg-slate-700 text-slate-300' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* KDS Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Kitchen Display System (KDS Station)
            </h1>
            <p className="text-xs text-slate-400">
              Real-time line cook order queue • Automated elapsed timer alerts • Instant 86 stock toggles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime Active' : 'Muted'}</span>
          </button>

          {/* Quick Dish Stock 86 Panel */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold hidden sm:inline">Quick 86:</span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
              {menuItems.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleDishAvailability(m.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    m.isAvailable
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                  title={m.isAvailable ? 'Click to mark 86 (Out of Stock)' : 'Click to make Available'}
                >
                  {m.name.split(' ')[0]} {!m.isAvailable && '(86)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KDS Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-3xl border ${col.color} p-4 flex flex-col justify-between min-h-[500px] space-y-4`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-200">
                    {col.label}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}
                  >
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-600 text-xs font-medium">
                    No orders in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const elapsedMins = Math.floor(
                      (Date.now() - new Date(order.createdAt).getTime()) / 60000
                    );
                    const isOverdue = elapsedMins > order.estimatedPrepTime;

                    return (
                      <motion.div
                        layout
                        key={order.id}
                        className={`bg-slate-900 border rounded-2xl p-4 shadow-xl space-y-3 transition-all ${
                          isOverdue && order.status !== 'served'
                            ? 'border-rose-500/60 ring-2 ring-rose-500/20'
                            : order.priority === 'vip'
                            ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                            : 'border-slate-800'
                        }`}
                      >
                        {/* Ticket Top */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-amber-300">
                              Table #{order.tableNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{order.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {order.priority === 'vip' && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                                VIP
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                isOverdue && order.status !== 'served'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {elapsedMins}m / ~{order.estimatedPrepTime}m
                            </span>
                          </div>
                        </div>

                        {/* Ticket Dishes */}
                        <div className="space-y-1.5">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between text-xs text-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px] flex items-center justify-center">
                                  {item.quantity}x
                                </span>
                                <div>
                                  <span className="font-bold text-slate-100">
                                    {item.name}
                                  </span>
                                  {item.notes && (
                                    <p className="text-[10px] text-amber-400 italic">
                                      "{item.notes}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cooking')}
                              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Start Cooking</span>
                            </button>
                          )}

                          {order.status === 'cooking' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Ready for Pick-up</span>
                            </button>
                          )}

                          {order.status === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'served')}
                              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Hand to Floor Waiter</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

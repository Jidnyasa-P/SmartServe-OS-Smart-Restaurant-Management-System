import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Minus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ManagerAnalyticsView: React.FC = () => {
  const {
    orders,
    inventory,
    updateInventoryQuantity,
    menuItems,
    restaurant,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'dishes'>('sales');

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const todayRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 4280; // Seed baseline
  const avgOrderValue = todayRevenue / (paidOrders.length + 42);

  const lowStockCount = inventory.filter((i) => i.status !== 'ok').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Manager Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Manager Analytics & Inventory Operations
            </h1>
            <p className="text-xs text-slate-400">
              Live sales performance • Stock reorder automation • Margin optimization
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'sales'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sales Metrics
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'inventory'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inventory ({lowStockCount} Low)
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dishes'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Popular Dishes
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Today's Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            ${todayRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400/80 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Avg Table Ticket</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            ${avgOrderValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            Based on 48 completed tables
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Active Orders</span>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400">
            {orders.filter((o) => o.status !== 'completed').length}
          </div>
          <div className="text-[11px] text-slate-400">
            Kitchen & Floor queue active
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {lowStockCount} Items
          </div>
          <div className="text-[11px] text-rose-400/80">
            Requires supplier reorder
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sales' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-slate-100 space-y-4">
          <h2 className="font-bold text-base">Peak Hours Seating & Hourly Revenue Velocity</h2>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4 border-t border-slate-800">
            {[
              { hr: '12 PM', val: 40 },
              { hr: '1 PM', val: 85 },
              { hr: '2 PM', val: 60 },
              { hr: '3 PM', val: 20 },
              { hr: '4 PM', val: 15 },
              { hr: '5 PM', val: 35 },
              { hr: '6 PM', val: 75 },
              { hr: '7 PM', val: 95 },
              { hr: '8 PM', val: 100 },
              { hr: '9 PM', val: 80 },
              { hr: '10 PM', val: 45 },
              { hr: '11 PM', val: 25 },
            ].map((item) => (
              <div key={item.hr} className="flex flex-col items-center gap-2">
                <div className="w-full bg-slate-950 h-32 rounded-xl flex items-end p-1 border border-slate-800">
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full bg-gradient-to-t from-purple-600 to-amber-400 rounded-lg"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.hr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 text-slate-100 space-y-4">
          <h2 className="font-bold text-base">Real-time Stock Management</h2>
          <div className="space-y-3">
            {inventory.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{inv.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'low'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supplier: {inv.supplier} • Reorder Threshold: {inv.reorderLevel} {inv.unit}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => updateInventoryQuantity(inv.id, Math.max(0, inv.quantity - 1))}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs text-amber-300">
                      {inv.quantity} {inv.unit}
                    </span>
                    <button
                      onClick={() => updateInventoryQuantity(inv.id, inv.quantity + 5)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dishes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 text-slate-100"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="font-bold text-sm">{item.name}</div>
                <div className="text-xs text-amber-300 font-semibold">${item.price.toFixed(2)}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Prep Time: ~{item.prepTimeMinutes} mins • Stock: {item.stockCount} left
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

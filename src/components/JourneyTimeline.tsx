import React from 'react';
import { useStore } from '../context/StoreContext';
import { QrCode, BookOpen, ShoppingBag, ChefHat, LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const JourneyTimeline: React.FC = () => {
  const { activeTab, setActiveTab, orders, tables } = useStore();

  const steps = [
    {
      id: 'customer',
      stepNum: '01',
      title: 'Customer Scans QR',
      subtitle: 'Table 4 Mobile Portal',
      icon: <QrCode className="w-4 h-4" />,
      badge: `${tables.filter((t) => t.status === 'occupied').length} Occupied Tables`,
      tabTarget: 'customer',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'menu',
      stepNum: '02',
      title: 'Live Dish Availability',
      subtitle: '86 Stock Protection',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Real-time Stock',
      tabTarget: 'customer',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      id: 'cart',
      stepNum: '03',
      title: 'Instant Order Placed',
      subtitle: 'Zero Staff Delay',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: `${orders.filter((o) => o.status === 'pending').length} Pending Orders`,
      tabTarget: 'customer',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'kitchen',
      stepNum: '04',
      title: 'Kitchen KDS Board',
      subtitle: 'Live Cooking Queue',
      icon: <ChefHat className="w-4 h-4" />,
      badge: `${orders.filter((o) => o.status === 'cooking').length} In Kitchen`,
      tabTarget: 'kitchen',
      color: 'from-rose-500 to-red-600',
    },
    {
      id: 'staff',
      stepNum: '05',
      title: 'Floor Staff Map',
      subtitle: 'Table Service & Calling',
      icon: <LayoutGrid className="w-4 h-4" />,
      badge: `${tables.filter((t) => t.waiterCalled).length} Alerts`,
      tabTarget: 'staff',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'ai',
      stepNum: '06',
      title: 'Manager AI Engine',
      subtitle: 'Gemini Operational Insights',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Live Gemini AI',
      tabTarget: 'ai',
      color: 'from-purple-500 to-fuchsia-600',
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800 py-3 px-4 sm:px-6 overflow-x-auto">
      <div className="max-w-7xl mx-auto min-w-[760px] flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const isActive = activeTab === step.tabTarget && (idx === 0 || idx === 1 || idx === 2 ? activeTab === 'customer' : true);
          return (
            <React.Fragment key={step.id}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(step.tabTarget)}
                className={`flex-1 p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800/60 border-slate-800/80'
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} ${
                    isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'
                  }`}
                />

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    STEP {step.stepNum}
                  </span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {step.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-tr ${step.color} text-white shadow-sm`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 leading-tight">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              </motion.button>

              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

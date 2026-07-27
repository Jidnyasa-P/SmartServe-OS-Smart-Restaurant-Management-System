import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Clock, AlertTriangle, CheckCircle2, ArrowRight, Play, Flame, RefreshCw } from 'lucide-react';
import { OrderStatus } from '../../types';
import { TicketItem } from './PersistentOrderTicket';

interface KitchenPassSceneProps {
  orderStatus: OrderStatus | 'SCANNING' | 'SELECTING';
  onAdvanceStatus: (nextStatus: OrderStatus) => void;
  onOpenKitchenKds: () => void;
  ticketItems: TicketItem[];
}

export const KitchenPassScene: React.FC<KitchenPassSceneProps> = ({
  orderStatus,
  onAdvanceStatus,
  onOpenKitchenKds,
  ticketItems,
}) => {
  const isCooking = orderStatus === 'cooking' || orderStatus === 'accepted';
  const isReady = orderStatus === 'ready' || orderStatus === 'delivered' || orderStatus === 'paid';

  return (
    <div className="relative w-full min-h-[85vh] bg-[#D9DBD8] text-[#171714] border border-[#171714]/30 rounded-md p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Stainless Steel Grill Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D9DBD8] via-[#C8CAC6] to-[#D9DBD8] opacity-80 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#171714]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#171714] text-[#F4F0E8] rounded-xs">
            CHAPTER 03
          </span>
          <span className="font-mono text-xs tracking-widest text-[#171714]/70 uppercase">
            STAINLESS STEEL KITCHEN PASS • LIVE KDS KANBAN
          </span>
        </div>
        <button
          onClick={onOpenKitchenKds}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#171714] hover:bg-[#171714]/80 text-[#F4F0E8] font-bold text-xs rounded-xs border border-[#171714] transition-all shadow-sm"
        >
          <span>Open Kitchen KDS Board</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E7A23B]" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Copy & Interactive Status Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D84A3A]/10 text-[#D84A3A] border border-[#D84A3A]/30 text-xs font-bold rounded-xs font-mono">
            <Flame className="w-3.5 h-3.5" />
            <span>EXPRESS KITCHEN PASS DISPATCH</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight text-[#171714]">
            From ticket to grill. <br />
            <span className="italic">Piped in milliseconds.</span>
          </h2>

          <p className="text-sm text-[#171714]/80 font-sans leading-relaxed">
            When a diner places an order, the ticket lands on the chef station KDS board with zero staff latency. Timers track target prep windows, and line cooks check off items station-by-station.
          </p>

          {/* Interactive KDS State Control Buttons */}
          <div className="p-4 bg-[#F4F0E8] border border-[#171714]/30 rounded-xs space-y-3 shadow-md">
            <div className="font-mono text-xs font-bold text-[#171714] uppercase tracking-wider flex items-center justify-between">
              <span>Advance KDS Ticket State</span>
              <span className="text-[10px] text-[#1F6B4F]">LIVE KITCHEN PIPELINE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => onAdvanceStatus('accepted')}
                className={`p-2.5 rounded-xs border font-bold transition-all flex items-center justify-center gap-1.5 ${
                  orderStatus === 'accepted'
                    ? 'bg-[#E7A23B] text-[#171714] border-[#171714]'
                    : 'bg-[#D9DBD8] hover:bg-[#F4F0E8] text-[#171714] border-[#171714]/30'
                }`}
              >
                <span>1. ACCEPT</span>
              </button>

              <button
                onClick={() => onAdvanceStatus('cooking')}
                className={`p-2.5 rounded-xs border font-bold transition-all flex items-center justify-center gap-1.5 ${
                  orderStatus === 'cooking'
                    ? 'bg-[#D84A3A] text-[#F4F0E8] border-[#D84A3A]'
                    : 'bg-[#D9DBD8] hover:bg-[#F4F0E8] text-[#171714] border-[#171714]/30'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>2. COOKING</span>
              </button>

              <button
                onClick={() => onAdvanceStatus('ready')}
                className={`p-2.5 rounded-xs border font-bold transition-all flex items-center justify-center gap-1.5 col-span-2 ${
                  orderStatus === 'ready'
                    ? 'bg-[#1F6B4F] text-[#F4F0E8] border-[#1F6B4F]'
                    : 'bg-[#1F6B4F]/10 hover:bg-[#1F6B4F]/20 text-[#1F6B4F] border-[#1F6B4F]/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>3. MARK ORDER READY FOR FLOOR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right KDS Station Display Simulation */}
        <div className="lg:col-span-7">
          <div className="bg-[#171714] text-[#F4F0E8] border-2 border-[#171714] rounded-sm p-5 shadow-2xl space-y-4">
            {/* KDS Header Bar */}
            <div className="flex items-center justify-between border-b border-[#F4F0E8]/20 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#E7A23B]" />
                <span className="font-bold tracking-wider text-[#F4F0E8]">STATION 02 • MAIN GRILL & FRY</span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-[#E7A23B] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>PREP TIMER: 06:14</span>
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-[#D84A3A] text-white font-bold">
                  TARGET: 12:00 MIN
                </span>
              </div>
            </div>

            {/* KDS Active Ticket Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Table 04 Active KDS Ticket Card */}
              <div className="bg-[#F4F0E8] text-[#171714] p-4 rounded-xs border-2 border-[#E7A23B] space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#171714]/20 pb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#171714]/60">
                      TICKET #ORD-8042
                    </span>
                    <h4 className="font-serif text-2xl font-bold leading-none">
                      TABLE 04
                    </h4>
                  </div>
                  <span className="stamp-badge text-[#D84A3A] border-[#D84A3A]">
                    {orderStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {ticketItems.length === 0 ? (
                    <div className="text-[11px] text-[#171714]/50 italic py-2">
                      No dishes selected yet on menu...
                    </div>
                  ) : (
                    ticketItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-[#171714]/10 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-xs bg-[#171714] text-[#F4F0E8] flex items-center justify-center font-bold text-[10px]">
                            {item.qty}
                          </span>
                          <span className="font-bold">{item.name}</span>
                        </div>
                        <span className="text-[10px] bg-[#E7A23B]/30 px-1 text-[#171714] rounded-xs font-semibold">
                          {item.station || 'Grill'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-[#171714]/20 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#1F6B4F] font-bold">COOK: CHEF MARCO</span>
                  <span className="text-[#171714]/60">FIRE ORDER &rarr;</span>
                </div>
              </div>

              {/* Adjacent KDS Ticket (Station context) */}
              <div className="bg-[#EAE5D9]/80 text-[#171714]/80 p-4 rounded-xs border border-[#171714]/30 space-y-3 opacity-90">
                <div className="flex items-center justify-between border-b border-[#171714]/20 pb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#171714]/60">
                      TICKET #ORD-8041
                    </span>
                    <h4 className="font-serif text-2xl font-bold leading-none">
                      TABLE 02
                    </h4>
                  </div>
                  <span className="stamp-badge text-[#1F6B4F] border-[#1F6B4F]">
                    COOKING
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between border-b border-[#171714]/10 pb-1">
                    <span>2x Sea Salt Frites</span>
                    <span className="text-[10px] bg-[#171714]/10 px-1 rounded-xs">Fry</span>
                  </div>
                  <div className="flex justify-between border-b border-[#171714]/10 pb-1">
                    <span>1x Truffle Pasta</span>
                    <span className="text-[10px] bg-[#171714]/10 px-1 rounded-xs">Sauté</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#171714]/20 flex justify-between items-center text-[10px] font-mono">
                  <span>PREP TIME: 08:30</span>
                  <span className="text-[#1F6B4F] font-bold">IN QUEUE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Footer Note */}
      <div className="relative z-10 pt-4 border-t border-[#171714]/20 flex justify-between items-center text-xs font-mono text-[#171714]/70">
        <div>ADVANCE ORDER STATUS TO WATCH KITCHEN DISPATCH & SERVING ALERTS</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • STEP 03/06</div>
      </div>
    </div>
  );
};

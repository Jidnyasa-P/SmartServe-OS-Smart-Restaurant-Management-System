import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, MapPin, Navigation, Bell, CheckCircle2, ArrowRight, UserCheck, Utensils } from 'lucide-react';
import { OrderStatus } from '../../types';

interface FloorRouteSceneProps {
  orderStatus: OrderStatus | 'SCANNING' | 'SELECTING';
  onMarkServed: () => void;
  onOpenFloorMap: () => void;
}

export const FloorRouteScene: React.FC<FloorRouteSceneProps> = ({
  orderStatus,
  onMarkServed,
  onOpenFloorMap,
}) => {
  const isServed = orderStatus === 'served' || orderStatus === 'completed' || orderStatus === 'paid';

  return (
    <div className="relative w-full min-h-[85vh] bg-[#F4F0E8] text-[#171714] border border-[#171714]/20 rounded-md p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Architectural Blueprint Grid */}
      <div className="absolute inset-0 paper-pattern opacity-40 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#171714]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#171714] text-[#F4F0E8] rounded-xs">
            CHAPTER 04
          </span>
          <span className="font-mono text-xs tracking-widest text-[#171714]/60 uppercase">
            ARCHITECTURAL FLOOR MAP • FLOOR STAFF ROUTING
          </span>
        </div>
        <button
          onClick={onOpenFloorMap}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1F6B4F] hover:bg-[#1F6B4F]/80 text-[#F4F0E8] font-bold text-xs rounded-xs border border-[#171714] transition-all shadow-sm"
        >
          <span>Open Live Floor Staff Map</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E7A23B]" />
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Copy & Route Dispatch Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F6B4F]/10 text-[#1F6B4F] border border-[#1F6B4F]/30 text-xs font-bold rounded-xs font-mono">
            <Navigation className="w-3.5 h-3.5" />
            <span>EXPRESS SERVICE DISPATCH</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight text-[#171714]">
            Plates ready. <br />
            <span className="italic">Route calculated.</span>
          </h2>

          <p className="text-sm text-[#171714]/80 font-sans leading-relaxed">
            The moment Kitchen marks Table 04 ready, a visual alert triggers on floor staff watches and tablets. An architectural floor map draws the shortest route from the kitchen pass straight to Table 04.
          </p>

          {/* Interactive Action Card */}
          <div className="p-4 bg-[#EAE5D9] border border-[#171714]/20 rounded-xs space-y-3">
            <div className="font-mono text-xs font-bold text-[#171714] uppercase tracking-wider flex items-center justify-between">
              <span>Floor Staff Action</span>
              <span className="text-[10px] text-[#1F6B4F] font-bold">1-TAP CONFIRM</span>
            </div>

            <button
              onClick={onMarkServed}
              className={`w-full py-3 px-4 font-mono text-xs font-bold rounded-xs border transition-all flex items-center justify-center gap-2 ${
                isServed
                  ? 'bg-[#1F6B4F] text-[#F4F0E8] border-[#1F6B4F]'
                  : 'bg-[#171714] text-[#F4F0E8] hover:bg-[#E7A23B] hover:text-[#171714] border-[#171714]'
              }`}
            >
              {isServed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#F4F0E8]" />
                  <span>TABLE 04 SERVED & CONFIRMED</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-[#E7A23B]" />
                  <span>DISPATCH WAITER & MARK SERVED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Architectural Restaurant Floor Plan Graphic */}
        <div className="lg:col-span-7">
          <div className="bg-[#EAE5D9] border-2 border-[#171714] rounded-sm p-6 shadow-2xl relative space-y-4">
            {/* Architectural Grid Title */}
            <div className="flex items-center justify-between border-b border-[#171714]/20 pb-3 font-mono text-xs">
              <span className="font-bold tracking-widest uppercase text-[#171714]">
                MAIN DINING ROOM BLUEPRINT • STAGE 1
              </span>
              <span className="text-[10px] bg-[#171714] text-[#F4F0E8] px-2 py-0.5 rounded-xs font-bold">
                SCALE 1:50
              </span>
            </div>

            {/* Architectural Layout Map Container */}
            <div className="relative w-full h-80 bg-[#F4F0E8] border border-[#171714]/30 rounded-xs p-4 flex flex-col justify-between overflow-hidden">
              {/* Kitchen Pass Station Top Edge */}
              <div className="w-full bg-[#D9DBD8] border-2 border-[#171714] p-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 font-bold text-[#171714]">
                  <Utensils className="w-4 h-4 text-[#E7A23B]" />
                  <span>KITCHEN PASS (START)</span>
                </div>
                <span className="text-[10px] text-[#1F6B4F] font-bold">PASS RAIL #02</span>
              </div>

              {/* Floor Plan Tables Grid */}
              <div className="grid grid-cols-4 gap-4 my-auto relative z-10 font-mono text-xs">
                {/* Table 01 */}
                <div className="p-3 bg-[#EAE5D9]/60 border border-[#171714]/20 rounded-xs text-center">
                  <div className="font-bold text-[10px]">TBL 01</div>
                  <div className="text-[9px] text-[#1F6B4F]">Occupied</div>
                </div>

                {/* Table 02 */}
                <div className="p-3 bg-[#EAE5D9]/60 border border-[#171714]/20 rounded-xs text-center">
                  <div className="font-bold text-[10px]">TBL 02</div>
                  <div className="text-[9px] text-[#171714]/60">Cooking</div>
                </div>

                {/* Table 03 */}
                <div className="p-3 bg-[#EAE5D9]/60 border border-[#171714]/20 rounded-xs text-center">
                  <div className="font-bold text-[10px]">TBL 03</div>
                  <div className="text-[9px] text-[#1F6B4F]">Occupied</div>
                </div>

                {/* Table 04 - TARGET ALERT TABLE */}
                <motion.div
                  animate={isServed ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`p-3 rounded-xs text-center border-2 shadow-lg transition-all ${
                    isServed
                      ? 'bg-[#1F6B4F]/20 border-[#1F6B4F] text-[#1F6B4F]'
                      : 'bg-[#E7A23B]/30 border-[#D84A3A] text-[#171714]'
                  }`}
                >
                  <div className="font-extrabold text-xs flex items-center justify-center gap-1">
                    <span>TBL 04</span>
                    {!isServed && <Bell className="w-3 h-3 text-[#D84A3A] animate-bounce" />}
                  </div>
                  <div className="text-[10px] font-bold">
                    {isServed ? 'SERVED ✓' : 'READY TO SERVE'}
                  </div>
                </motion.div>
              </div>

              {/* Animated Staff Route Path Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <motion.path
                  d="M 120 40 L 120 180 L 320 180"
                  fill="none"
                  stroke={isServed ? '#1F6B4F' : '#E7A23B'}
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  animate={{ strokeDashoffset: [-24, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </svg>

              {/* Outdoor Patio Bottom Bar */}
              <div className="w-full bg-[#EAE5D9] border-t border-[#171714]/20 pt-1 flex justify-between text-[10px] font-mono text-[#171714]/60">
                <span>PATIO & BAR ROUTE</span>
                <span>TABLE SERVED IN 45 SEC AVERAGE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Footer Note */}
      <div className="relative z-10 pt-4 border-t border-[#171714]/20 flex justify-between items-center text-xs font-mono text-[#171714]/70">
        <div>MARK SERVED ABOVE TO FOLD TICKET INTO MANAGER ANALYTICS</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • STEP 04/06</div>
      </div>
    </div>
  );
};

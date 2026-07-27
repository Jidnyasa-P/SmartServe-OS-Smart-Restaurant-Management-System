import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Clock, CheckCircle2, AlertCircle, ChefHat, MapPin, Receipt, Sparkles } from 'lucide-react';
import { OrderStatus } from '../../types';

export interface TicketItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  notes?: string;
  station?: string;
}

interface PersistentOrderTicketProps {
  orderId?: string;
  tableNumber?: number;
  customerName?: string;
  status: OrderStatus | 'SCANNING' | 'SELECTING';
  items: TicketItem[];
  elapsedSeconds?: number;
  className?: string;
  compact?: boolean;
}

export const PersistentOrderTicket: React.FC<PersistentOrderTicketProps> = ({
  orderId = '#ORD-8042',
  tableNumber = 4,
  customerName = 'Table 04 • Guest',
  status = 'SCANNING',
  items = [],
  elapsedSeconds = 245,
  className = '',
  compact = false,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const getStatusBadge = () => {
    switch (status) {
      case 'SCANNING':
        return (
          <span className="stamp-badge text-[#171714] border-[#171714] bg-[#E7A23B]/30">
            QR DETECTED
          </span>
        );
      case 'SELECTING':
        return (
          <span className="stamp-badge text-[#171714] border-[#171714] bg-[#F4F0E8]">
            CHOOSING DISHES
          </span>
        );
      case 'pending':
        return (
          <span className="stamp-badge text-[#D84A3A] border-[#D84A3A] bg-[#D84A3A]/10">
            NEW ORDER
          </span>
        );
      case 'accepted':
        return (
          <span className="stamp-badge text-[#E7A23B] border-[#E7A23B] bg-[#E7A23B]/10">
            KITCHEN ACCEPTED
          </span>
        );
      case 'cooking':
        return (
          <span className="stamp-badge text-[#D84A3A] border-[#D84A3A] bg-[#D84A3A]/15 animate-pulse">
            ON THE LINE
          </span>
        );
      case 'ready':
        return (
          <span className="stamp-badge text-[#1F6B4F] border-[#1F6B4F] bg-[#1F6B4F]/10">
            READY TO SERVE
          </span>
        );
      case 'served':
        return (
          <span className="stamp-badge text-[#1F6B4F] border-[#1F6B4F] bg-[#1F6B4F]/20">
            SERVED TABLE 04
          </span>
        );
      case 'paid':
        return (
          <span className="stamp-badge text-[#171714] border-[#171714] bg-[#E7A23B]">
            PAID & CLOSED
          </span>
        );
      default:
        return (
          <span className="stamp-badge text-[#171714] border-[#171714]">
            IN SYSTEM
          </span>
        );
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full max-w-sm bg-[#F4F0E8] text-[#171714] border border-[#171714]/20 shadow-xl rounded-md font-sans overflow-hidden ${className}`}
    >
      {/* Top Receipt Serration */}
      <div className="h-2 w-full bg-[#171714]/10 border-b border-[#171714]/20 flex items-center justify-between px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#171714]/30" />
        <div className="text-[9px] font-mono tracking-widest text-[#171714]/60 uppercase">
          KITCHEN TICKET • SMARTSERVE OS
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#171714]/30" />
      </div>

      {/* Ticket Header */}
      <div className="p-4 border-b border-dashed border-[#171714]/30 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs font-bold tracking-wider text-[#171714]/60">
              {orderId}
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight text-[#171714]">
              Table {tableNumber.toString().padStart(2, '0')}
            </h3>
          </div>
          <div className="text-right">{getStatusBadge()}</div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#171714]/70 pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#171714]/60" />
            <span>{formatTime(elapsedSeconds)}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1F6B4F]" />
            <span>Main Dining Floor</span>
          </span>
        </div>
      </div>

      {/* Ticket Items List */}
      <div className="p-4 space-y-2 font-mono text-xs max-h-56 overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <div className="py-6 text-center text-[#171714]/50 border border-dashed border-[#171714]/20 rounded-sm">
            <Receipt className="w-5 h-5 mx-auto mb-1 text-[#171714]/40" />
            <p className="text-[11px] font-sans">Awaiting dish selection...</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start justify-between border-b border-[#171714]/10 pb-1.5 group"
            >
              <div className="space-y-0.5 max-w-[70%]">
                <div className="font-bold flex items-center gap-1.5 text-[#171714]">
                  <span className="px-1 bg-[#171714] text-[#F4F0E8] text-[10px] rounded-xs font-bold">
                    {item.qty}x
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                {item.notes && (
                  <div className="text-[10px] text-[#D84A3A] italic pl-5">
                    * {item.notes}
                  </div>
                )}
                {item.station && (
                  <div className="text-[9px] text-[#1F6B4F] uppercase tracking-wider pl-5 font-sans">
                    Station: {item.station}
                  </div>
                )}
              </div>
              <div className="font-bold text-[#171714]">
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Ticket Summary & Totals */}
      {items.length > 0 && (
        <div className="p-4 bg-[#EAE5D9]/60 border-t border-[#171714]/20 space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[#171714]/70">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#171714]/70">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#171714] pt-1.5 border-t border-[#171714]/30">
            <span className="font-serif text-base">Total Order</span>
            <span className="text-[#1F6B4F]">${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Ticket Footer Barcode & Timestamp */}
      <div className="p-3 bg-[#171714] text-[#F4F0E8] flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1 text-[#E7A23B]">
          <Sparkles className="w-3 h-3" />
          <span>SMARTSERVE OS LIVE PIPELINE</span>
        </div>
        <div className="tracking-widest opacity-70">
          ||||| ||| |||| || |||
        </div>
      </div>
    </motion.div>
  );
};

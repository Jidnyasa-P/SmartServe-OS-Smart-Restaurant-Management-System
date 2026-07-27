import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Plus, Check, Clock, ShieldAlert, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { TicketItem } from './PersistentOrderTicket';

interface MenuSelectionSceneProps {
  onSelectItem: (item: TicketItem) => void;
  selectedItems: TicketItem[];
  onOpenCustomerMenu: () => void;
}

const SAMPLE_DISHES: (TicketItem & {
  category: string;
  desc: string;
  prepTime: string;
  stockCount: number;
  dietary: string[];
  isAvailable: boolean;
})[] = [
  {
    id: 'm1',
    name: 'Truffle & Forest Mushroom Arancini',
    price: 18.0,
    qty: 1,
    station: 'Fry / Prep',
    category: 'STARTERS',
    desc: 'Crispy arborio rice spheres with wild truffle butter, melted mozzarella, and garlic aioli.',
    prepTime: '8 min',
    stockCount: 14,
    dietary: ['Vegetarian', 'Chef Favorite'],
    isAvailable: true,
  },
  {
    id: 'm2',
    name: 'Dry-Aged Wagyu Ribeye Steak (250g)',
    price: 46.0,
    qty: 1,
    station: 'Grill',
    category: 'MAINS',
    desc: '45-day dry-aged Australian Wagyu, charred bone marrow jus, roasted shallots, sea salt.',
    prepTime: '18 min',
    stockCount: 6,
    dietary: ['Gluten-Free', 'High Demand'],
    isAvailable: true,
  },
  {
    id: 'm3',
    name: 'Smoked Bourbon Old Fashioned',
    price: 16.5,
    qty: 1,
    station: 'Bar',
    category: 'BEVERAGES',
    desc: 'Small batch bourbon, smoked oak wood chips, Angostura bitters, orange peel.',
    prepTime: '4 min',
    stockCount: 22,
    dietary: ['Signature Cocktail'],
    isAvailable: true,
  },
  {
    id: 'm4',
    name: 'Artisanal Caviar Blinis',
    price: 65.0,
    qty: 1,
    station: 'Cold Prep',
    category: 'STARTERS',
    desc: 'Ossetra sturgeon caviar, house creme fraiche, chives on buckwheat blinis.',
    prepTime: '5 min',
    stockCount: 0,
    dietary: ['Sold Out (86)'],
    isAvailable: false,
  },
];

export const MenuSelectionScene: React.FC<MenuSelectionSceneProps> = ({
  onSelectItem,
  selectedItems,
  onOpenCustomerMenu,
}) => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#F4F0E8] text-[#171714] border border-[#171714]/20 rounded-md p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 paper-pattern opacity-40 pointer-events-none" />

      {/* Chapter Tag Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#171714]/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-1 bg-[#171714] text-[#F4F0E8] rounded-xs">
            CHAPTER 02
          </span>
          <span className="font-mono text-xs tracking-widest text-[#171714]/60 uppercase">
            LIVE CUSTOMER MENU • REAL-TIME 86 PROTECTION
          </span>
        </div>
        <button
          onClick={onOpenCustomerMenu}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#E7A23B] hover:bg-[#E7A23B]/80 text-[#171714] font-bold text-xs rounded-xs border border-[#171714] transition-all shadow-sm"
        >
          <span>Open Full Customer Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Copy & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F6B4F]/10 text-[#1F6B4F] border border-[#1F6B4F]/30 text-xs font-bold rounded-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL-TIME INVENTORY SYNC</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight text-[#171714]">
            Every dish counted. <br />
            <span className="italic">No sold-out surprises.</span>
          </h2>

          <p className="text-sm text-[#171714]/80 font-sans leading-relaxed">
            The customer views a live digital menu synced directly to kitchen inventory. If a dish is 86'd (sold out) in the kitchen, it instantly locks on the customer screen—preventing disappointed diners and refunded orders.
          </p>

          {/* Interactive instruction banner */}
          <div className="p-4 bg-[#EAE5D9] border-l-4 border-[#E7A23B] border-y border-r border-[#171714]/20 rounded-xs space-y-2">
            <div className="font-mono text-xs font-bold text-[#171714] uppercase tracking-wider flex items-center justify-between">
              <span>Interactive Story Action</span>
              <span className="text-[10px] text-[#E7A23B] font-bold">CLICK TO ADD DISH</span>
            </div>
            <p className="text-xs text-[#171714]/80 font-sans">
              Click any dish below to simulate customer selection and print items directly onto the persistent order ticket!
            </p>
          </div>
        </div>

        {/* Right Editorial Menu Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          {SAMPLE_DISHES.map((dish) => {
            const isSelected = selectedItems.some((i) => i.id === dish.id);

            return (
              <motion.div
                key={dish.id}
                whileHover={dish.isAvailable ? { scale: 1.01 } : {}}
                className={`p-4 rounded-xs border transition-all text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !dish.isAvailable
                    ? 'bg-[#EAE5D9]/40 border-[#D84A3A]/40 opacity-70 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#EAE5D9] border-[#1F6B4F] shadow-md ring-1 ring-[#1F6B4F]'
                    : 'bg-[#F4F0E8] border-[#171714]/20 hover:border-[#171714]'
                }`}
              >
                {/* Dish Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-[#171714] text-[#F4F0E8] px-1.5 py-0.5 rounded-xs">
                      {dish.category}
                    </span>

                    {dish.dietary.map((d, i) => (
                      <span
                        key={i}
                        className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-xs border ${
                          d.includes('Sold Out')
                            ? 'bg-[#D84A3A]/20 text-[#D84A3A] border-[#D84A3A]'
                            : 'bg-[#1F6B4F]/10 text-[#1F6B4F] border-[#1F6B4F]/30'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-serif text-xl font-bold text-[#171714] leading-tight">
                    {dish.name}
                  </h4>

                  <p className="text-xs text-[#171714]/70 font-sans line-clamp-2">
                    {dish.desc}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#171714]/70 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#171714]/50" />
                      <span>{dish.prepTime} prep</span>
                    </span>

                    {dish.isAvailable ? (
                      <span className="flex items-center gap-1 text-[#1F6B4F] font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{dish.stockCount} portions left</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#D84A3A] font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>86'd by Chef</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Add Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#171714]/10">
                  <div className="font-serif text-2xl font-bold text-[#171714]">
                    ${dish.price.toFixed(2)}
                  </div>

                  {dish.isAvailable ? (
                    <button
                      onClick={() => onSelectItem(dish)}
                      className={`px-3.5 py-2 font-mono text-xs font-bold rounded-xs border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#1F6B4F] text-[#F4F0E8] border-[#1F6B4F]'
                          : 'bg-[#171714] text-[#F4F0E8] hover:bg-[#E7A23B] hover:text-[#171714] border-[#171714]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Ticket</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Ticket</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-[#D84A3A]/10 text-[#D84A3A] font-mono text-xs font-bold border border-[#D84A3A]/30 rounded-xs">
                      UNAVAILABLE
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="relative z-10 pt-4 border-t border-[#171714]/20 flex justify-between items-center text-xs font-mono text-[#171714]/70">
        <div>SELECT DISHES ABOVE TO WATCH TICKET POPULATE IN REAL TIME</div>
        <div className="text-[#E7A23B] font-bold">SMARTSERVE OS • STEP 02/06</div>
      </div>
    </div>
  );
};

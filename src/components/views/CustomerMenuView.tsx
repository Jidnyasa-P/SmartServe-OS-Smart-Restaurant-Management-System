import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem, Order } from '../../types';
import {
  QrCode,
  ShoppingBag,
  Clock,
  Flame,
  Leaf,
  Plus,
  Minus,
  Trash2,
  Bell,
  CheckCircle2,
  UtensilsCrossed,
  X,
  Sparkles,
  ArrowRight,
  Search,
  Key,
  ChefHat,
  MessageSquare,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerMenuView: React.FC = () => {
  const {
    menuItems,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    orders,
    selectedTableNumber,
    setSelectedTableNumber,
    callWaiter,
    tables,
    restaurant,
    activePlacedOrder,
    setActivePlacedOrder,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterDietary, setFilterDietary] = useState<{ vegan?: boolean; gf?: boolean; spicy?: boolean }>({});
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [itemNoteInput, setItemNoteInput] = useState<string>('');
  const [itemQuantityInput, setItemQuantityInput] = useState<number>(1);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [tokenVerified, setTokenVerified] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Parse table token from URL query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      const matchTable = tables.find((t) => t.qrToken === urlToken);
      if (matchTable) {
        setSelectedTableNumber(matchTable.number);
        setTokenVerified(true);
      } else {
        setTokenError('QR token expired or invalid table link.');
      }
    } else {
      setTokenVerified(true);
    }
  }, [tables, setSelectedTableNumber]);

  const activeTableInfo = tables.find((t) => t.number === selectedTableNumber);
  const currentToken = activeTableInfo?.qrToken || `tbl_tok_0${selectedTableNumber}_safe`;

  // Filtered public dishes (only available or visible dishes)
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesCat || !matchesQuery) return false;
    if (filterDietary.vegan && !item.isVegan) return false;
    if (filterDietary.gf && !item.isGF) return false;
    if (filterDietary.spicy && !item.isSpicy) return false;
    return true;
  });

  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const totalItemsCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  // Active order for this table
  const currentTableOrder =
    activePlacedOrder ||
    orders.find((o) => o.tableNumber === selectedTableNumber && o.status !== 'completed');

  const handleOpenItemModal = (item: MenuItem) => {
    setSelectedItemForModal(item);
    setItemQuantityInput(1);
    setItemNoteInput('');
  };

  const handleAddItemFromModal = () => {
    if (!selectedItemForModal || !selectedItemForModal.isAvailable) return;
    for (let i = 0; i < itemQuantityInput; i++) {
      addToCart(selectedItemForModal, itemNoteInput);
    }
    setSelectedItemForModal(null);
  };

  const handleCheckoutAndSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmittingOrder(true);
    try {
      const newOrder = await placeOrder(selectedTableNumber, customerName);
      setActivePlacedOrder(newOrder);
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: QR Session Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live QR Token Session Active
              </span>
              <span className="text-xs text-amber-400 font-mono bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
                <Key className="w-3 h-3" /> {currentToken}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Table #{selectedTableNumber} Digital Dining & Menu
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {restaurant.name} • {restaurant.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Table Selector */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-2xl">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-300">Table:</span>
              <select
                value={selectedTableNumber}
                onChange={(e) => {
                  setSelectedTableNumber(Number(e.target.value));
                  setActivePlacedOrder(null);
                }}
                className="bg-slate-900 text-amber-300 text-xs font-extrabold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
              >
                {tables.map((tbl) => (
                  <option key={tbl.id} value={tbl.number}>
                    Table #{tbl.number} ({tbl.capacity} Seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Call Waiter Button */}
            <button
              onClick={() => callWaiter(selectedTableNumber)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg ${
                activeTableInfo?.waiterCalled
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>
                {activeTableInfo?.waiterCalled ? 'Waiter Alerted!' : 'Call Waiter'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Token Error Warning if any */}
      {tokenError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{tokenError}</span>
          </div>
          <button
            onClick={() => setTokenError(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* ORDER CONFIRMATION & LIVE TRACKING SCREEN (If active order placed) */}
      {currentTableOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 text-slate-100 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-amber-400">
                    Order #{currentTableOrder.id}
                  </h3>
                  <span className="uppercase text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentTableOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Table #{currentTableOrder.tableNumber} • Guest: {currentTableOrder.customerName || 'Diner'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
              <Timer className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Estimated Kitchen Prep
                </div>
                <div className="text-base font-black text-white">
                  ~{currentTableOrder.estimatedPrepTime} Minutes Remaining
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-slate-300">
              <span>Kitchen Order Progress</span>
              <span className="text-amber-400">
                Status: {currentTableOrder.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              {[
                { status: 'pending', label: 'Received' },
                { status: 'cooking', label: 'Cooking' },
                { status: 'ready', label: 'Ready' },
                { status: 'served', label: 'Served' },
              ].map((step, idx) => {
                const stepOrder = ['pending', 'cooking', 'ready', 'served', 'completed'];
                const currentIdx = stepOrder.indexOf(currentTableOrder.status);
                const isPassed = idx <= currentIdx;

                return (
                  <div key={step.status} className="space-y-1.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isPassed
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-md shadow-amber-500/30'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-extrabold uppercase ${
                        isPassed ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary Breakdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Ordered Dish Breakdown ({currentTableOrder.items.length} Items)
            </h4>
            <div className="divide-y divide-slate-800/60">
              {currentTableOrder.items.map((it) => (
                <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">
                      {it.quantity}x {it.name}
                    </span>
                    {it.notes && (
                      <p className="text-[11px] text-amber-400/80 italic mt-0.5">
                        Note: "{it.notes}"
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-amber-300">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-black text-white">
              <span>Server-Verified Total Amount:</span>
              <span className="text-amber-400 text-base font-extrabold">
                ${currentTableOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setActivePlacedOrder(null)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              Order Additional Items
            </button>

            <button
              onClick={() => callWaiter(selectedTableNumber)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Bell className="w-4 h-4" />
              <span>Call Waiter to Table #{selectedTableNumber}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* SEARCH, CATEGORIES & DIETARY FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                  activeCategory === cat.name
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setFilterDietary((p) => ({ ...p, vegan: !p.vegan }))}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              filterDietary.vegan
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vegan 🌱</span>
          </button>

          <button
            onClick={() => setFilterDietary((p) => ({ ...p, gf: !p.gf }))}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              filterDietary.gf
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Gluten-Free 🌾</span>
          </button>

          <button
            onClick={() => setFilterDietary((p) => ({ ...p, spicy: !p.spicy }))}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              filterDietary.spicy
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Spicy 🌶️</span>
          </button>
        </div>
      </div>

      {/* DISHES MENU GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const inCart = cart.find((c) => c.menuItem.id === item.id);
          return (
            <motion.div
              layout
              key={item.id}
              className={`bg-slate-900 rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                item.isAvailable
                  ? 'border-slate-800 hover:border-slate-700 shadow-xl'
                  : 'border-rose-950/40 opacity-60 bg-slate-950/40'
              }`}
            >
              <div>
                {/* Food Image */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                      !item.isAvailable ? 'grayscale opacity-50' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {!item.isAvailable ? (
                      <span className="bg-rose-500/90 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full border border-rose-400 shadow-md animate-pulse">
                        86 OUT OF STOCK
                      </span>
                    ) : item.stockCount <= 5 ? (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        ONLY {item.stockCount} LEFT
                      </span>
                    ) : (
                      <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full border border-slate-700">
                        FRESH & READY
                      </span>
                    )}
                  </div>

                  {/* Prep Time */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>~{item.prepTimeMinutes}m</span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-amber-400 font-black text-base">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-base text-slate-100">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 pt-2 text-[10px] font-bold">
                    {item.isVegan && (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        🌱 Vegan
                      </span>
                    )}
                    {item.isGF && (
                      <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        Gluten-Free
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        🌶️ Spicy
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                {inCart ? (
                  <div className="flex items-center justify-between bg-slate-950 rounded-2xl p-2 border border-slate-800">
                    <button
                      onClick={() => updateCartQuantity(item.id, inCart.quantity - 1)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-xs text-amber-300">
                      {inCart.quantity} In Cart
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!item.isAvailable}
                    onClick={() => handleOpenItemModal(item)}
                    className={`w-full py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      item.isAvailable
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{item.isAvailable ? 'Add Dish to Order' : 'Sold Out (86)'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-xl z-30"
          >
            <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 text-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  {totalItemsCount}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400">
                    Table #{selectedTableNumber} Subtotal
                  </div>
                  <div className="text-lg font-black text-amber-300">
                    ${cartTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <span>View Cart & Confirm Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: ITEM DETAIL & SPECIAL NOTES */}
      <AnimatePresence>
        {selectedItemForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={selectedItemForModal.imageUrl}
                  alt={selectedItemForModal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="absolute top-3 right-3 p-1.5 bg-slate-950/80 rounded-full text-white"
                >
                  ✕
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white">
                    {selectedItemForModal.name}
                  </h3>
                  <span className="text-amber-400 font-black text-base">
                    ${selectedItemForModal.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedItemForModal.description}
                </p>
              </div>

              {/* Special Notes Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Special Kitchen Instructions / Allergies</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra sauce, no butter, gluten alert..."
                  value={itemNoteInput}
                  onChange={(e) => setItemNoteInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quantity Select */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-300">Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setItemQuantityInput(Math.max(1, itemQuantityInput - 1))}
                    className="p-1 rounded bg-slate-800 text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-xs text-amber-300">
                    {itemQuantityInput}
                  </span>
                  <button
                    onClick={() => setItemQuantityInput(itemQuantityInput + 1)}
                    className="p-1 rounded bg-slate-800 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddItemFromModal}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
              >
                Add {itemQuantityInput}x to Cart ($
                {(selectedItemForModal.price * itemQuantityInput).toFixed(2)})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between text-slate-100 shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    <h2 className="font-extrabold text-lg">Table #{selectedTableNumber} Cart</h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Diner Name (Optional for Kitchen Ticket)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Alex (Table 4 Guest)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-100">
                              {item.menuItem.name}
                            </div>
                            <div className="text-[11px] text-amber-300 font-black">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.menuItem.id, item.quantity - 1)
                            }
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.menuItem.id, item.quantity + 1)
                            }
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-amber-400/90 italic bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                          Special Note: "{item.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & Submit Button */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Menu Items Subtotal</span>
                    <span className="text-slate-200">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax & Service (8%)</span>
                    <span className="text-slate-200">
                      ${(cartTotal * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-100 pt-2 border-t border-slate-800">
                    <span>Total Amount</span>
                    <span className="text-amber-300 font-black text-base">
                      ${(cartTotal * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isSubmittingOrder}
                  onClick={handleCheckoutAndSubmit}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmittingOrder
                      ? 'Validating Order on Server...'
                      : 'Place Order & Send to Kitchen KDS'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

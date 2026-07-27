import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Power,
  Search,
  Check,
  AlertCircle,
  Tag,
  Clock,
  DollarSign,
  PackageCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { menuItemSchema, menuCategorySchema } from '../../lib/schemas';
import { MenuItem, MenuCategory } from '../../types';

export const MenuManagementView: React.FC = () => {
  const {
    categories,
    menuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleDishAvailability,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'dishes' | 'categories'>('dishes');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Form state
  const [isDishModalOpen, setIsDishModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [dishFormData, setDishFormData] = useState({
    name: '',
    description: '',
    category: 'mains',
    price: 18.0,
    imageUrl: '',
    prepTimeMinutes: 12,
    stockCount: 20,
    isSpicy: false,
    isVegan: false,
    isGF: false,
    calories: 450,
  });
  const [dishFormErrors, setDishFormErrors] = useState<Record<string, string>>({});

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    label: '',
    description: '',
    displayOrder: 1,
    isActive: true,
  });
  const [catFormErrors, setCatFormErrors] = useState<Record<string, string>>({});

  // Filtered dishes
  const filteredDishes = menuItems.filter((item) => {
    const matchesCat = selectedCatFilter === 'all' || item.category === selectedCatFilter;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Open Dish Form
  const handleOpenDishModal = (dish?: MenuItem) => {
    setDishFormErrors({});
    if (dish) {
      setEditingDish(dish);
      setDishFormData({
        name: dish.name,
        description: dish.description,
        category: dish.category,
        price: dish.price,
        imageUrl: dish.imageUrl,
        prepTimeMinutes: dish.prepTimeMinutes,
        stockCount: dish.stockCount,
        isSpicy: dish.isSpicy || false,
        isVegan: dish.isVegan || false,
        isGF: dish.isGF || false,
        calories: dish.calories || 400,
      });
    } else {
      setEditingDish(null);
      setDishFormData({
        name: '',
        description: '',
        category: categories[0]?.name || 'mains',
        price: 18.0,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        prepTimeMinutes: 12,
        stockCount: 20,
        isSpicy: false,
        isVegan: false,
        isGF: false,
        calories: 450,
      });
    }
    setIsDishModalOpen(true);
  };

  // Submit Dish Form with Zod
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    setDishFormErrors({});

    const parseResult = menuItemSchema.safeParse({
      name: dishFormData.name,
      description: dishFormData.description,
      category: dishFormData.category,
      price: Number(dishFormData.price),
      imageUrl: dishFormData.imageUrl,
      isAvailable: dishFormData.stockCount > 0,
      prepTimeMinutes: Number(dishFormData.prepTimeMinutes),
      stockCount: Number(dishFormData.stockCount),
      isSpicy: dishFormData.isSpicy,
      isVegan: dishFormData.isVegan,
      isGF: dishFormData.isGF,
      calories: Number(dishFormData.calories),
    });

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setDishFormErrors(fieldErrors);
      return;
    }

    if (editingDish) {
      updateMenuItem(editingDish.id, {
        ...parseResult.data,
        isAvailable: parseResult.data.stockCount > 0,
      });
    } else {
      addMenuItem({
        ...parseResult.data,
        isAvailable: parseResult.data.stockCount > 0,
      });
    }

    setIsDishModalOpen(false);
  };

  // Open Category Form
  const handleOpenCatModal = (cat?: MenuCategory) => {
    setCatFormErrors({});
    if (cat) {
      setEditingCat(cat);
      setCatFormData({
        name: cat.name,
        label: cat.label,
        description: cat.description || '',
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      });
    } else {
      setEditingCat(null);
      setCatFormData({
        name: '',
        label: '',
        description: '',
        displayOrder: categories.length + 1,
        isActive: true,
      });
    }
    setIsCategoryModalOpen(true);
  };

  // Save Category with Zod
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatFormErrors({});

    const catName = catFormData.name || catFormData.label.toLowerCase().replace(/\s+/g, '_');

    const parseResult = menuCategorySchema.safeParse({
      name: catName,
      label: catFormData.label,
      description: catFormData.description,
      displayOrder: Number(catFormData.displayOrder),
      isActive: catFormData.isActive,
    });

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setCatFormErrors(fieldErrors);
      return;
    }

    if (editingCat) {
      updateCategory(editingCat.id, parseResult.data);
    } else {
      addCategory(parseResult.data);
    }

    setIsCategoryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
            <UtensilsCrossed className="w-4 h-4" />
            <span>SmartServe Menu Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Menu & Category Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage live dishes, 86 availability, category display hierarchy & Zod-validated pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('dishes')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'dishes'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes ({menuItems.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* DISHES TAB CONTENT */}
      {activeSubTab === 'dishes' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Category Filter Pills */}
              <button
                onClick={() => setSelectedCatFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCatFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Dishes
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCatFilter(c.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCatFilter === c.name
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes or ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => handleOpenDishModal()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                className={`bg-slate-900 border rounded-3xl p-4 overflow-hidden relative flex flex-col justify-between transition-all ${
                  dish.isAvailable
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-rose-950/60 bg-slate-900/60 opacity-80'
                }`}
              >
                {/* Image & Badges */}
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                        !dish.isAvailable ? 'grayscale opacity-60' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-500/20">
                      {categories.find((c) => c.name === dish.category)?.label || dish.category}
                    </span>

                    {/* Live 86 Availability Badge */}
                    <div className="absolute top-3 right-3">
                      {dish.isAvailable ? (
                        <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>AVAILABLE ({dish.stockCount})</span>
                        </span>
                      ) : (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          <span>86 SOLD OUT</span>
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-amber-400 font-black text-sm">
                      ${dish.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-slate-100 text-base leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{dish.prepTimeMinutes} mins</span>
                    </span>
                    {dish.isSpicy && (
                      <span className="bg-rose-950/60 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-800/40">
                        🌶️ Spicy
                      </span>
                    )}
                    {dish.isVegan && (
                      <span className="bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                        🌱 Vegan
                      </span>
                    )}
                    {dish.isGF && (
                      <span className="bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-800/40">
                        🌾 Gluten-Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleDishAvailability(dish.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                      dish.isAvailable
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{dish.isAvailable ? 'Toggle 86 (Out of Stock)' : 'Re-enable Dish'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenDishModal(dish)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
                    title="Edit Dish"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteMenuItem(dish.id)}
                    className="p-2 bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition-all"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB CONTENT */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-100">Configured Menu Categories</h3>
            <button
              onClick={() => handleOpenCatModal()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-500/10 text-amber-400 font-black text-xs rounded-lg flex items-center justify-center border border-amber-500/20">
                      #{cat.displayOrder}
                    </span>
                    <h4 className="font-extrabold text-base text-white">{cat.label}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      cat.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    System Key: <span className="text-amber-300">{cat.name}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCatModal(cat)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DISH (Zod validated) */}
      <AnimatePresence>
        {isDishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl my-8 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-lg">
                  {editingDish ? 'Edit Dish' : 'Create New Menu Dish'}
                </h3>
                <button
                  onClick={() => setIsDishModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-4">
                {/* Dish Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    value={dishFormData.name}
                    onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Charred Octopus Tapas"
                  />
                  {dishFormErrors.name && (
                    <p className="text-[11px] text-rose-400 font-bold mt-1">
                      {dishFormErrors.name}
                    </p>
                  )}
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={dishFormData.category}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, category: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Price ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      value={dishFormData.price}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, price: Number(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    {dishFormErrors.price && (
                      <p className="text-[11px] text-rose-400 font-bold mt-1">
                        {dishFormErrors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Description & Ingredients *
                  </label>
                  <textarea
                    rows={2}
                    value={dishFormData.description}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, description: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Fresh ingredients, prep style, allergens..."
                  />
                  {dishFormErrors.description && (
                    <p className="text-[11px] text-rose-400 font-bold mt-1">
                      {dishFormErrors.description}
                    </p>
                  )}
                </div>

                {/* Prep Time & Initial Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Prep Time (Minutes)
                    </label>
                    <input
                      type="number"
                      value={dishFormData.prepTimeMinutes}
                      onChange={(e) =>
                        setDishFormData({
                          ...dishFormData,
                          prepTimeMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Current Stock Count
                    </label>
                    <input
                      type="number"
                      value={dishFormData.stockCount}
                      onChange={(e) =>
                        setDishFormData({
                          ...dishFormData,
                          stockCount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Image Unsplash URL
                  </label>
                  <input
                    type="text"
                    value={dishFormData.imageUrl}
                    onChange={(e) =>
                      setDishFormData({ ...dishFormData, imageUrl: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                {/* Dietary Tags */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishFormData.isSpicy}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, isSpicy: e.target.checked })
                      }
                      className="rounded accent-amber-500"
                    />
                    <span>🌶️ Spicy</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishFormData.isVegan}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, isVegan: e.target.checked })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span>🌱 Vegan</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishFormData.isGF}
                      onChange={(e) =>
                        setDishFormData({ ...dishFormData, isGF: e.target.checked })
                      }
                      className="rounded accent-amber-500"
                    />
                    <span>🌾 Gluten-Free</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDishModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                  >
                    Save Dish (Zod Validated)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT CATEGORY */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-lg">
                  {editingCat ? 'Edit Category' : 'New Menu Category'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Display Title / Label *
                  </label>
                  <input
                    type="text"
                    value={catFormData.label}
                    onChange={(e) => setCatFormData({ ...catFormData, label: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Chef Signature Mains"
                  />
                  {catFormErrors.label && (
                    <p className="text-[11px] text-rose-400 font-bold mt-1">
                      {catFormErrors.label}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={catFormData.description}
                    onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    placeholder="Brief summary shown on customer QR menu..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      value={catFormData.displayOrder}
                      onChange={(e) =>
                        setCatFormData({ ...catFormData, displayOrder: Number(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={catFormData.isActive}
                        onChange={(e) =>
                          setCatFormData({ ...catFormData, isActive: e.target.checked })
                        }
                        className="rounded accent-amber-500"
                      />
                      <span>Active Category</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

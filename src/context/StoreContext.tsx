import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Restaurant,
  RestaurantTable,
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  InventoryItem,
  AuditLog,
  AIInsight,
  Notification,
  CartItem,
} from '../types';
import {
  INITIAL_RESTAURANT,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_AUDIT_LOGS,
  INITIAL_AI_INSIGHTS,
} from '../mockData';
import { auth, db, signOut, onAuthStateChanged, doc, getDoc } from '../lib/firebase';

interface StoreContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => Promise<void>;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurant: Restaurant;
  tables: RestaurantTable[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  inventory: InventoryItem[];
  auditLogs: AuditLog[];
  aiInsights: AIInsight[];
  notifications: Notification[];
  cart: CartItem[];
  selectedTableNumber: number;
  setSelectedTableNumber: (num: number) => void;
  isGeneratingAi: boolean;
  isSimulatingOrders: boolean;
  setIsSimulatingOrders: (sim: boolean) => void;
  activePlacedOrder: Order | null;
  setActivePlacedOrder: (order: Order | null) => void;

  // Actions
  addToCart: (item: MenuItem, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (tableNum?: number, customerName?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markOrderPaid: (orderId: string, paymentMethod?: 'cash' | 'card' | 'qr_pay') => void;
  callWaiter: (tableNum: number) => void;
  dismissWaiterCall: (tableNum: number) => void;
  toggleDishAvailability: (itemId: string) => void;
  updateInventoryQuantity: (itemId: string, newQty: number) => void;
  
  // Menu & Category Management
  addCategory: (cat: Omit<MenuCategory, 'id'>) => void;
  updateCategory: (id: string, data: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Table & QR Management
  addTable: (tbl: Omit<RestaurantTable, 'id' | 'qrToken' | 'waiterCalled'>) => void;
  updateTable: (id: string, data: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  regenerateTableQrToken: (tableId: string) => string;

  // System & AI
  generateAiInsights: () => Promise<void>;
  askAiQuestion: (question: string) => Promise<string>;
  addAuditLog: (action: string, resource: string, status: 'success' | 'blocked' | 'warning', details?: string) => void;
  markNotificationRead: (id: string) => void;
  updateRestaurant: (data: Partial<Restaurant>) => void;
  simulateCustomerOrder: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('manager');
  const [activeTab, setActiveTab] = useState<string>('journey');

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const prof: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: data.fullName || firebaseUser.displayName || 'Authenticated User',
              role: (data.role as UserRole) || 'manager',
              restaurantId: 'rest-01',
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUserProfile(prof);
            setCurrentRole(prof.role);
          } else {
            const prof: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Authenticated User',
              role: 'manager',
              restaurantId: 'rest-01',
              createdAt: new Date().toISOString(),
            };
            setUserProfile(prof);
          }
        } catch (e) {
          console.warn('Firebase user profile fetch error:', e);
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  const [restaurant, setRestaurant] = useState<Restaurant>(() => {
    const saved = localStorage.getItem('smartserve_restaurant');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT;
  });
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem('smartserve_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('smartserve_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('smartserve_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smartserve_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('smartserve_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('smartserve_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Table 2 Waiter Call',
      message: 'Guest requested water & extra napkins.',
      type: 'waiter',
      timestamp: '2 mins ago',
      read: false,
      tableNumber: 2,
    },
    {
      id: 'notif-2',
      title: 'Order #ord-103 Ready',
      message: 'Kitchen marked Table 4 order ready to serve!',
      type: 'kitchen',
      timestamp: 'Just now',
      read: false,
      tableNumber: 4,
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(4);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isSimulatingOrders, setIsSimulatingOrders] = useState<boolean>(true);
  const [activePlacedOrder, setActivePlacedOrder] = useState<Order | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('smartserve_restaurant', JSON.stringify(restaurant));
    localStorage.setItem('smartserve_categories', JSON.stringify(categories));
    localStorage.setItem('smartserve_tables', JSON.stringify(tables));
    localStorage.setItem('smartserve_menu', JSON.stringify(menuItems));
    localStorage.setItem('smartserve_orders', JSON.stringify(orders));
    localStorage.setItem('smartserve_inventory', JSON.stringify(inventory));
    localStorage.setItem('smartserve_audit_logs', JSON.stringify(auditLogs));
  }, [restaurant, categories, tables, menuItems, orders, inventory, auditLogs]);

  const addAuditLog = (
    action: string,
    resource: string,
    status: 'success' | 'blocked' | 'warning',
    details?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: `user-${currentRole}`,
      userRole: currentRole,
      userName: `${currentRole.toUpperCase()} Active Session`,
      action,
      resource,
      ipAddress: '127.0.0.1 (Container Proxy)',
      status,
      details: details || `Operation requested by ${currentRole}`,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Category Management
  const addCategory = (cat: Omit<MenuCategory, 'id'>) => {
    const newCat: MenuCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog('CREATE_CATEGORY', `Category: ${cat.label}`, 'success', 'Created new menu category.');
  };

  const updateCategory = (id: string, data: Partial<MenuCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id || c.name === id ? { ...c, ...data } : c))
    );
    addAuditLog('UPDATE_CATEGORY', `Category ID: ${id}`, 'success', 'Updated menu category parameters.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.name !== id));
    addAuditLog('DELETE_CATEGORY', `Category ID: ${id}`, 'success', 'Deleted menu category.');
  };

  // Menu Item Management
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
    addAuditLog('CREATE_MENU_ITEM', `Dish: ${item.name}`, 'success', 'Created new dish menu item.');
  };

  const updateMenuItem = (id: string, data: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    addAuditLog('UPDATE_MENU_ITEM', `Dish ID: ${id}`, 'success', 'Updated dish attributes.');
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('DELETE_MENU_ITEM', `Dish ID: ${id}`, 'success', 'Removed dish item from menu.');
  };

  // Table & QR Management
  const addTable = (tbl: Omit<RestaurantTable, 'id' | 'qrToken' | 'waiterCalled'>) => {
    const newTable: RestaurantTable = {
      ...tbl,
      id: `tbl-${Date.now()}`,
      waiterCalled: false,
      qrToken: `tbl_tok_${tbl.number.toString().padStart(2, '0')}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setTables((prev) => [...prev, newTable]);
    addAuditLog('CREATE_TABLE', `Table #${tbl.number}`, 'success', 'Added new restaurant table with QR token.');
  };

  const updateTable = (id: string, data: Partial<RestaurantTable>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id || t.number === Number(id) ? { ...t, ...data } : t))
    );
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id && t.number !== Number(id)));
    addAuditLog('DELETE_TABLE', `Table ID: ${id}`, 'success', 'Removed table from restaurant matrix.');
  };

  const regenerateTableQrToken = (tableId: string): string => {
    const newToken = `tbl_tok_${Math.random().toString(36).substring(2, 8)}`;
    setTables((prev) =>
      prev.map((t) => (t.id === tableId || t.number === Number(tableId) ? { ...t, qrToken: newToken } : t))
    );
    addAuditLog('REGENERATE_QR_TOKEN', `Table ID: ${tableId}`, 'success', 'Issued new secure QR table access token.');
    return newToken;
  };

  // Cart Management
  const addToCart = (item: MenuItem, notes?: string) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      }
      return [...prev, { menuItem: item, quantity: 1, notes }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity: qty } : c))
    );
  };

  const clearCart = () => setCart([]);

  // Place Order with Backend Transaction, QR Token & Server Price Enforcement
  const placeOrder = async (tableNum?: number, customerName?: string): Promise<Order> => {
    const targetTableNum = tableNum || selectedTableNumber;
    const currentTable = tables.find((t) => t.number === targetTableNum);

    // Default sample QR token for table 4 if missing in client memory
    const rawQrToken = currentTable?.qrToken || 'raw_token_table_4_secret_key_5c4b3a2f1e0d9c8b7a6f5e4d3c';

    const payload = {
      tableNumber: targetTableNum,
      qrToken: rawQrToken,
      customerName: customerName || `Table ${targetTableNum} Guest`,
      items: cart.map((c) => ({
        id: c.menuItem.id,
        quantity: c.quantity,
        notes: c.notes,
      })),
    };

    // Post to backend Express server endpoint for Zod validation, token verification & transaction
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : 'Server order placement failed.');
      addAuditLog(
        'ORDER_REJECTED',
        `Table #${targetTableNum}`,
        'blocked',
        `Server rejected order placement: ${errorMsg}`
      );
      throw new Error(errorMsg);
    }

    const verifiedOrder: Order = data.order;

    // Update client UI state
    setOrders((prev) => [verifiedOrder, ...prev]);
    setActivePlacedOrder(verifiedOrder);

    // Update table state
    setTables((prev) =>
      prev.map((t) =>
        t.number === targetTableNum
          ? {
              ...t,
              status: 'occupied',
              currentOrderId: verifiedOrder.id,
              guestsCount: (t.guestsCount || 0) + 1,
            }
          : t
      )
    );

    // Deduct client menu stock count
    setMenuItems((prev) =>
      prev.map((m) => {
        const cartMatch = cart.find((c) => c.menuItem.id === m.id);
        if (cartMatch) {
          const newStock = Math.max(0, m.stockCount - cartMatch.quantity);
          return { ...m, stockCount: newStock, isAvailable: newStock > 0 };
        }
        return m;
      })
    );

    addNotification({
      title: `Order #${verifiedOrder.id} Verified!`,
      message: `Table ${targetTableNum} order placed ($${verifiedOrder.totalAmount.toFixed(2)}).`,
      type: 'order',
      tableNumber: targetTableNum,
    });

    addAuditLog(
      'SERVER_VERIFIED_ORDER',
      `Table #${targetTableNum} Order #${verifiedOrder.id}`,
      'success',
      `Server Firestore transaction succeeded. QR token verified & canonical dish prices enforced. Total: $${verifiedOrder.totalAmount.toFixed(2)}.`
    );

    clearCart();
    return verifiedOrder;
  };

  // Order Status Updates (Kitchen / Staff)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status, updatedAt: new Date().toISOString() };
          if (activePlacedOrder && activePlacedOrder.id === orderId) {
            setActivePlacedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addAuditLog(
        'UPDATE_ORDER_STATUS',
        `Order #${orderId} -> ${status.toUpperCase()}`,
        'success',
        `Status updated by ${currentRole}.`
      );

      if (status === 'ready') {
        addNotification({
          title: `Kitchen Order Ready!`,
          message: `Order #${orderId} for Table ${targetOrder.tableNumber} is ready for pickup!`,
          type: 'kitchen',
          tableNumber: targetOrder.tableNumber,
        });
      }
    }
  };

  const markOrderPaid = (
    orderId: string,
    paymentMethod: 'cash' | 'card' | 'qr_pay' = 'card'
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              paymentStatus: 'paid',
              paymentMethod,
              status: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setTables((prev) =>
        prev.map((t) =>
          t.number === targetOrder.tableNumber
            ? { ...t, status: 'needs_cleaning', currentOrderId: undefined }
            : t
        )
      );

      addAuditLog(
        'PROCESS_PAYMENT',
        `Order #${orderId} ($${targetOrder.totalAmount.toFixed(2)})`,
        'success',
        `Payment finalized via ${paymentMethod.toUpperCase()}. Table set to needs_cleaning.`
      );
    }
  };

  // Waiter Assistance Calls
  const callWaiter = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.number === tableNum
          ? { ...t, waiterCalled: true, waiterCallTime: 'Just now' }
          : t
      )
    );

    addNotification({
      title: `Table ${tableNum} Needs Assistance`,
      message: `Guest at Table ${tableNum} pressed Call Waiter on QR portal.`,
      type: 'waiter',
      tableNumber: tableNum,
    });

    addAuditLog(
      'WAITER_CALL',
      `Table #${tableNum}`,
      'success',
      'Assistance signal sent to floor staff.'
    );
  };

  const dismissWaiterCall = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.number === tableNum ? { ...t, waiterCalled: false } : t
      )
    );

    addAuditLog(
      'CLEAR_WAITER_ALERT',
      `Table #${tableNum}`,
      'success',
      'Floor staff responded to waiter alert.'
    );
  };

  // Live dish 86 availability toggle
  const toggleDishAvailability = async (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    const newAvail = !item.isAvailable;

    setMenuItems((prev) =>
      prev.map((m) =>
        m.id === itemId
          ? {
              ...m,
              isAvailable: newAvail,
              stockCount: newAvail ? 15 : 0,
            }
          : m
      )
    );

    addAuditLog(
      'UPDATE_MENU_AVAILABILITY',
      `Dish: ${item.name}`,
      'success',
      `Availability toggled to ${newAvail ? 'AVAILABLE' : '86 OUT OF STOCK'}.`
    );

    // Call backend API to sync server availability
    try {
      await fetch(`/api/menu/item/${itemId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newAvail }),
      });
    } catch (e) {
      // Silent error ignore
    }
  };

  const updateInventoryQuantity = (itemId: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === itemId) {
          const status =
            newQty <= 0 ? 'out_of_stock' : newQty <= inv.reorderLevel ? 'low' : 'ok';
          return { ...inv, quantity: newQty, status };
        }
        return inv;
      })
    );
  };

  const generateAiInsights = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: { dailyRevenue: 4280, avgPrepTime: 14 },
          activeOrdersCount: orders.filter((o) => o.status !== 'completed').length,
          lowStockItems: inventory.filter((i) => i.status !== 'ok').map((i) => i.name),
          topDishes: menuItems.slice(0, 3).map((m) => m.name),
        }),
      });
      const data = await res.json();
      if (data.insights) setAiInsights(data.insights);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const askAiQuestion = async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: { restaurantName: restaurant.name, totalOrders: orders.length },
        }),
      });
      const data = await res.json();
      return data.answer || 'No AI response received.';
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const updateRestaurant = (data: Partial<Restaurant>) => {
    setRestaurant((prev) => ({ ...prev, ...data }));
  };

  const simulateCustomerOrder = () => {
    const randomTable = Math.floor(1 + Math.random() * 8);
    const randomItems = [
      menuItems[Math.floor(Math.random() * menuItems.length)],
      menuItems[Math.floor(Math.random() * menuItems.length)],
    ];
    const subtotal = randomItems.reduce((acc, it) => acc + it.price, 0);
    const totalAmount = Number((subtotal * 1.08).toFixed(2));

    const newOrder: Order = {
      id: `ord-sim-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: randomTable,
      customerName: `Live Diner (Table ${randomTable})`,
      status: 'pending',
      items: randomItems.map((it, idx) => ({
        id: `oi-sim-${idx}`,
        menuItemId: it.id,
        name: it.name,
        price: it.price,
        quantity: 1,
      })),
      totalAmount,
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedPrepTime: 12,
      priority: Math.random() > 0.7 ? 'high' : 'normal',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setTables((prev) =>
      prev.map((t) =>
        t.number === randomTable
          ? { ...t, status: 'occupied', currentOrderId: newOrder.id }
          : t
      )
    );

    addNotification({
      title: `Simulated Order #${newOrder.id}`,
      message: `Table ${randomTable} placed an order ($${totalAmount.toFixed(2)}).`,
      type: 'order',
      tableNumber: randomTable,
    });
  };

  return (
    <StoreContext.Provider
      value={{
        userProfile,
        setUserProfile,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        restaurant,
        tables,
        categories,
        menuItems,
        orders,
        inventory,
        auditLogs,
        aiInsights,
        notifications,
        cart,
        selectedTableNumber,
        setSelectedTableNumber,
        isGeneratingAi,
        isSimulatingOrders,
        setIsSimulatingOrders,
        activePlacedOrder,
        setActivePlacedOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        markOrderPaid,
        callWaiter,
        dismissWaiterCall,
        toggleDishAvailability,
        updateInventoryQuantity,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addTable,
        updateTable,
        deleteTable,
        regenerateTableQrToken,
        generateAiInsights,
        askAiQuestion,
        addAuditLog,
        markNotificationRead,
        updateRestaurant,
        simulateCustomerOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

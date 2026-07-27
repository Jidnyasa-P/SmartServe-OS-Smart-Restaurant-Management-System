export type UserRole = 'customer' | 'staff' | 'kitchen' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  restaurantId: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  tablesCount: number;
  currency: string;
  qrCodeUrl: string;
  address: string;
  phone: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'needs_cleaning';

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  waiterCalled: boolean;
  waiterCallTime?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  guestsCount?: number;
  qrToken: string; // Token generated for secure QR table identification
}

export interface MenuCategory {
  id: string;
  name: string; // e.g. 'starters', 'mains', 'desserts', 'beverages', 'specials'
  label: string; // Display name e.g. 'Starters & Appetizers'
  description?: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string; // References MenuCategory.name or id
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  isSpicy?: boolean;
  isVegan?: boolean;
  isGF?: boolean; // Gluten Free
  calories?: number;
  stockCount: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'qr_pay';
  createdAt: string;
  updatedAt: string;
  estimatedPrepTime: number; // in minutes
  priority: 'normal' | 'high' | 'vip';
  tableToken?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
  status: 'ok' | 'low' | 'out_of_stock';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'success' | 'blocked' | 'warning';
  details?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  type: 'pricing' | 'inventory' | 'staffing' | 'waste' | 'efficiency';
  description: string;
  recommendation: string;
  impact: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'order' | 'waiter' | 'kitchen' | 'alert';
  timestamp: string;
  read: boolean;
  tableNumber?: number;
}

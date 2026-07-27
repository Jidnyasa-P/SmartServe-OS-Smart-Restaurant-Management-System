import { z } from 'zod';

// Order Placement Zod Schema
export const orderItemInputSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
});

export const placeOrderSchema = z.object({
  tableNumber: z.number().int().positive('Table number must be positive'),
  tableToken: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required').max(50).optional(),
  items: z.array(orderItemInputSchema).min(1, 'At least one menu item is required'),
});

// Menu Item Management Zod Schema
export const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  imageUrl: z.string().url('Invalid image URL').or(z.string().min(5)),
  isAvailable: z.boolean().default(true),
  prepTimeMinutes: z.number().int().positive('Prep time must be positive'),
  isSpicy: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGF: z.boolean().optional(),
  calories: z.number().int().nonnegative().optional(),
  stockCount: z.number().int().nonnegative('Stock count cannot be negative'),
});

// Menu Category Zod Schema
export const menuCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Category key is required'),
  label: z.string().min(2, 'Category label is required'),
  description: z.string().optional(),
  iconName: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Table Management Zod Schema
export const tableSchema = z.object({
  id: z.string().optional(),
  number: z.number().int().positive('Table number must be positive'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  status: z.enum(['available', 'occupied', 'reserved', 'needs_cleaning']),
  assignedStaffId: z.string().optional(),
  assignedStaffName: z.string().optional(),
});

// QR Token Verification Schema
export const qrTokenSchema = z.object({
  token: z.string().min(10, 'Invalid token format'),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuCategoryInput = z.infer<typeof menuCategorySchema>;
export type TableInput = z.infer<typeof tableSchema>;

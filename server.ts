import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// ---------------------------------------------------------------------------
// 1. Firebase Admin SDK Initialization
// ---------------------------------------------------------------------------
let projectId = 'independent-acumen-fbcl8';
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.projectId) projectId = config.projectId;
  }
} catch (e) {
  console.warn('Could not load firebase-applet-config.json, using default fallback projectId.');
}

if (!getApps().length) {
  initializeApp({
    projectId: projectId,
  });
}

const db = getFirestore();
const adminAuth = getAuth();

// Helper to hash raw QR tokens using SHA-256
function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Helper to generate cryptographically secure 256-bit QR tokens
function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ---------------------------------------------------------------------------
// 2. TypeScript Types & Express Auth Request Interfaces
// ---------------------------------------------------------------------------
export type UserRole = 'customer' | 'staff' | 'kitchen' | 'manager' | 'admin';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  restaurantId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// ---------------------------------------------------------------------------
// 3. Zod Input Validation Schemas
// ---------------------------------------------------------------------------
const OrderItemInputSchema = z.object({
  id: z.string().min(1, 'Item ID required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per line'),
  notes: z.string().max(200).optional(),
});

const PlaceOrderSchema = z.object({
  tableNumber: z.number().int().min(1, 'Invalid table number'),
  qrToken: z.string().min(10, 'Valid QR token required'),
  customerName: z.string().max(60).optional().default('Diner Guest'),
  items: z
    .array(OrderItemInputSchema)
    .min(1, 'Order must contain at least 1 item')
    .max(20, 'Maximum 20 distinct items allowed per order'),
});

const MenuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category: z.string().min(1, 'Category required'),
  price: z.number().positive('Price must be greater than 0'),
  description: z.string().max(500).default(''),
  isAvailable: z.boolean().default(true),
  stockCount: z.number().int().min(0).default(50),
  prepTimeMinutes: z.number().int().min(1).default(10),
  isVegan: z.boolean().default(false),
  isGF: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'cooking', 'ready', 'served', 'completed', 'cancelled']),
});

const AiQuerySchema = z.object({
  prompt: z.string().min(3, 'Prompt too short').max(500, 'Prompt exceeds maximum 500 characters'),
});

const AssignRoleSchema = z.object({
  targetUidOrEmail: z.string().min(3),
  role: z.enum(['customer', 'staff', 'kitchen', 'manager', 'admin']),
});

// ---------------------------------------------------------------------------
// 4. Express Server & Security Middlewares
// ---------------------------------------------------------------------------
export const app = express();
const PORT = 3000;

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for Vite dev server compatibility
  })
);

// Body Parser with strict 100kb payload limit
app.use(express.json({ limit: '100kb' }));

// Global Rate Limiter: Max 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Strict Order Placement Rate Limiter: Max 10 order submissions per 5 minutes per IP
const orderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { error: 'Order submission rate limit reached. Please wait before placing another order.' },
});

// Strict AI Rate Limiter: Max 10 requests per 5 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { error: 'AI analytics query limit exceeded. Please try again in a few minutes.' },
});

// Sanitized Request Logger Middleware (Strips Auth headers, tokens, passwords)
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Authentication & Authorization Middleware
// Verifies Firebase ID token from Authorization: Bearer <idToken> and reads role from Firestore /users/{uid}
async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing or malformed Bearer token.' });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user document from Firestore to get authoritative role
    const userDocRef = db.collection('users').doc(uid);
    const userSnap = await userDocRef.get();

    let role: UserRole = 'customer';
    let fullName = decodedToken.name || decodedToken.email?.split('@')[0] || 'User';
    let restaurantId = 'rest-01';

    if (userSnap.exists) {
      const data = userSnap.data()!;
      if (data.role) role = data.role as UserRole;
      if (data.fullName) fullName = data.fullName;
      if (data.restaurantId) restaurantId = data.restaurantId;
    } else {
      // Auto-initialize base customer profile if document missing
      await userDocRef.set({
        uid,
        email: decodedToken.email || '',
        fullName,
        role: 'customer',
        restaurantId: 'rest-01',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    }

    req.user = {
      uid,
      email: decodedToken.email || '',
      fullName,
      role,
      restaurantId,
    };

    next();
  } catch (err: any) {
    console.warn('ID Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

// Role Authorization Middleware Generator
function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Active role '${req.user.role}' is not authorized for this resource. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// 5. REST API Routes
// ---------------------------------------------------------------------------

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'Firestore' });
});

// Auth User Profile
app.get('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// MENU ENDPOINTS
// GET /api/menu (Public)
app.get('/api/menu', async (req, res, next) => {
  try {
    const snapshot = await db.collection('menuItems').get();
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// POST /api/menu (Manager or Admin)
app.post('/api/menu', authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = MenuItemSchema.parse(req.body);
    const newDocRef = db.collection('menuItems').doc();
    const menuItem = {
      id: newDocRef.id,
      ...validatedData,
      createdAt: new Date().toISOString(),
    };

    await newDocRef.set(menuItem);

    // Add Audit Log
    await db.collection('auditLogs').add({
      timestamp: new Date().toISOString(),
      action: 'MENU_ITEM_CREATE',
      actor: `${req.user?.fullName} (${req.user?.role})`,
      status: 'success',
      details: `Created menu item '${validatedData.name}' ($${validatedData.price})`,
    });

    res.status(201).json({ success: true, menuItem });
  } catch (err) {
    next(err);
  }
});

// PUT /api/menu/:id (Manager or Admin)
app.put('/api/menu/:id', authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = MenuItemSchema.partial().parse(req.body);

    const docRef = db.collection('menuItems').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: `Menu item '${id}' not found.` });
    }

    await docRef.update({
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, id, updatedFields: validatedData });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/menu/:id/86 (Kitchen, Manager, Admin - 86 Item Availability Toggle)
app.patch('/api/menu/:id/86', authenticateToken, requireRole(['kitchen', 'manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('menuItems').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: `Menu item '${id}' not found.` });
    }

    const currentStatus = docSnap.data()?.isAvailable ?? true;
    const newStatus = !currentStatus;

    await docRef.update({
      isAvailable: newStatus,
      updatedAt: new Date().toISOString(),
    });

    await db.collection('auditLogs').add({
      timestamp: new Date().toISOString(),
      action: 'MENU_86_TOGGLE',
      actor: `${req.user?.fullName} (${req.user?.role})`,
      status: 'success',
      details: `Toggled 86 availability for item '${docSnap.data()?.name}' to ${newStatus ? 'AVAILABLE' : '86-UNAVAILABLE'}`,
    });

    res.json({ success: true, id, isAvailable: newStatus });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/menu/:id (Manager or Admin)
app.delete('/api/menu/:id', authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('menuItems').doc(id);
    await docRef.delete();
    res.json({ success: true, message: `Menu item '${id}' deleted.` });
  } catch (err) {
    next(err);
  }
});

// CATEGORIES ENDPOINT
app.get('/api/categories', async (req, res, next) => {
  try {
    const snapshot = await db.collection('categories').orderBy('displayOrder', 'asc').get();
    const categories = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// TABLES ENDPOINTS
// GET /api/tables (Public/Staff - Returns table list without exposing raw token hashes)
app.get('/api/tables', async (req, res, next) => {
  try {
    const snapshot = await db.collection('tables').get();
    const tables = snapshot.docs.map((d) => {
      const data = d.data();
      // SECURITY: Strip qrTokenHash before returning table objects
      const { qrTokenHash, ...sanitized } = data;
      return { id: d.id, ...sanitized };
    });
    res.json({ tables });
  } catch (err) {
    next(err);
  }
});

// POST /api/tables/:id/regenerate-qr (Manager or Admin - Generates new crypto QR token and stores SHA-256 hash)
app.post('/api/tables/:id/regenerate-qr', authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const tableRef = db.collection('tables').doc(id);
    const tableSnap = await tableRef.get();

    if (!tableSnap.exists) {
      return res.status(404).json({ error: `Table '${id}' not found.` });
    }

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiry

    await tableRef.update({
      qrTokenHash: tokenHash,
      qrTokenExpiry: expiry,
      updatedAt: new Date().toISOString(),
    });

    await db.collection('auditLogs').add({
      timestamp: new Date().toISOString(),
      action: 'TABLE_QR_REGENERATED',
      actor: `${req.user?.fullName} (${req.user?.role})`,
      status: 'success',
      details: `Regenerated 256-bit crypto QR token for Table #${tableSnap.data()?.number}. Stored SHA-256 hash.`,
    });

    // Return the raw token ONCE so manager can print QR tent
    res.json({
      success: true,
      tableId: id,
      rawToken,
      expiry,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tables/:number/waiter-call (Public Customer)
app.post('/api/tables/:number/waiter-call', async (req, res, next) => {
  try {
    const tableNumber = parseInt(req.params.number, 10);
    const snapshot = await db.collection('tables').where('number', '==', tableNumber).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: `Table #${tableNumber} not found.` });
    }

    const tableDoc = snapshot.docs[0];
    await tableDoc.ref.update({
      waiterCalled: true,
      updatedAt: new Date().toISOString(),
    });

    await db.collection('notifications').add({
      timestamp: new Date().toISOString(),
      title: `Table #${tableNumber} Service Alert`,
      message: `Diner at Table #${tableNumber} requested waiter assistance.`,
      type: 'waiter',
      read: false,
    });

    res.json({ success: true, message: `Waiter assistance alerted for Table #${tableNumber}` });
  } catch (err) {
    next(err);
  }
});

// ORDER PLACEMENT (SECURE TRANSACTIONAL ORDER PLACEMENT)
// POST /api/orders
app.post('/api/orders', orderLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Zod Input Validation
    const validatedOrder = PlaceOrderSchema.parse(req.body);
    const { tableNumber, qrToken, customerName, items } = validatedOrder;

    // 2. Locate Table & Verify Cryptographic QR Token
    const tableQuerySnap = await db.collection('tables').where('number', '==', tableNumber).get();
    if (tableQuerySnap.empty) {
      return res.status(404).json({ error: `Table #${tableNumber} does not exist in restaurant database.` });
    }

    const tableDoc = tableQuerySnap.docs[0];
    const tableData = tableDoc.data();

    // Verify QR token hash against stored SHA-256 hash
    const computedHash = hashToken(qrToken);
    if (!tableData.qrTokenHash || computedHash !== tableData.qrTokenHash) {
      return res.status(403).json({ error: 'Invalid or forged Table QR code token. Order placement rejected.' });
    }

    // Verify token expiry
    if (tableData.qrTokenExpiry && new Date(tableData.qrTokenExpiry) < new Date()) {
      return res.status(403).json({ error: 'Table QR code token has expired. Please request waiter to refresh table tent.' });
    }

    // 3. Perform Transactional Stock Deduction and Order Creation in Firestore
    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    let calculatedSubtotal = 0;
    const finalOrderItems: any[] = [];

    await db.runTransaction(async (transaction) => {
      // Re-read every menu item from Firestore database within transaction
      for (const itemInput of items) {
        const itemRef = db.collection('menuItems').doc(itemInput.id);
        const itemSnap = await transaction.get(itemRef);

        if (!itemSnap.exists) {
          throw new Error(`Menu item '${itemInput.id}' no longer exists in menu database.`);
        }

        const itemData = itemSnap.data()!;

        if (!itemData.isAvailable) {
          throw new Error(`Menu item '${itemData.name}' is currently 86'd / unavailable.`);
        }

        if (itemData.stockCount < itemInput.quantity) {
          throw new Error(`Insufficient stock for '${itemData.name}'. Requested ${itemInput.quantity}, available: ${itemData.stockCount}`);
        }

        // SERVER PRICE COMPUTATION (Never trust client prices)
        const linePrice = itemData.price;
        const lineTotal = linePrice * itemInput.quantity;
        calculatedSubtotal += lineTotal;

        finalOrderItems.push({
          id: itemData.id,
          name: itemData.name,
          price: linePrice,
          quantity: itemInput.quantity,
          notes: itemInput.notes || '',
        });

        // Atomically deduct stock
        transaction.update(itemRef, {
          stockCount: itemData.stockCount - itemInput.quantity,
        });
      }

      // Compute Tax (8%) & Total
      const calculatedTax = Math.round(calculatedSubtotal * 0.08 * 100) / 100;
      const calculatedTotal = Math.round((calculatedSubtotal + calculatedTax) * 100) / 100;

      const newOrder = {
        id: orderId,
        tableNumber,
        qrTokenHash: computedHash,
        customerName: customerName || 'Diner Guest',
        items: finalOrderItems,
        subtotal: calculatedSubtotal,
        tax: calculatedTax,
        totalAmount: calculatedTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedPrepTime: 15,
      };

      // Create Order Document
      const newOrderRef = db.collection('orders').doc(orderId);
      transaction.set(newOrderRef, newOrder);

      // Update Table Status to occupied
      transaction.update(tableDoc.ref, {
        status: 'occupied',
        currentOrderId: orderId,
        updatedAt: new Date().toISOString(),
      });
    });

    // Post-transaction notifications
    await db.collection('notifications').add({
      timestamp: new Date().toISOString(),
      title: `New Order #${orderId}`,
      message: `Table #${tableNumber} placed new order ($${calculatedSubtotal.toFixed(2)})`,
      type: 'order',
      read: false,
    });

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        tableNumber,
        customerName: customerName || 'Diner Guest',
        items: finalOrderItems,
        subtotal: calculatedSubtotal,
        tax: Math.round(calculatedSubtotal * 0.08 * 100) / 100,
        totalAmount: Math.round((calculatedSubtotal + Math.round(calculatedSubtotal * 0.08 * 100) / 100) * 100) / 100,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    return res.status(400).json({ error: err.message || 'Order placement failed.' });
  }
});

// GET /api/orders (Staff, Kitchen, Manager, Admin)
app.get('/api/orders', authenticateToken, requireRole(['staff', 'kitchen', 'manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/status (Staff, Kitchen, Manager, Admin)
app.patch('/api/orders/:id/status', authenticateToken, requireRole(['staff', 'kitchen', 'manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = UpdateOrderStatusSchema.parse(req.body);

    const orderRef = db.collection('orders').doc(id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ error: `Order '${id}' not found.` });
    }

    const orderData = orderSnap.data()!;

    // Role specific status enforcement
    if (req.user?.role === 'kitchen' && !['cooking', 'ready'].includes(status)) {
      return res.status(403).json({ error: 'Kitchen staff can only transition order status to "cooking" or "ready".' });
    }

    await orderRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    // If order completed or cancelled, update table status
    if (['completed', 'cancelled'].includes(status)) {
      const tableQuery = await db.collection('tables').where('number', '==', orderData.tableNumber).get();
      if (!tableQuery.empty) {
        await tableQuery.docs[0].ref.update({
          status: status === 'completed' ? 'needs_cleaning' : 'available',
          currentOrderId: null,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, id, status });
  } catch (err) {
    next(err);
  }
});

// INVENTORY ENDPOINTS (Manager or Admin)
app.get('/api/inventory', authenticateToken, requireRole(['manager', 'admin']), async (req, res, next) => {
  try {
    const snapshot = await db.collection('inventory').get();
    const inventory = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ inventory });
  } catch (err) {
    next(err);
  }
});

app.put('/api/inventory/:id', authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Valid positive numeric quantity required.' });
    }

    const invRef = db.collection('inventory').doc(id);
    await invRef.update({ quantity, updatedAt: new Date().toISOString() });

    res.json({ success: true, id, quantity });
  } catch (err) {
    next(err);
  }
});

// ADMIN ROLE ASSIGNMENT ENDPOINT
app.post('/api/admin/assign-role', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminSecret = req.headers['x-admin-secret'];
    const authHeader = req.headers.authorization;

    let isAuthorizedAdmin = false;

    // Allow via secret header (for scripts) or via authenticated Admin user
    if (process.env.ADMIN_SECRET_KEY && adminSecret === process.env.ADMIN_SECRET_KEY) {
      isAuthorizedAdmin = true;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
      const userDoc = await db.collection('users').doc(decoded.uid).get();
      if (userDoc.exists && userDoc.data()?.role === 'admin') {
        isAuthorizedAdmin = true;
      }
    }

    if (!isAuthorizedAdmin) {
      return res.status(403).json({ error: 'Forbidden. Admin role assignment authorization failed.' });
    }

    const { targetUidOrEmail, role } = AssignRoleSchema.parse(req.body);

    let targetUid = targetUidOrEmail;
    if (targetUidOrEmail.includes('@')) {
      const userSnap = await db.collection('users').where('email', '==', targetUidOrEmail.trim().toLowerCase()).get();
      if (userSnap.empty) {
        return res.status(404).json({ error: `User email '${targetUidOrEmail}' not found.` });
      }
      targetUid = userSnap.docs[0].id;
    }

    await db.collection('users').doc(targetUid).set({
      role,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    res.json({ success: true, uid: targetUid, assignedRole: role });
  } catch (err) {
    next(err);
  }
});

// PROTECTED GEMINI AI RECOMMENDATIONS ENDPOINT
// POST /api/ai/recommendations
app.post('/api/ai/recommendations', aiLimiter, authenticateToken, requireRole(['manager', 'admin']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { prompt } = AiQuerySchema.parse(req.body);

    // Fetch anonymized sales & inventory data for AI context (NO PII, NO EMAILS, NO TOKENS)
    const [menuSnap, invSnap, orderSnap] = await Promise.all([
      db.collection('menuItems').get(),
      db.collection('inventory').get(),
      db.collection('orders').limit(50).get(),
    ]);

    const anonymizedMenu = menuSnap.docs.map((d) => ({
      name: d.data().name,
      price: d.data().price,
      stockCount: d.data().stockCount,
      isAvailable: d.data().isAvailable,
    }));

    const anonymizedInventory = invSnap.docs.map((d) => ({
      itemName: d.data().itemName,
      quantity: d.data().quantity,
      unit: d.data().unit,
      reorderLevel: d.data().reorderLevel,
    }));

    const anonymizedRecentOrders = orderSnap.docs.map((d) => ({
      status: d.data().status,
      totalAmount: d.data().totalAmount,
      itemCount: d.data().items?.length || 0,
    }));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured on server.',
        insight: `Analysis based on database state: Total Menu Items (${anonymizedMenu.length}), Stock items (${anonymizedInventory.length}), Recent Orders (${anonymizedRecentOrders.length}). Configure GEMINI_API_KEY in server environment to enable live AI generated answers.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are SmartServe OS Restaurant Yield & Inventory Advisory AI. Provide actionable, professional, high-margin recommendations for restaurant managers based strictly on provided anonymized restaurant operational data. Keep response under 250 words.`;

    const promptContext = `
Question: ${prompt}

Anonymized Restaurant Data Summary:
- Menu Items: ${JSON.stringify(anonymizedMenu)}
- Inventory Raw Ingredients: ${JSON.stringify(anonymizedInventory)}
- Recent Completed Orders Summary: ${JSON.stringify(anonymizedRecentOrders)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptContext}` }] },
      ],
    });

    const aiText = response.text || 'No response generated by AI model.';

    res.json({
      success: true,
      prompt,
      insight: aiText,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 6. Generic Production Error Handler Middleware
// ---------------------------------------------------------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Invalid request input format', details: err.issues });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message || 'Internal Server Error',
  });
});

// ---------------------------------------------------------------------------
// 7. Vite Middleware Integration & Server Startup
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SmartServe OS Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}

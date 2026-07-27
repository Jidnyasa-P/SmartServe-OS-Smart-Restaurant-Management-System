import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  placeOrderSchema,
  menuItemSchema,
  menuCategorySchema,
  tableSchema,
  qrTokenSchema,
} from './src/lib/schemas';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
} from './src/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side in-memory data store for API endpoints
let categories = [...INITIAL_CATEGORIES];
let menuItems = [...INITIAL_MENU_ITEMS];
let tables = [...INITIAL_TABLES];
let orders = [...INITIAL_ORDERS];
let auditLogs = [...INITIAL_AUDIT_LOGS];

// Initialize Gemini API client lazily or when key is available
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'SmartServe OS Backend Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// -------------------------------------------------------------
// CATEGORIES MANAGEMENT API
// -------------------------------------------------------------
app.get('/api/categories', (req, res) => {
  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json({ success: true, categories: activeCategories, allCategories: categories });
});

app.post('/api/categories', (req, res) => {
  const parseResult = menuCategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid category payload',
      details: parseResult.error.format(),
    });
  }

  const data = parseResult.data;
  const newCat = {
    id: data.id || `cat-${Date.now()}`,
    name: data.name.toLowerCase().replace(/\s+/g, '_'),
    label: data.label,
    description: data.description || '',
    iconName: data.iconName || 'Utensils',
    displayOrder: data.displayOrder || categories.length + 1,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };

  categories.push(newCat);
  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const index = categories.findIndex((c) => c.id === id || c.name === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  categories[index] = { ...categories[index], ...req.body };
  res.json({ success: true, category: categories[index] });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  categories = categories.filter((c) => c.id !== id && c.name !== id);
  res.json({ success: true, message: 'Category removed' });
});

// -------------------------------------------------------------
// MENU ITEMS & LIVE AVAILABILITY API
// -------------------------------------------------------------
app.get('/api/menu', (req, res) => {
  const publicOnly = req.query.public === 'true';
  const filtered = publicOnly
    ? menuItems.filter((m) => m.isAvailable && m.stockCount > 0)
    : menuItems;

  res.json({
    success: true,
    items: filtered,
    categories: categories.filter((c) => c.isActive),
  });
});

app.post('/api/menu/item', (req, res) => {
  const parseResult = menuItemSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid menu item payload',
      details: parseResult.error.format(),
    });
  }

  const data = parseResult.data;
  const newItem = {
    id: data.id || `item-${Date.now()}`,
    name: data.name,
    description: data.description,
    category: data.category,
    price: data.price,
    imageUrl: data.imageUrl,
    isAvailable: data.isAvailable,
    prepTimeMinutes: data.prepTimeMinutes,
    isSpicy: data.isSpicy || false,
    isVegan: data.isVegan || false,
    isGF: data.isGF || false,
    calories: data.calories || 400,
    stockCount: data.stockCount,
  };

  menuItems.push(newItem);
  res.status(201).json({ success: true, item: newItem });
});

// Live 86 availability toggle endpoint
app.patch('/api/menu/item/:id/availability', (req, res) => {
  const { id } = req.params;
  const item = menuItems.find((m) => m.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Menu item not found' });
  }

  const newAvailability = req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : !item.isAvailable;
  item.isAvailable = newAvailability;
  item.stockCount = newAvailability ? (item.stockCount || 15) : 0;

  // Log audit
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'user-kitchen-01',
    userRole: 'kitchen',
    userName: 'Chef / Kitchen Station',
    action: 'LIVE_86_AVAILABILITY_TOGGLE',
    resource: `Dish: ${item.name}`,
    ipAddress: req.ip || '127.0.0.1',
    status: 'success',
    details: `Updated availability status to ${newAvailability ? 'AVAILABLE' : '86 OUT OF STOCK'}`,
  });

  res.json({ success: true, item });
});

// -------------------------------------------------------------
// TABLE & QR TOKEN MANAGEMENT API
// -------------------------------------------------------------
app.get('/api/tables', (req, res) => {
  res.json({ success: true, tables });
});

app.post('/api/tables', (req, res) => {
  const parseResult = tableSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid table payload',
      details: parseResult.error.format(),
    });
  }

  const data = parseResult.data;
  const newTable = {
    id: data.id || `tbl-${Date.now()}`,
    number: data.number,
    capacity: data.capacity,
    status: data.status,
    waiterCalled: false,
    qrToken: `tbl_tok_${data.number.toString().padStart(2, '0')}_${Math.random().toString(36).substring(2, 7)}`,
    assignedStaffName: data.assignedStaffName || 'Floor Team',
  };

  tables.push(newTable);
  res.status(201).json({ success: true, table: newTable });
});

// Regenerate QR Token for table
app.post('/api/tables/:id/regenerate-token', (req, res) => {
  const { id } = req.params;
  const table = tables.find((t) => t.id === id || t.number === Number(id));
  if (!table) {
    return res.status(404).json({ success: false, error: 'Table not found' });
  }

  table.qrToken = `tbl_tok_${table.number.toString().padStart(2, '0')}_${Math.random().toString(36).substring(2, 7)}`;
  res.json({ success: true, tableNumber: table.number, qrToken: table.qrToken });
});

// Verify QR Token
app.get('/api/qr/verify-token', (req, res) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ success: false, error: 'Token query parameter required' });
  }

  const parseResult = qrTokenSchema.safeParse({ token });
  if (!parseResult.success) {
    return res.status(400).json({ success: false, error: 'Invalid token format' });
  }

  const table = tables.find((t) => t.qrToken === token);
  if (!table) {
    return res.status(404).json({ success: false, error: 'QR Token expired or invalid' });
  }

  // Expose ONLY safe public table details & available menu items
  const publicMenuItems = menuItems.filter((m) => m.isAvailable && m.stockCount > 0);
  const activeCategories = categories.filter((c) => c.isActive);

  res.json({
    success: true,
    table: {
      number: table.number,
      capacity: table.capacity,
      status: table.status,
      token: table.qrToken,
    },
    menu: publicMenuItems,
    categories: activeCategories,
  });
});

// -------------------------------------------------------------
// SECURE ORDER PLACEMENT API (Zod Validation + Server Price Recalculation)
// -------------------------------------------------------------
app.post('/api/orders/place', (req, res) => {
  const parseResult = placeOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Zod Validation Failed: Invalid order structure',
      details: parseResult.error.format(),
    });
  }

  const { tableNumber, items, customerName, tableToken } = parseResult.data;

  // Validate table existence
  const table = tables.find((t) => t.number === tableNumber);
  if (!table) {
    return res.status(404).json({ success: false, error: `Table #${tableNumber} does not exist` });
  }

  // If table token provided, verify it matches
  if (tableToken && table.qrToken !== tableToken) {
    return res.status(403).json({ success: false, error: 'Invalid table QR security token' });
  }

  // Server-side validation of menu items, availability, stock, and PRICE CALCULATION
  let serverCalculatedSubtotal = 0;
  let maxPrepTime = 10;
  const verifiedOrderItems = [];

  for (const clientItem of items) {
    const serverItem = menuItems.find((m) => m.id === clientItem.menuItemId);
    if (!serverItem) {
      return res.status(400).json({
        success: false,
        error: `Dish with ID '${clientItem.menuItemId}' is not found in restaurant menu.`,
      });
    }

    if (!serverItem.isAvailable || serverItem.stockCount < clientItem.quantity) {
      return res.status(400).json({
        success: false,
        error: `Dish '${serverItem.name}' is currently 86 / Out of Stock. Required: ${clientItem.quantity}, Available: ${serverItem.stockCount}`,
      });
    }

    // DO NOT TRUST FRONTEND PRICE: Use serverItem.price!
    const itemTotal = serverItem.price * clientItem.quantity;
    serverCalculatedSubtotal += itemTotal;

    if (serverItem.prepTimeMinutes > maxPrepTime) {
      maxPrepTime = serverItem.prepTimeMinutes;
    }

    // Deduct stock on server
    serverItem.stockCount -= clientItem.quantity;
    if (serverItem.stockCount <= 0) {
      serverItem.stockCount = 0;
      serverItem.isAvailable = false;
    }

    verifiedOrderItems.push({
      id: `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      menuItemId: serverItem.id,
      name: serverItem.name,
      price: serverItem.price, // Server price enforced
      quantity: clientItem.quantity,
      notes: clientItem.notes || undefined,
    });
  }

  const tax = serverCalculatedSubtotal * 0.08;
  const finalTotalAmount = Number((serverCalculatedSubtotal + tax).toFixed(2));

  const newOrder = {
    id: `ord-${Math.floor(100 + Math.random() * 900)}`,
    tableNumber,
    tableToken: table.qrToken,
    customerName: customerName || `Table ${tableNumber} Guest`,
    status: 'pending' as const,
    items: verifiedOrderItems,
    totalAmount: finalTotalAmount,
    paymentStatus: 'unpaid' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedPrepTime: maxPrepTime,
    priority: finalTotalAmount > 80 ? ('vip' as const) : ('normal' as const),
  };

  // Save order to server state
  orders.unshift(newOrder);

  // Update table status
  table.status = 'occupied';
  table.currentOrderId = newOrder.id;

  // Add Server Audit Log
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'user-customer-qr',
    userRole: 'customer',
    userName: `${newOrder.customerName}`,
    action: 'SERVER_VERIFIED_ORDER_PLACED',
    resource: `Table #${tableNumber} Order #${newOrder.id}`,
    ipAddress: clientIp,
    status: 'success',
    details: `Zod verified & placed order total $${finalTotalAmount.toFixed(2)} (${verifiedOrderItems.length} items). Server price enforcement applied.`,
  });

  res.status(201).json({
    success: true,
    message: 'Order successfully placed and verified by server.',
    order: newOrder,
    summary: {
      subtotal: serverCalculatedSubtotal,
      tax,
      totalAmount: finalTotalAmount,
      estimatedPrepTimeMinutes: maxPrepTime,
    },
  });
});

// Fetch single order status for live tracking
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  res.json({
    success: true,
    order: {
      id: order.id,
      tableNumber: order.tableNumber,
      status: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      estimatedPrepTime: order.estimatedPrepTime,
      createdAt: order.createdAt,
      paymentStatus: order.paymentStatus,
    },
  });
});

// -------------------------------------------------------------
// GEMINI AI INSIGHTS & CONSULTANT ENDPOINTS
// -------------------------------------------------------------
app.post('/api/ai/insights', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'GEMINI_API_KEY is not configured in secrets. Displaying simulated baseline AI rules.',
        insights: [
          {
            id: 'ins-fallback-1',
            title: 'Dynamic Pricing Recommendation',
            type: 'pricing',
            description: 'Truffle Pasta & Wagyu Burger are trending high during peak dinner hours (7:30 PM - 9:00 PM).',
            recommendation: 'Consider a 5% peak-demand dynamic pricing adjustment or bundling with artisan craft beverages to boost gross margin by +8%.',
            impact: 'High (+8% Margin)',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'ins-fallback-2',
            title: 'Inventory & Waste Alert',
            type: 'inventory',
            description: 'Fresh Salmon fillet stock is projected to run out in 1.5 hours based on current velocity.',
            recommendation: 'Trigger automated supplier reorder for 15kg Atlantic Salmon or prioritize promoting Grilled Seabass special.',
            impact: 'Critical (Stockout Prevention)',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'ins-fallback-3',
            title: 'Staffing Efficiency Optimization',
            type: 'staffing',
            description: 'Table turnover latency on Floor 1 is currently averaging 14 mins after payment.',
            recommendation: 'Re-assign 1 floor runner to Table clearing duties during 8:00 PM peak to increase hourly seating capacity by +12%.',
            impact: 'Medium (+12% Turnover)',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    const { metrics, activeOrdersCount, lowStockItems, topDishes } = req.body || {};

    const prompt = `You are the lead AI Restaurant Operations Architect for SmartServe OS.
Analyze the following live restaurant operational metrics and provide 3 crisp, high-impact, actionable insights for the restaurant manager:

Current Operational Data:
- Active Orders in Kitchen: ${activeOrdersCount || 8}
- Today's Revenue: $${metrics?.dailyRevenue || 4280}
- Average Table Prep Time: ${metrics?.avgPrepTime || 14} minutes
- Low Stock Items: ${JSON.stringify(lowStockItems || ['Fresh Salmon', 'Truffle Oil'])}
- Top Selling Dishes: ${JSON.stringify(topDishes || ['Truffle Tagliatelle', 'Smoked Wagyu Burger'])}

Return a JSON array of exactly 3 insight objects with the following schema:
[
  {
    "id": "ins-1",
    "title": "Short descriptive title",
    "type": "pricing" | "inventory" | "staffing" | "waste" | "efficiency",
    "description": "Observation based on data",
    "recommendation": "Concrete operational action to take now",
    "impact": "e.g., High (+10% Revenue) or Critical (Stockout Prevention)"
  }
]
Respond ONLY with the valid JSON array without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text || '[]';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const insights = JSON.parse(cleanJson);

    return res.json({
      success: true,
      insights,
    });
  } catch (error: any) {
    console.error('Error generating AI insights:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate operational insights',
    });
  }
});

app.post('/api/ai/query', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { question, context } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!ai) {
      return res.json({
        answer: `[SmartServe AI Assistant Demo Mode]\n\nBased on your query: "${question}"\n\nSmartServe OS recommends inspecting peak hour table rotation, adjusting kitchen safety stock levels, and automating staff notifications via the KDS board. (To enable real-time Gemini reasoning, add GEMINI_API_KEY to your environment secrets).`,
      });
    }

    const prompt = `You are SmartServe Assistant, an expert AI operational consultant for high-volume restaurants.
Restaurant Context: ${JSON.stringify(context || {})}
User Manager Question: "${question}"

Provide a concise, practical, professional, and actionable answer focusing on restaurant workflow efficiency, revenue growth, kitchen order speed, and staff management. Keep it under 180 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      answer: response.text,
    });
  } catch (error: any) {
    console.error('Error answering AI query:', error);
    return res.status(500).json({ error: error.message || 'Internal AI query error' });
  }
});

// Vite Middleware & Production Static Serving
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
    console.log(`SmartServe OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

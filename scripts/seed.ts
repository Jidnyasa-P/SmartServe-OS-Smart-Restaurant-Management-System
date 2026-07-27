import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Read firebase applet config for project ID
let projectId = 'independent-acumen-fbcl8';
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.projectId) projectId = config.projectId;
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json, using fallback projectId:', projectId);
}

if (!getApps().length) {
  initializeApp({
    projectId: projectId,
  });
}

const db = getFirestore();

// Helper to hash QR Tokens using SHA-256
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

const CATEGORIES = [
  { id: 'starters', name: 'starters', label: 'Starters & Appetizers', displayOrder: 1 },
  { id: 'mains', name: 'mains', label: 'Signature Mains', displayOrder: 2 },
  { id: 'desserts', name: 'desserts', label: 'Desserts', displayOrder: 3 },
  { id: 'drinks', name: 'drinks', label: 'Artisanal Drinks', displayOrder: 4 },
];

const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Truffle & Wild Mushroom Arancini',
    category: 'starters',
    price: 16,
    description: 'Crispy risotto spheres stuffed with smoked mozzarella, winter truffle essence, and garlic aioli.',
    isAvailable: true,
    stockCount: 25,
    prepTimeMinutes: 10,
    isVegan: false,
    isGF: false,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm2',
    name: 'Fire-Roasted Tomato Basil Soup',
    category: 'starters',
    price: 12,
    description: 'Slow-simmered San Marzano tomatoes, fresh basil oil, and sourdough croutons.',
    isAvailable: true,
    stockCount: 30,
    prepTimeMinutes: 8,
    isVegan: true,
    isGF: true,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm3',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'mains',
    price: 38,
    description: 'Sustainably caught sea bass over saffron risotto, asparagus spears, and citrus butter reduction.',
    isAvailable: true,
    stockCount: 15,
    prepTimeMinutes: 18,
    isVegan: false,
    isGF: true,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm4',
    name: 'A5 Wagyu Striploin (8oz)',
    category: 'mains',
    price: 68,
    description: 'Miyazaki A5 Wagyu, potato puree, roasted bone marrow jus, and smoked sea salt.',
    isAvailable: true,
    stockCount: 10,
    prepTimeMinutes: 20,
    isVegan: false,
    isGF: true,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm5',
    name: 'Artisan Smoked Burrata Bowl',
    category: 'mains',
    price: 22,
    description: 'Heirloom tomatoes, pickled shallots, aged balsamic reduction, grilled focaccia, and pine nuts.',
    isAvailable: true,
    stockCount: 18,
    prepTimeMinutes: 12,
    isVegan: false,
    isGF: false,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm6',
    name: 'Deconstructed Dark Chocolate Sphere',
    category: 'desserts',
    price: 15,
    description: '70% Valrhona chocolate sphere, warm salted caramel pour-over, hazelnut praline.',
    isAvailable: true,
    stockCount: 20,
    prepTimeMinutes: 10,
    isVegan: false,
    isGF: true,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'm7',
    name: 'Smoked Yuzu & Botanical Tonic',
    category: 'drinks',
    price: 9,
    description: 'Fresh yuzu juice, rosemary syrup, artisanal fever-tree tonic, smoked cinnamon rim.',
    isAvailable: true,
    stockCount: 50,
    prepTimeMinutes: 4,
    isVegan: true,
    isGF: true,
    isSpicy: false,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
  },
];

const SAMPLE_RAW_TOKENS: Record<number, string> = {
  1: 'raw_token_table_1_secret_key_8f3a9d2b1c0e4f5a6b7c8d9e0f',
  2: 'raw_token_table_2_secret_key_7e2d1c0b9a8f7e6d5c4b3a2f1e',
  3: 'raw_token_table_3_secret_key_6d5c4b3a2f1e0d9c8b7a6f5e4d',
  4: 'raw_token_table_4_secret_key_5c4b3a2f1e0d9c8b7a6f5e4d3c',
  5: 'raw_token_table_5_secret_key_4b3a2f1e0d9c8b7a6f5e4d3c2b',
  6: 'raw_token_table_6_secret_key_3a2f1e0d9c8b7a6f5e4d3c2b1a',
};

const TABLES = [
  {
    id: 'table-1',
    number: 1,
    capacity: 2,
    status: 'occupied',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[1]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'Elena Rostova',
    currentOrderId: 'ord-101',
    waiterCalled: false,
  },
  {
    id: 'table-2',
    number: 2,
    capacity: 4,
    status: 'available',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[2]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'Marco Vance',
    currentOrderId: null,
    waiterCalled: false,
  },
  {
    id: 'table-3',
    number: 3,
    capacity: 4,
    status: 'needs_cleaning',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[3]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'Elena Rostova',
    currentOrderId: null,
    waiterCalled: true,
  },
  {
    id: 'table-4',
    number: 4,
    capacity: 6,
    status: 'reserved',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[4]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'David Chen',
    currentOrderId: null,
    waiterCalled: false,
  },
  {
    id: 'table-5',
    number: 5,
    capacity: 2,
    status: 'available',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[5]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'Marco Vance',
    currentOrderId: null,
    waiterCalled: false,
  },
  {
    id: 'table-6',
    number: 6,
    capacity: 8,
    status: 'available',
    qrTokenHash: hashToken(SAMPLE_RAW_TOKENS[6]),
    qrTokenExpiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    assignedStaffName: 'David Chen',
    currentOrderId: null,
    waiterCalled: false,
  },
];

const INVENTORY = [
  { id: 'inv-1', itemName: 'Japanese Miyazaki A5 Wagyu Beef', quantity: 12.5, unit: 'kg', reorderLevel: 5.0, costPerUnit: 180 },
  { id: 'inv-2', itemName: 'Wild Winter Truffle Butter', quantity: 3.2, unit: 'kg', reorderLevel: 2.0, costPerUnit: 95 },
  { id: 'inv-3', itemName: 'Sustainably Farmed Sea Bass Fillets', quantity: 18.0, unit: 'kg', reorderLevel: 8.0, costPerUnit: 42 },
  { id: 'inv-4', itemName: 'Valrhona 70% Dark Chocolate Callets', quantity: 24.0, unit: 'kg', reorderLevel: 10.0, costPerUnit: 28 },
  { id: 'inv-5', itemName: 'Organic San Marzano Tomatoes', quantity: 45.0, unit: 'kg', reorderLevel: 15.0, costPerUnit: 6 },
  { id: 'inv-6', itemName: 'Artisanal Smoked Burrata Cheese', quantity: 8.0, unit: 'kg', reorderLevel: 5.0, costPerUnit: 24 },
];

export async function seedDatabase() {
  console.log('🌱 Starting Firestore Database Seeding for SmartServe OS...');

  for (const cat of CATEGORIES) {
    await db.collection('categories').doc(cat.id).set(cat, { merge: true });
  }
  console.log(`✅ Seeded ${CATEGORIES.length} Categories`);

  for (const item of MENU_ITEMS) {
    await db.collection('menuItems').doc(item.id).set(item, { merge: true });
  }
  console.log(`✅ Seeded ${MENU_ITEMS.length} Menu Items`);

  for (const table of TABLES) {
    await db.collection('tables').doc(table.id).set(table, { merge: true });
  }
  console.log(`✅ Seeded ${TABLES.length} Tables with SHA-256 Token Hashes`);

  for (const inv of INVENTORY) {
    await db.collection('inventory').doc(inv.id).set(inv, { merge: true });
  }
  console.log(`✅ Seeded ${INVENTORY.length} Inventory Items`);

  await db.collection('auditLogs').doc('log-init').set({
    id: 'log-init',
    timestamp: new Date().toISOString(),
    action: 'FIRESTORE_DATABASE_SEED',
    actor: 'system:seed_script',
    status: 'success',
    details: 'Initial operational Firestore database collections seeded successfully with SHA-256 QR token security.',
  }, { merge: true });

  console.log('🎉 Firestore Database Seeding Complete!');
}

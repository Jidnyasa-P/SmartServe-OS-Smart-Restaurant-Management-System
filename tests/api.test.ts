import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { app } from '../server';

// Shared Mock Firestore Database State with vi.hoisted
const { mockFirestoreData, mockDb } = vi.hoisted(() => {
  const cryptoNode = require('crypto');
  const hashToken = (token: string) => cryptoNode.createHash('sha256').update(token).digest('hex');

  const mockFirestoreData: Record<string, any> = {
    'users/user-customer-123': {
      uid: 'user-customer-123',
      email: 'customer@test.com',
      fullName: 'John Customer',
      role: 'customer',
      restaurantId: 'rest-01',
    },
    'users/user-manager-456': {
      uid: 'user-manager-456',
      email: 'manager@test.com',
      fullName: 'Alice Manager',
      role: 'manager',
      restaurantId: 'rest-01',
    },
    'tables/tbl-4': {
      id: 'tbl-4',
      number: 4,
      capacity: 4,
      status: 'available',
      qrTokenHash: hashToken('valid_qr_token_table_4_secret_key'),
      qrTokenExpiry: '2099-01-01T00:00:00.000Z',
    },
    'menuItems/m1': {
      id: 'm1',
      name: 'Truffle Arancini',
      price: 16.0,
      isAvailable: true,
      stockCount: 20,
    },
    'menuItems/m-soldout': {
      id: 'm-soldout',
      name: 'Soldout Caviar',
      price: 100.0,
      isAvailable: false,
      stockCount: 0,
    },
  };

  const createMockDocRef = (colName: string, docId: string) => ({
    get: async () => ({
      exists: !!mockFirestoreData[`${colName}/${docId}`],
      data: () => mockFirestoreData[`${colName}/${docId}`],
    }),
    set: async (data: any, opts?: any) => {
      mockFirestoreData[`${colName}/${docId}`] = opts?.merge
        ? { ...mockFirestoreData[`${colName}/${docId}`], ...data }
        : data;
      return true;
    },
    update: async (data: any) => {
      mockFirestoreData[`${colName}/${docId}`] = {
        ...mockFirestoreData[`${colName}/${docId}`],
        ...data,
      };
      return true;
    },
    delete: async () => {
      delete mockFirestoreData[`${colName}/${docId}`];
      return true;
    },
  });

  const mockDb = {
    collection: (colName: string) => ({
      doc: (docId: string) => createMockDocRef(colName, docId),
      where: (field: string, op: string, val: any) => ({
        get: async () => {
          const matched = Object.entries(mockFirestoreData)
            .filter(([key]) => key.startsWith(`${colName}/`))
            .map(([, valData]) => valData)
            .filter((item) => item[field] === val);

          return {
            empty: matched.length === 0,
            docs: matched.map((item) => ({
              id: item.id || 'doc-id',
              data: () => item,
              ref: createMockDocRef(colName, item.id || 'doc-id'),
            })),
          };
        },
      }),
      get: async () => ({
        docs: Object.entries(mockFirestoreData)
          .filter(([key]) => key.startsWith(`${colName}/`))
          .map(([, valData]) => ({
            id: valData.id || 'doc-id',
            data: () => valData,
            ref: createMockDocRef(colName, valData.id || 'doc-id'),
          })),
      }),
      add: async (data: any) => {
        const id = data.id || `new-${Date.now()}`;
        mockFirestoreData[`${colName}/${id}`] = { ...data, id };
        return createMockDocRef(colName, id);
      },
    }),
    runTransaction: async (updateFunction: any) => {
      const mockTransaction = {
        get: async (ref: any) => ref.get(),
        set: async (ref: any, data: any) => ref.set(data),
        update: async (ref: any, data: any) => ref.update(data),
      };
      return await updateFunction(mockTransaction);
    },
  };

  return { mockFirestoreData, mockDb };
});

vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => [{}]),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => mockDb),
  FieldValue: {
    serverTimestamp: () => new Date().toISOString(),
    increment: (n: number) => n,
  },
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({
    verifyIdToken: async (token: string) => {
      if (token === 'customer-token') {
        return { uid: 'user-customer-123', email: 'customer@test.com' };
      }
      if (token === 'manager-token') {
        return { uid: 'user-manager-456', email: 'manager@test.com' };
      }
      throw new Error('Invalid token');
    },
  })),
}));

describe('SmartServe OS Security & API Tests', () => {
  // 1. Unauthenticated management request rejected
  it('1. Unauthenticated management request is rejected with 401', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({
        name: 'Forbidden Dish',
        category: 'mains',
        price: 25,
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Authentication required');
  });

  // 2. Customer cannot modify menu
  it('2. Customer role is rejected with 403 when attempting to create menu items', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', 'Bearer customer-token')
      .send({
        name: 'Unauthorized Pizza',
        category: 'mains',
        price: 18,
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Access denied');
  });

  // 3. Manager can modify menu
  it('3. Manager role is allowed with 201 to create menu items', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', 'Bearer manager-token')
      .send({
        name: 'Wagyu Beef Burger',
        category: 'mains',
        price: 28,
        description: 'Prime beef patty with truffle sauce',
        isAvailable: true,
        stockCount: 15,
        prepTimeMinutes: 12,
        isVegan: false,
        isGF: false,
        isSpicy: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.menuItem.name).toBe('Wagyu Beef Burger');
  });

  // 4. Forged frontend price ignored
  it('4. Forged frontend price sent in payload is ignored and server database price is used', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        tableNumber: 4,
        qrToken: 'valid_qr_token_table_4_secret_key',
        customerName: 'Attacker Diner',
        items: [
          {
            id: 'm1',
            quantity: 2,
            price: 0.01, // Forged price attempt ($0.01)
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // Server database item m1 price is $16.00. 2 * $16 = $32.00
    expect(res.body.order.subtotal).toBe(32.0);
    expect(res.body.order.items[0].price).toBe(16.0);
  });

  // 5. Invalid QR token rejected
  it('5. Order with forged or invalid QR token is rejected with 403', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        tableNumber: 4,
        qrToken: 'FORGED_INVALID_QR_TOKEN_ABC123',
        customerName: 'Hacker',
        items: [{ id: 'm1', quantity: 1 }],
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Invalid or forged Table QR code token');
  });

  // 6. Unavailable item rejected
  it('6. Order containing an 86d / unavailable menu item is rejected with 400', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        tableNumber: 4,
        qrToken: 'valid_qr_token_table_4_secret_key',
        customerName: 'Diner',
        items: [{ id: 'm-soldout', quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("86'd / unavailable");
  });

  // 7. Excessive quantity rejected
  it('7. Order with line quantity exceeding max 10 per item is rejected by Zod validation', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        tableNumber: 4,
        qrToken: 'valid_qr_token_table_4_secret_key',
        customerName: 'Glutton Diner',
        items: [{ id: 'm1', quantity: 99 }], // Exceeds limit 10
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  // 8. Role escalation rejected
  it('8. Role assignment without admin secret or token is rejected with 403', async () => {
    const res = await request(app)
      .post('/api/admin/assign-role')
      .send({
        targetUidOrEmail: 'customer@test.com',
        role: 'manager',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Forbidden');
  });
});

# SmartServe OS — Full-Stack Real-Time Restaurant Operating System

SmartServe OS is a full-stack, secure restaurant management and QR-code table dining platform built with React, Vite, TypeScript, Express, Firebase Authentication, and Firestore Database.

---

## 1. Problem Statement
Traditional restaurant POS systems are prone to order tampering, client-side price manipulation, unauthorized staff privilege escalation, and unauthenticated table order injection. SmartServe OS solves these vulnerabilities by placing zero trust in browser client state:
- **Server-Side Price Authority**: Canonical dish prices and stock levels are re-evaluated within transactional database locks on Express server endpoints.
- **Cryptographic Table Tokens**: Dining tables are secured with 256-bit cryptographically random QR tokens. Only SHA-256 token hashes are stored in Firestore.
- **Role-Based Access Control (RBAC)**: User roles (`customer`, `staff`, `kitchen`, `manager`, `admin`) are verified against protected server profiles using Firebase Admin SDK ID token validation.

---

## 2. Architecture & Tech Stack

```
[ QR Table Diner / Staff Client ]
              │
              │  HTTPS + Bearer ID Token
              ▼
    [ Express API Gateway ]
  ├── Helmet Security & Rate Limiters (100kb payload max)
  ├── Strict Zod Input Validation
  ├── Firebase Admin SDK Token & Role Verification
  ├── Transactional Order & Stock Engine (SHA-256 Token Matching)
  └── Protected Gemini Yield Advisory API (Anonymized Data Pipeline)
              │
              ▼
   [ Firestore Cloud Database ]
  ├── /users/{uid} (RBAC Role Profiles)
  ├── /tables/{id} (Crypto QR Token Hashes)
  ├── /menuItems/{id} (Server Prices & 86 Stock Counts)
  ├── /orders/{id} (Transactional Order Engine)
  ├── /inventory/{id} (Raw Ingredients)
  └── /auditLogs/{id} (Security Audit Stream)
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend API**: Node.js, Express, Firebase Admin SDK, Zod, Helmet, Express-Rate-Limit.
- **Database & Auth**: Firebase Authentication, Cloud Firestore Database with strict default-deny Firestore Security Rules (`firestore.rules`).
- **AI Analytics**: Server-side `@google/genai` (Gemini 2.5 Flash) model for high-margin yield and inventory advice.

---

## 3. Roles & Permissions Matrix

| Role | Operational Scope | API Authorization |
|---|---|---|
| **Customer** | QR menu browsing, order placement, table waiter call | Browse menu, create orders with valid QR token, trigger waiter call |
| **Kitchen** | KDS order queue, order prep status update, 86 item availability | Read active orders, update status to `cooking`/`ready`, toggle 86 status |
| **Staff** | Floor table map, order delivery, table clearing | Read orders/tables, update table status, mark orders `served`/`completed` |
| **Manager** | Menu management, inventory tracking, sales analytics, AI engine | Full CRUD on menu/tables/inventory, run Gemini AI yield queries |
| **Admin** | System configuration, member role assignment, audit inspection | Full access + assign user roles via `/api/admin/assign-role` |

---

## 4. Completed User Stories

1. **Secure QR Table Dining**: Diners scan table QR codes containing 256-bit crypto tokens to view menus, customize dishes, and place orders without app downloads.
2. **Transactional Server Order Placement**: Server re-calculates subtotal/tax, verifies QR token SHA-256 hash, checks live stock, and atomically updates Firestore within database transactions.
3. **Kitchen Display System (KDS)**: Chefs manage real-time order states and toggle 86 item availability instantly across all station screens.
4. **Floor Staff Service Center**: Servers monitor table occupancy, service alerts, and complete table turnarounds.
5. **Manager Inventory & AI Yield Advisor**: Restaurant managers monitor stock reorder triggers and consult Gemini AI for menu optimization without exposing customer PII.
6. **Security Audit Stream**: Real-time logging of security events, role checks, and database access attempts.

---

## 5. Setup Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Local Installation

```bash
# Clone repository and install dependencies
npm install

# Seed Firestore database collections with initial menu, tables, and inventory
npx tsx scripts/seed.ts

# Start full-stack Express + Vite dev server
npm run dev
```

The application will launch on `http://localhost:3000`.

---

## 6. Environment Variables

Create a `.env` file at the project root based on `.env.example`:

```env
# Gemini API Secret (Server-side only)
GEMINI_API_KEY="your-gemini-api-key"

# Admin Secret Key for Role Assignment Script (Server-side only)
ADMIN_SECRET_KEY="your-admin-secret-key"

# Firebase Client Credentials
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Feature Flags
VITE_DEMO_MODE="true"
NODE_ENV="development"
PORT="3000"
```

---

## 7. Security Controls & Protections

- **Default-Deny Firestore Rules**: Client direct writes to `orders`, `menuItems`, `tables`, `inventory`, and `auditLogs` are strictly blocked in `firestore.rules`.
- **Token Verification**: ID tokens in `Authorization: Bearer <token>` headers are verified via Firebase Admin SDK.
- **Crypto QR Tokens**: Table QR tokens are generated with `crypto.randomBytes(32)` and matched against stored SHA-256 hashes.
- **Input Validation**: All API mutations are strictly validated using Zod schemas.
- **Rate Limiting**: Global rate limiters and strict order/AI rate limiters protect against DDoS and brute force.
- **Helmet Headers**: Standard HTTP security headers enabled.
- **100kb Payload Limit**: Rejects oversized JSON payloads.

---

## 8. AI Usage & Data Sanitization

The Gemini AI endpoint (`/api/ai/recommendations`) provides operational yield recommendations to restaurant managers. To protect customer privacy:
- Customer names, emails, user IDs, and QR tokens are **stripped** before constructing the prompt context.
- Only aggregated, anonymized item counts, prices, and stock quantities are sent to Gemini.
- Requires `manager` or `admin` authentication.

---

## 9. Demo Credentials & Role Assignment Strategy

### Public Registration
All self-registered accounts on the public register screen receive the `customer` role by default.

### Elevating Roles for Testing
To promote a user account to `manager`, `staff`, or `kitchen`, run the secure server-side role assignment script:

```bash
# Assign manager role by email or UID
npx tsx scripts/assign-role.ts alex.manager@smartserve.os manager
npx tsx scripts/assign-role.ts chef.sarah@smartserve.os kitchen
npx tsx scripts/assign-role.ts waiter.marco@smartserve.os staff
```

---

## 10. Testing & Deployment Instructions

### Running Tests
Run the Vitest integration test suite covering security authorization, order price verification, and rate limits:

```bash
npm run test
```

### Production Build & Deployment

```bash
# Build frontend static assets and bundle server.ts with esbuild
npm run build

# Start production server
npm run start
```

Deployable directly to Google Cloud Run, Firebase Hosting, or any containerized runtime environment.

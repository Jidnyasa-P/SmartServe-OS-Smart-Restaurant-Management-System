# 🍽️ SmartServe OS — Full-Stack Real-Time Restaurant Operating System

> **VibeAthon6.0 Hackathon Submission (2K26)**  
> **Problem Statement**: Smart Restaurant Management System  
> **Team Name**: HackaHer
> **Live Application**: [SmartServe OS Production App](https://ais-pre-p62wsrlpqzs2ldemu65zhi-461622340415.asia-southeast1.run.app) | [Development Build](https://ais-dev-p62wsrlpqzs2ldemu65zhi-461622340415.asia-southeast1.run.app)

---

## 🏆 Submission Summary & User Story Ranking

SmartServe OS satisfies **100% of Platinum Level + Bonus Level User Stories** defined in the VibeAthon6.0 Problem Statement:

| Level | Status | User Story & Features Implemented |
| :--- | :---: | :--- |
| 🥉 **Bronze** | **COMPLETED** | **User Story 1**: Modern, intuitive dual interface for diners & management with interactive 6-Chapter *"From Scan to Serve"* story mode. |
| 🥈 **Silver** | **COMPLETED** | **User Stories 2 & 3**: Email/Password + **Google OAuth** authentication with RBAC. Digitized core workflows: Digital Menu, Live 86 Dish Toggles, Smart Reservations, Order Management, Queue/Waitlist, Billing/Receipts & Customer Notifications. |
| 🥇 **Gold** | **COMPLETED** | **User Story 4**: Management Dashboard covering Orders, Cryptographic Table QR Layout, Inventory Tracking, Staff Roles, Customer CRM, Sales Reports, and Live Operational Analytics. |
| 💎 **Platinum** | **COMPLETED** | **User Story 5**: Intelligent Operations powered by Server-Side **Gemini 2.5 Flash AI** — Personalized Dish Recommendations, Inventory Prediction, Demand Forecasting, Smart Notifications, and Operational Assistant. |
| 🚀 **Bonus** | **COMPLETED** | Cryptographic 256-bit SHA-256 QR Tokens, Server-Side Price Authority, Zero-PII AI Data Sanitization, Default-Deny Firestore Rules, and Automated Vitest Security Test Suite. |

---

## 📐 System Architecture & Data Flow

```
[ Customer QR Code / Mobile Browser ]          [ Staff / Kitchen / Manager Dashboard ]
                 │                                                │
                 │ Bearer Firebase ID Token                       │ Bearer ID Token
                 ▼                                                ▼
  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │                           EXPRESS 5 API GATEWAY (Port 3000)                      │
  ├──────────────────────────────────────────────────────────────────────────────────┤
  │ 🔒 Helmet HTTP Security Headers        🛡️ Express-Rate-Limit (100req/min)         │
  │ 📋 Zod Schema Validation               🔑 Firebase Admin SDK Bearer Auth Token     │
  │ 🔑 Crypto SHA-256 Table Token Match    💰 Server-Side Database Price Recalculation│
  └───────────────────────────────┬──────────────────────────────────────────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
┌───────────────────────────────┐               ┌──────────────────────────────────┐
│   FIRESTORE CLOUD DATABASE    │               │  GOOGLE GEMINI 2.5 FLASH AI SDK  │
├───────────────────────────────┤               ├──────────────────────────────────┤
│ • /users (RBAC Profiles)      │               │ • /api/ai/recommendations        │
│ • /tables (Crypto QR Hashes)  │               │ • PII Sanitized Context Pipeline │
│ • /menuItems (Prices & Stock) │               │ • Inventory & Yield Prediction   │
│ • /orders (Transactional Lock)│               │ • Operational Q&A Assistant      │
│ • /inventory (Raw Ingredients)│               └──────────────────────────────────┘
│ • /auditLogs (Security Stream)│
└───────────────────────────────┘
```

---

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Motion (`motion/react`), Lucide Icons.
- **Backend**: Node.js, Express 5, Firebase Admin SDK, Zod Schema Validation, Helmet, Express Rate Limit.
- **Database & Auth**: Firebase Authentication (**Email/Password & Google OAuth**), Cloud Firestore Database with strict `firestore.rules`.
- **AI Engine**: `@google/genai` (Google Gemini 2.5 Flash) with server-side PII sanitization.
- **Testing**: Vitest integration testing suite (`npm run test`).

---

## 🎯 Detailed User Story Breakdown

### 🥉 Bronze Level — User Experience (User Story 1)
- **Interactive 6-Chapter Story Mode**: Visual step-by-step narrative (*Scan → Select → Kitchen Pass → Floor Route → Manager Analytics → Unified Payoff*) demonstrating how technology eliminates restaurant bottlenecks.
- **Dual-Perspective Navigation**: Seamless toggle between Customer QR Menu and Professional Management Dashboards.
- **Responsive Layout**: Designed desktop-first with full mobile touch-target support (≥44px touch areas).

### 🥈 Silver Level — Authentication & Digital Operations (User Stories 2 & 3)
- **Multi-Method Auth**: Email & Password with error fallback + **Google OAuth Sign-In** via popup integration.
- **Role-Based Access Control (RBAC)**: Strict role separation across `customer`, `staff`, `kitchen`, `manager`, and `admin`.
- **Digital Menu & Live 86 Toggles**: Instant 86ing of sold-out menu items reflected in real-time across customer screens.
- **Smart Reservations & Floor Map**: Table seating layout with status indicators (`available`, `occupied`, `reserved`, `needs_cleaning`).
- **Queue & Order Management**: Real-time order placement and kitchen workflow tracking.
- **Billing & Receipts**: Digital receipt view with itemized tax, tip calculation, and payment confirmation (`cash`, `card`, `qr_pay`).
- **Customer Notifications**: Real-time toast alerts for order status updates (`pending` → `cooking` → `ready` → `served`).

### 🥇 Gold Level — Restaurant Management (User Story 4)
- **Executive Operations Dashboard**: Centralized management interface for daily operations.
- **Orders Kanban**: Multi-column KDS view for Kitchen staff with prep latency timers and overdue alert badges.
- **Cryptographic Table QR Manager**: Generate, display, and regenerate 256-bit cryptographically random table QR tokens.
- **Inventory Tracking**: Stock level monitoring for raw ingredients with reorder alerts (`ok`, `low`, `out_of_stock`).
- **Staff Management & Audit Stream**: Staff assignment log, shift coordination, and real-time security audit trails.
- **Analytics & Revenue Metrics**: Live shift revenue calculation, average ticket times, table turnover rate, and top-selling dishes.

### 💎 Platinum Level — Intelligent Operations (User Story 5)
- **Server-Side Gemini AI Advisory**: Powered by Google Gemini 2.5 Flash (`@google/genai`).
- **Personalized Recommendations**: Smart AI dish pairing suggestions based on customer selections and dietary tags (`vegan`, `gf`, `spicy`).
- **Inventory Prediction & Demand Forecasting**: Predictive stock burn rate analysis based on active shift orders.
- **Operational Q&A Assistant**: Interactive AI assistant for shift managers to query yield optimization, waste reduction, and prep allocation.
- **Zero-PII Data Sanitization**: Customer names, emails, user IDs, and table tokens are stripped before building prompt context.

---

## 🤖 AI Usage & Data Sanitization Pipeline

SmartServe OS integrates Google's Gemini 2.5 Flash model through a secure Express backend endpoint (`/api/ai/recommendations`):

1. **Context Extraction**: The server retrieves current shift sales, menu stock levels, and raw inventory quantities from Firestore.
2. **PII Stripping**: All user identity fields (`fullName`, `email`, `id`, `qrToken`) are scrubbed.
3. **Structured Prompt Construction**: Anonymized aggregated metrics are passed to Gemini to generate actionable operational advice.
4. **Manager Advisory**: The result is returned to authorized `manager` and `admin` roles to optimize prep stations and prevent dish shortages.

---

## 🔐 Security Controls & Protections

- **Server-Side Price Authority**: Canonical dish prices are fetched from Firestore during checkout. Frontend price payloads are ignored.
- **Cryptographic QR Tokens**: Tables use 256-bit crypto tokens (`crypto.randomBytes(32)`). Only SHA-256 hashes are stored in Firestore.
- **Default-Deny Firestore Rules**: Direct client writes to sensitive collections (`orders`, `menuItems`, `tables`, `auditLogs`) are blocked.
- **Zod Schema Validation**: All API request bodies are parsed against strict Zod type constraints.
- **Rate Limiting**: Express endpoints are rate-limited to prevent brute force and DDoS attacks.

---

## 🚀 Local Development & Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/smartserve-os.git
cd smartserve-os
npm install
```

### Step 2: Seed Database
```bash
npx tsx scripts/seed.ts
```

### Step 3: Start Application
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Step 4: Run Test Suite
```bash
npm run test
```

---

## 🔑 Demo Credentials & Role Testing

To test different operational roles in the app:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager@smartserve.os` | `manager123` | Full Management Dashboard, Analytics, AI, Menu & Inventory CRUD |
| **Kitchen** | `kitchen@smartserve.os` | `kitchen123` | Kitchen Display System (KDS), Order Status, 86 Dish Toggles |
| **Staff** | `staff@smartserve.os` | `staff123` | Floor Map, Waiter Call Dismissal, Table Status Updates |
| **Customer**| `customer@smartserve.os`| `customer123`| Digital QR Menu, Cart, Order Placement, Waiter Call |

*Note: You can also click **"Continue with Google OAuth"** or use Instant Demo Session Mode on the login screen.*

---

## 📜 License & Acknowledgments

Built for **VibeAthon6.0 Hackathon (2K26)**. Powered by Google AI Studio, Gemini 2.5 Flash API, React, Node.js, Express, and Firebase.

# Datastraw CRM: Customer Support Ticketing System

A professional, full-stack Customer Support Ticketing System built with **Next.js 16 (App Router)**, **Prisma ORM**, **PostgreSQL (Neon)**, and **Tailwind CSS**. 

This system acts as a central hub for support agents to track, prioritize, and resolve customer issues efficiently, featuring a dual-view Dashboard (List & Kanban), Real-time SLA monitoring, and Global Command Palette navigation.

---

## 🚀 Live Demo

> **Live URL:** [https://customer-support-ticketing-system-l.vercel.app/](https://customer-support-ticketing-system-l.vercel.app/)

**Demo Credentials:**
- **Email:** `demo@datastraw.com`
- **Password:** `password123`

---

## ✨ Key Features

### 1. Dual-View Dashboard 🔀
- **List View:** High-density data table with bulk actions (Update Status/Priority, Delete).
- **Kanban Board:** Drag-and-drop interactive board for visual task management.

### 2. Smart "Zero-Schema" Intelligence 🧠
- **SLA Breach Alerts:** Tickets stuck in the "Open" status for over 12 hours trigger red pulsing visual alerts on the board and in the global Notification Bell.
- **Sentiment Analysis:** Auto-detects customer tone from the ticket description (e.g., Angry 😡, Happy 😊).
- **Infinite Loop Detection:** Flags tickets that are repeatedly reopened to prevent them from getting stuck.

### 3. Global Command Palette ⌨️
- Press `Cmd + K` (Mac) or `Ctrl + K` (Windows) from anywhere in the app to open the floating command palette.
- Instantly search for tickets or execute quick actions without using your mouse.

### 4. Advanced Analytics & Filtering 📊
- Real-time **debounced search** by Ticket ID, Customer Name, Email, or Subject.
- Compounding dropdown filters for Status and Priority.
- Live Data Visualization (Donut & Bar charts) showing database breakdowns.
- One-click **CSV Export** of the current filtered view.

### 5. Seamless Theming 🌓
- Vercel-inspired, production-grade Dark and Light mode.
- System preference detection and manual override via the navigation bar.

---

## 🗄️ Database Schema (PostgreSQL)

The database intentionally avoids over-engineering, using only two core tables linked by a one-to-many relationship:

### `Ticket` Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | String (CUID) | Primary key |
| `ticketId` | String | Unique human-readable ID (e.g. `TKT-123456`) |
| `customerName` | String | |
| `customerEmail` | String | |
| `subject` | String | |
| `description` | String | |
| `status` | String | `Open` / `In Progress` / `Closed` |
| `priority` | String | `Low` / `Medium` / `High` / `Urgent` |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

### `Note` Table (Audit Trail)
| Column | Type | Notes |
|--------|------|-------|
| `id` | String (CUID) | Primary key |
| `text` | String | The content of the note |
| `ticketId` | String | Foreign key → `Ticket` |
| `createdAt` | DateTime | Auto-set |

*(Note: The system automatically injects `[SYSTEM]` notes into the Timeline whenever a Ticket's status or priority changes, providing a perfect audit trail).*

---

## 🔌 REST API Endpoints

All endpoints use `snake_case` JSON responses as per standard API conventions.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | List all tickets (supports `?search=`, `?status=`, `?priority=`) |
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets/:ticketId` | Get single ticket with associated notes |
| `PUT` | `/api/tickets/:ticketId` | Update status/priority, or append a new note |
| `DELETE` | `/api/tickets` | Bulk delete tickets (expects array of `ids`) |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── actions/          # Server actions (auth logic)
│   ├── api/              # REST API routes
│   │   └── tickets/
│   │       ├── route.ts
│   │       └── [ticketId]/route.ts
│   ├── dashboard/        # Main Dashboard Workspace
│   ├── login/            # Minimal Auth Login Page
│   ├── signup/           # Minimal Auth Signup Page
│   ├── tickets/          # Ticket management interfaces
│   │   ├── new/          # Create ticket form
│   │   └── [ticketId]/   # Ticket details and audit timeline
│   ├── globals.css       # Global design tokens and animations
│   ├── layout.tsx        # Root layout with Theme & Auth providers
│   └── page.tsx          # Animated Landing Page
├── components/           # Reusable UI components
│   ├── kanban/           # Drag-and-drop board components
│   ├── Charts.tsx        # Analytics visualizations
│   ├── CommandPalette.tsx# Global shortcut search (Cmd+K)
│   ├── MobileNav.tsx     # Responsive navigation
│   ├── NotificationBell.tsx # SLA breach notifications
│   ├── SearchFilters.tsx # Real-time filtering and CSV export
│   ├── ThemeProvider.tsx # Dark/Light mode provider
│   └── TicketListClient.tsx # Main data table view
└── lib/                  # Utilities
    └── prisma.ts         # Database client singleton
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL database (free tier works perfectly)

### Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/sarv-tech/Customer-Support-Ticketing-System.git
cd Customer-Support-Ticketing-System

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# Create a .env file in the root directory:
DATABASE_URL="your-neon-connection-string"

# 4. Run Database Migrations
npx prisma db push

# 5. Start the Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in!

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4 (Design Tokens)
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & Tailwind
- **Authentication**: Custom cookie-based auth via Server Actions
- **Deployment**: Vercel

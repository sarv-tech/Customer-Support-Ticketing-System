# Datastraw Customer Support CRM

A full-stack Customer Support Ticketing System built with **Next.js 16**, **Prisma ORM**, **PostgreSQL (Neon)**, and **Tailwind CSS**.

## 🚀 Live Demo

> Deployed on Vercel — see submission email for the live URL.

**Demo Credentials:**
- Email: `demo@datastraw.com`
- Password: `password123`

---

## ✨ Features

### Key Features (Assignment Requirements)
| Feature | Description |
|---------|-------------|
| ✅ Create Tickets | Form with Customer Name, Email, Subject, Description, Priority — auto-generates unique Ticket ID |
| ✅ List All Tickets | Dashboard with priority-sorted ticket list, stats cards, and SLA breach indicators |
| ✅ Real-time Search | Debounced search across Ticket ID, Customer Name, Email, and Subject |
| ✅ Filter by Status | Dropdown filters for Status (Open/In Progress/Closed) and Priority |
| ✅ View & Update | Detail page to change Status/Priority and add internal notes |
| ⭐ SLA Breach Alert | Pulsing red badge for Open tickets older than 24 hours (Bonus) |

---

## 🗄️ Database Schema

### `Ticket` Table
| Column | Type | Notes |
|--------|------|-------|
| id | String (CUID) | Primary key |
| ticketId | String | Unique, e.g. `TKT-123456` |
| customerName | String | |
| customerEmail | String | |
| subject | String | |
| description | String | |
| status | String | Open / In Progress / Closed |
| priority | String | Low / Medium / High / Urgent |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

### `Note` Table
| Column | Type | Notes |
|--------|------|-------|
| id | String (CUID) | Primary key |
| text | String | |
| ticketId | String | Foreign key → Ticket |
| createdAt | DateTime | Auto-set |

---

## 🔌 API Endpoints

All endpoints use `snake_case` JSON as required:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | List all tickets (supports `?search=`, `?status=`, `?priority=`) |
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets/:ticketId` | Get single ticket with notes |
| `PUT` | `/api/tickets/:ticketId` | Update status, priority, or add a note |

### POST `/api/tickets` — Request Body
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Cannot login",
  "description": "I am unable to login since yesterday.",
  "priority": "Urgent"
}
```

### PUT `/api/tickets/:ticketId` — Request Body
```json
{
  "status": "In Progress",
  "priority": "High",
  "notes": "Investigating the issue."
}
```

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: Custom cookie-based auth with server actions
- **Deployment**: Vercel

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL database (free tier works)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/sarv-tech/Customer-Support-Ticketing-System.git
cd Customer-Support-Ticketing-System

# 2. Install dependencies
npm install

# 3. Create .env file
echo 'DATABASE_URL="your-neon-connection-string"' > .env

# 4. Run database migrations
npx prisma db push

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the demo credentials above.

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variable: `DATABASE_URL` = your Neon connection string
4. Deploy — Vercel auto-detects Next.js

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/auth.ts       # Sign in / Sign out server actions
│   ├── api/tickets/          # REST API routes
│   ├── login/page.tsx        # Login page
│   ├── tickets/
│   │   ├── new/page.tsx      # Create ticket form
│   │   └── [ticketId]/       # Ticket detail & update
│   ├── globals.css           # Global styles & animations
│   ├── layout.tsx            # Root layout with auth header
│   └── page.tsx              # Dashboard
├── components/
│   └── SearchFilters.tsx     # Real-time search & filter component
└── lib/
    └── prisma.ts             # Prisma singleton client
```

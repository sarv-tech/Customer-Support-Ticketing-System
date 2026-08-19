# Datastraw Support CRM

A fully functional web-based customer support management system built for the Datastraw Technologies assignment.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma
- **Database Provider**: PostgreSQL (Neon)

## Features
- **Dashboard**: View all tickets sorted by priority and date.
- **Search & Filter**: Search by name, email, ID, or description. Filter by Status and Priority.
- **Ticket Creation**: Create new support tickets with priorities (Low, Medium, High, Urgent).
- **Ticket Details**: View detailed ticket information and internal notes.
- **Ticket Updates**: Update ticket status, priority, and add chronological internal notes.
- **SLA Warning**: Tickets that are "Open" for more than 24 hours show an animated SLA Breach badge.

## Getting Started

### 1. Environment Variables
Create a `.env` or `.env.local` file in the root directory and add your Neon PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require&uselibpqcompat=true"
```
*(Note: Appending `&uselibpqcompat=true` prevents harmless but annoying SSL Security warnings in the Next.js console when using Neon.)*

### 2. Database Setup
Push the Prisma schema to your database to create the necessary tables:
```bash
npx prisma db push
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation
- `GET /api/tickets` - List all tickets (supports `?search=`, `?status=`, `?priority=`)
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/[ticketId]` - Get a specific ticket and its notes
- `PUT /api/tickets/[ticketId]` - Update a ticket's status, priority, or add a note

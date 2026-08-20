const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding sample tickets...')

  const result = await prisma.ticket.createMany({
    skipDuplicates: true,
    data: [
      {
        ticketId: 'TKT-100001',
        customerName: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        subject: 'Cannot login to account',
        description:
          'I have been unable to log in to my account for the past 2 days. I keep getting an "invalid credentials" error even though I am sure my password is correct. I have tried resetting it but the reset email never arrives.',
        status: 'Open',
        priority: 'High',
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30h ago — SLA breach
      },
      {
        ticketId: 'TKT-100002',
        customerName: 'Bob Smith',
        customerEmail: 'bob.smith@example.com',
        subject: 'Payment deducted but order still pending',
        description:
          'My payment of $49.99 was deducted from my bank account yesterday at 3pm but my order status still shows as "Pending". Order ID: ORD-887234.',
        status: 'In Progress',
        priority: 'Urgent',
      },
      {
        ticketId: 'TKT-100003',
        customerName: 'Carol Williams',
        customerEmail: 'carol.w@example.com',
        subject: 'Feature request: Dark mode',
        description:
          'I spend a lot of time using the dashboard late at night and a dark mode option would be very helpful. Would love to see this in a future update.',
        status: 'Open',
        priority: 'Low',
      },
      {
        ticketId: 'TKT-100004',
        customerName: 'David Lee',
        customerEmail: 'david.lee@example.com',
        subject: 'Export to CSV not working on Firefox',
        description:
          'When I click the "Export to CSV" button on Firefox 124, nothing happens. No download starts, no error shown. Works fine in Chrome.',
        status: 'Closed',
        priority: 'Medium',
      },
      {
        ticketId: 'TKT-100005',
        customerName: 'Emma Davis',
        customerEmail: 'emma.d@example.com',
        subject: 'Incorrect invoice amount',
        description:
          'My invoice for March shows $120 but I should have been billed $99 per my subscription plan. Please review and issue a corrected invoice.',
        status: 'Open',
        priority: 'High',
      },
    ],
  })

  console.log(`✅ Created ${result.count} sample ticket(s).`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

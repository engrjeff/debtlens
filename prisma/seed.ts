import { prisma } from "@/db/prisma"
import "dotenv/config"

const today = new Date()
function nextMonthDay(day: number): Date {
  return new Date(today.getFullYear(), today.getMonth() + 1, day)
}

async function main() {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "jeffsegoviadev@gmail.com" },
  })

  // Clear existing seed data for idempotency
  await prisma.payment.deleteMany({ where: { userId: user.id } })
  await prisma.obligation.deleteMany({ where: { userId: user.id } })

  // ─────────────────────────────────────────────
  // BILLS
  // ─────────────────────────────────────────────
  const bills = [
    {
      name: "Toyota Veloz",
      category: "Rent",
      amount: 18000,
      recurrence: "MONTHLY" as const,
      dueDay: 5,
      nextDueDate: nextMonthDay(5),
      totalAmount: 18000,
      remainingBalance: 18000,
    },
  ]

  // ─────────────────────────────────────────────
  // LOANS
  // ─────────────────────────────────────────────
  const loans = [
    {
      name: "Pag-IBIG Housing Loan",
      category: "Housing Loan",
      amount: 8500,
      recurrence: "MONTHLY" as const,
      dueDay: 15,
      nextDueDate: nextMonthDay(15),
      totalAmount: 2_040_000,
      remainingBalance: 1_530_000,
      interestRate: 6.375,
    },
  ]

  for (const bill of bills) {
    await prisma.obligation.create({
      data: {
        userId: user.id,
        type: "BILL",
        name: bill.name,
        category: bill.category,
        amount: bill.amount,
        recurrence: bill.recurrence,
        dueDay: bill.dueDay,
        nextDueDate: bill.nextDueDate,
        totalAmount: bill.totalAmount,
        remainingBalance: bill.remainingBalance,
      },
    })
  }

  for (const loan of loans) {
    await prisma.obligation.create({
      data: {
        userId: user.id,
        type: "LOAN",
        name: loan.name,
        category: loan.category,
        amount: loan.amount,
        recurrence: loan.recurrence,
        dueDay: loan.dueDay,
        nextDueDate: loan.nextDueDate,
        totalAmount: loan.totalAmount,
        remainingBalance: loan.remainingBalance,
        interestRate: loan.interestRate,
      },
    })
  }

  const count = await prisma.obligation.count({ where: { userId: user.id } })
  console.log(
    `✓ Seeded ${count} obligations (${bills.length} bills, ${loans.length} loans) for ${user.email}`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

import "dotenv/config"
import { prisma } from "@/db/prisma"

const today = new Date()
function nextMonthDay(day: number): Date {
  return new Date(today.getFullYear(), today.getMonth() + 1, day)
}
function daysFromNow(days: number): Date {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d
}

async function main() {
  const user = await prisma.user.findFirstOrThrow()

  // Clear existing seed data for idempotency
  await prisma.payment.deleteMany({ where: { userId: user.id } })
  await prisma.obligation.deleteMany({ where: { userId: user.id } })

  // ─────────────────────────────────────────────
  // BILLS
  // ─────────────────────────────────────────────
  const bills = [
    // Housing
    {
      name: "Condo Unit Rent",
      category: "Rent",
      amount: 18000,
      recurrence: "MONTHLY" as const,
      dueDay: 5,
      nextDueDate: nextMonthDay(5),
      totalAmount: 18000,
      remainingBalance: 18000,
    },
    {
      name: "HOA Dues – Avida Towers",
      category: "Association Dues",
      amount: 2500,
      recurrence: "MONTHLY" as const,
      dueDay: 10,
      nextDueDate: nextMonthDay(10),
      totalAmount: 2500,
      remainingBalance: 2500,
    },
    // Utilities
    {
      name: "Meralco Electric Bill",
      category: "Electricity",
      amount: 3200,
      recurrence: "MONTHLY" as const,
      dueDay: 20,
      nextDueDate: nextMonthDay(20),
      totalAmount: 3200,
      remainingBalance: 3200,
    },
    {
      name: "Manila Water",
      category: "Water",
      amount: 650,
      recurrence: "MONTHLY" as const,
      dueDay: 15,
      nextDueDate: nextMonthDay(15),
      totalAmount: 650,
      remainingBalance: 650,
    },
    {
      name: "PLDT Fiber Home",
      category: "Internet",
      amount: 1699,
      recurrence: "MONTHLY" as const,
      dueDay: 12,
      nextDueDate: nextMonthDay(12),
      totalAmount: 1699,
      remainingBalance: 1699,
    },
    {
      name: "Globe Postpaid Plan",
      category: "Mobile Plan",
      amount: 1299,
      recurrence: "MONTHLY" as const,
      dueDay: 8,
      nextDueDate: nextMonthDay(8),
      totalAmount: 1299,
      remainingBalance: 1299,
    },
    {
      name: "Cignal TV",
      category: "Cable / TV",
      amount: 690,
      recurrence: "MONTHLY" as const,
      dueDay: 18,
      nextDueDate: nextMonthDay(18),
      totalAmount: 690,
      remainingBalance: 690,
    },
    {
      name: "LPG Tank Refill – Gasul",
      category: "Gas / LPG",
      amount: 900,
      recurrence: "MONTHLY" as const,
      dueDay: 25,
      nextDueDate: nextMonthDay(25),
      totalAmount: 900,
      remainingBalance: 900,
    },
    // Lifestyle
    {
      name: "Netflix",
      category: "Subscription",
      amount: 549,
      recurrence: "MONTHLY" as const,
      dueDay: 1,
      nextDueDate: nextMonthDay(1),
      totalAmount: 549,
      remainingBalance: 549,
    },
    {
      name: "Spotify Premium",
      category: "Subscription",
      amount: 179,
      recurrence: "MONTHLY" as const,
      dueDay: 3,
      nextDueDate: nextMonthDay(3),
      totalAmount: 179,
      remainingBalance: 179,
    },
    {
      name: "Anytime Fitness Membership",
      category: "Gym Membership",
      amount: 1500,
      recurrence: "MONTHLY" as const,
      dueDay: 1,
      nextDueDate: nextMonthDay(1),
      totalAmount: 1500,
      remainingBalance: 1500,
    },
    {
      name: "Philhealth Contribution",
      category: "Healthcare / Insurance",
      amount: 500,
      recurrence: "MONTHLY" as const,
      dueDay: 15,
      nextDueDate: nextMonthDay(15),
      totalAmount: 500,
      remainingBalance: 500,
    },
    // Transport
    {
      name: "Shell Fuel (weekly fill-up)",
      category: "Fuel",
      amount: 1800,
      recurrence: "WEEKLY" as const,
      dueDay: 1,
      nextDueDate: daysFromNow(7),
      totalAmount: 1800,
      remainingBalance: 1800,
    },
    {
      name: "NLEX / SLEX Toll",
      category: "Toll Fees",
      amount: 600,
      recurrence: "MONTHLY" as const,
      dueDay: 28,
      nextDueDate: nextMonthDay(28),
      totalAmount: 600,
      remainingBalance: 600,
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
    {
      name: "Toyota Vios Car Loan – BPI",
      category: "Car Loan",
      amount: 12_800,
      recurrence: "MONTHLY" as const,
      dueDay: 20,
      nextDueDate: nextMonthDay(20),
      totalAmount: 768_000,
      remainingBalance: 460_800,
      interestRate: 8.5,
    },
    {
      name: "BDO Personal Loan",
      category: "Personal Loan",
      amount: 5_000,
      recurrence: "MONTHLY" as const,
      dueDay: 10,
      nextDueDate: nextMonthDay(10),
      totalAmount: 120_000,
      remainingBalance: 80_000,
      interestRate: 26.0,
    },
    {
      name: "BPI Credit Card",
      category: "Credit Card",
      amount: 3_500,
      recurrence: "MONTHLY" as const,
      dueDay: 22,
      nextDueDate: nextMonthDay(22),
      totalAmount: 45_000,
      remainingBalance: 38_250,
      interestRate: 24.0,
    },
    {
      name: "Home Depot Lazada Installment",
      category: "Installment Purchase",
      amount: 2_200,
      recurrence: "MONTHLY" as const,
      dueDay: 5,
      nextDueDate: nextMonthDay(5),
      totalAmount: 26_400,
      remainingBalance: 17_600,
      interestRate: 0,
    },
    {
      name: "SSS Salary Loan",
      category: "Salary Loan",
      amount: 1_000,
      recurrence: "MONTHLY" as const,
      dueDay: 15,
      nextDueDate: nextMonthDay(15),
      totalAmount: 24_000,
      remainingBalance: 18_000,
      interestRate: 10.0,
    },
    {
      name: "Honda Beat Motorcycle Loan",
      category: "Motorcycle Loan",
      amount: 2_800,
      recurrence: "MONTHLY" as const,
      dueDay: 7,
      nextDueDate: nextMonthDay(7),
      totalAmount: 89_000,
      remainingBalance: 44_500,
      interestRate: 15.0,
    },
    {
      name: "Borrowed from Ate – Medical",
      category: "Borrowed from Family",
      amount: 2_000,
      recurrence: "MONTHLY" as const,
      dueDay: 1,
      nextDueDate: nextMonthDay(1),
      totalAmount: 30_000,
      remainingBalance: 22_000,
      interestRate: 0,
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

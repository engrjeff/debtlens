import "dotenv/config"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { prisma } from "@/db/prisma"

interface PaymentSeed {
  amount: number
  forDueDate: string
  modeOfPayment: string
  notes?: string | null
  paidAt: string
}

interface ObligationSeed {
  name: string
  type: "BILL" | "LOAN"
  amount: number
  recurrence: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY"
  dueDay: number | null
  nextDueDate: string
  totalAmount: number
  remainingBalance: number
  category: string
  interestRate: number | null
  payments: Array<PaymentSeed>
}

async function main() {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "jeffsegoviadev@gmail.com" },
  })

  const obligations: Array<ObligationSeed> = JSON.parse(
    readFileSync(resolve("data/obligations.json"), "utf-8")
  )

  // Clear existing data for idempotency
  await prisma.payment.deleteMany({ where: { userId: user.id } })
  await prisma.obligation.deleteMany({ where: { userId: user.id } })

  let billCount = 0
  let loanCount = 0
  let paymentCount = 0

  for (const o of obligations) {
    const created = await prisma.obligation.create({
      data: {
        userId: user.id,
        type: o.type,
        name: o.name,
        category: o.category,
        amount: o.amount,
        recurrence: o.recurrence,
        dueDay: o.dueDay,
        nextDueDate: new Date(o.nextDueDate),
        totalAmount: o.totalAmount,
        remainingBalance: o.remainingBalance,
        interestRate: o.interestRate,
      },
    })

    if (o.type === "BILL") billCount++
    else loanCount++

    for (const p of o.payments) {
      await prisma.payment.create({
        data: {
          userId: user.id,
          obligationId: created.id,
          amount: p.amount,
          forDueDate: new Date(p.forDueDate),
          modeOfPayment: p.modeOfPayment,
          notes: p.notes ?? undefined,
          paidAt: new Date(p.paidAt),
        },
      })
      paymentCount++
    }
  }

  console.log(
    `✓ Seeded ${obligations.length} obligations (${billCount} bills, ${loanCount} loans) with ${paymentCount} payments for ${user.email}`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

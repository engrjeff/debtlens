-- CreateEnum
CREATE TYPE "ObligationType" AS ENUM ('BILL', 'LOAN');

-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateTable
CREATE TABLE "obligation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ObligationType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "recurrence" "RecurrenceType" NOT NULL,
    "dueDay" INTEGER,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "remainingBalance" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "proofOfPayment" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "obligation_userId_idx" ON "obligation"("userId");

-- CreateIndex
CREATE INDEX "obligation_nextDueDate_idx" ON "obligation"("nextDueDate");

-- CreateIndex
CREATE INDEX "obligation_userId_nextDueDate_idx" ON "obligation"("userId", "nextDueDate");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "payment"("userId");

-- CreateIndex
CREATE INDEX "payment_obligationId_idx" ON "payment"("obligationId");

-- CreateIndex
CREATE INDEX "payment_paidAt_idx" ON "payment"("paidAt");

-- AddForeignKey
ALTER TABLE "obligation" ADD CONSTRAINT "obligation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "obligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

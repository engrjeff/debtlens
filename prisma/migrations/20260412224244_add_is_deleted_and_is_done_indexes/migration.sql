-- AlterTable
ALTER TABLE "obligation" ADD COLUMN     "isDone" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "obligation_isDeleted_idx" ON "obligation"("isDeleted");

-- CreateIndex
CREATE INDEX "obligation_userId_isDeleted_idx" ON "obligation"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "obligation_isDone_idx" ON "obligation"("isDone");

-- CreateIndex
CREATE INDEX "obligation_userId_isDone_idx" ON "obligation"("userId", "isDone");

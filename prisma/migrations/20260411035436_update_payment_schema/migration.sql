/*
  Warnings:

  - Added the required column `forDueDate` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeOfPayment` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "forDueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "modeOfPayment" TEXT NOT NULL;

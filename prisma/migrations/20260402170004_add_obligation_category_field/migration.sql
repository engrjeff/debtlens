/*
  Warnings:

  - Added the required column `category` to the `obligation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "obligation" ADD COLUMN     "category" TEXT NOT NULL;

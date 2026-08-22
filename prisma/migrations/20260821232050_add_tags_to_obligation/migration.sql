-- AlterTable
ALTER TABLE "obligation" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

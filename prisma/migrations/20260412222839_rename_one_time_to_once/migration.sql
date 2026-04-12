/*
  Warnings:

  - The values [ONE_TIME] on the enum `RecurrenceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecurrenceType_new" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');
ALTER TABLE "obligation" ALTER COLUMN "recurrence" TYPE "RecurrenceType_new" USING ("recurrence"::text::"RecurrenceType_new");
ALTER TYPE "RecurrenceType" RENAME TO "RecurrenceType_old";
ALTER TYPE "RecurrenceType_new" RENAME TO "RecurrenceType";
DROP TYPE "public"."RecurrenceType_old";
COMMIT;

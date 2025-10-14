/*
  Warnings:

  - The values [WAITING,CLAIMED] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('PENDING', 'CHATOWNER', 'COMPLETED');
ALTER TABLE "public"."Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TABLE "StatusHistory" ALTER COLUMN "oldStatus" TYPE "ReportStatus_new" USING ("oldStatus"::text::"ReportStatus_new");
ALTER TABLE "StatusHistory" ALTER COLUMN "newStatus" TYPE "ReportStatus_new" USING ("newStatus"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

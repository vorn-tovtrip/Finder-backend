-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "requiredScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalScore" INTEGER NOT NULL DEFAULT 0;

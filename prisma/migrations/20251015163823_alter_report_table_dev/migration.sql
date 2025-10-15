-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "confirmedByClaimer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confirmedByPoster" BOOLEAN NOT NULL DEFAULT false;

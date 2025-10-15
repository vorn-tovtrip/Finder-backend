/*
  Warnings:

  - You are about to drop the column `confirmedByClaimer` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedByPoster` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "confirmedByClaimer",
DROP COLUMN "confirmedByPoster",
ADD COLUMN     "confirmedByClaimerId" INTEGER,
ADD COLUMN     "confirmedByPosterId" INTEGER;

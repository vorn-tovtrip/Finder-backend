-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "reportId" INTEGER;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

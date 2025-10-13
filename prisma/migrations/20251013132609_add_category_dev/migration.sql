-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "ReportCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ReportCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReportCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

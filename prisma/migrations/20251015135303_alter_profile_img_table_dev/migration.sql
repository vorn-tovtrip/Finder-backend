-- CreateTable
CREATE TABLE "UserProfileImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProfileImage" ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

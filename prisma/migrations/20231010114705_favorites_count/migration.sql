-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "favoritesCount" INTEGER NOT NULL DEFAULT 0;

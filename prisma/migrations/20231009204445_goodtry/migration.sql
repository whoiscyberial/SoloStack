/*
  Warnings:

  - You are about to drop the column `tags` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Tool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategoryId` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_userId_fkey";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "tags",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "subcategoryId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Tags";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_favoriteTools" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_favoriteTools_AB_unique" ON "_favoriteTools"("A", "B");

-- CreateIndex
CREATE INDEX "_favoriteTools_B_index" ON "_favoriteTools"("B");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteTools" ADD CONSTRAINT "_favoriteTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteTools" ADD CONSTRAINT "_favoriteTools_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

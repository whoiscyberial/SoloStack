/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Subcategory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Subcategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subcategory" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_slug_key" ON "Subcategory"("slug");

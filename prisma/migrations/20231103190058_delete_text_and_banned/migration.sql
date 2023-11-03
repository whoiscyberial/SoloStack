/*
  Warnings:

  - You are about to drop the column `text` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'BANNED';

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "text";

-- DropTable
DROP TABLE "Post";

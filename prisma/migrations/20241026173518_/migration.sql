/*
  Warnings:

  - You are about to alter the column `document` on the `company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to alter the column `description` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - Added the required column `shortDescription` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ALTER COLUMN "document" SET DATA TYPE VARCHAR(14);

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "shortDescription" TEXT NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2048);

/*
  Warnings:

  - You are about to drop the column `longetude` on the `company` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "longetude",
ADD COLUMN     "longitude" TEXT NOT NULL;

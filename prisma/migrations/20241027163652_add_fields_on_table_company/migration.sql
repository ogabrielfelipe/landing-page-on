/*
  Warnings:

  - Added the required column `contacts` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longetude` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "contacts" VARCHAR(512) NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longetude" TEXT NOT NULL;

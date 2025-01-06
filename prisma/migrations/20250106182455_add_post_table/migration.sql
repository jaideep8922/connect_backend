/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `retailerId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_retailerId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_sellerId_fkey";

-- DropIndex
DROP INDEX "Admin_qrCode_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "qrCode",
DROP COLUMN "retailerId",
DROP COLUMN "sellerId";

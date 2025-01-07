/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_qrCode_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "qrCode";

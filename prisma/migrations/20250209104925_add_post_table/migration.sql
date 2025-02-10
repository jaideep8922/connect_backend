/*
  Warnings:

  - A unique constraint covering the columns `[qrCodeSelf]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "qrCodeSelf" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_qrCodeSelf_key" ON "Seller"("qrCodeSelf");

/*
  Warnings:

  - Added the required column `retailerId` to the `OrderProductDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderProductDetails" ADD COLUMN     "retailerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderProductDetails" ADD CONSTRAINT "OrderProductDetails_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("customId") ON DELETE RESTRICT ON UPDATE CASCADE;

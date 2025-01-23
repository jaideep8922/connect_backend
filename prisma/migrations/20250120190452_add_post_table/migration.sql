/*
  Warnings:

  - You are about to drop the column `retailerId` on the `OrderProductDetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderProductDetails" DROP CONSTRAINT "OrderProductDetails_retailerId_fkey";

-- AlterTable
ALTER TABLE "OrderProductDetails" DROP COLUMN "retailerId";

-- DropForeignKey
ALTER TABLE "Retailer" DROP CONSTRAINT "Retailer_sellerId_fkey";

-- AlterTable
ALTER TABLE "Retailer" ALTER COLUMN "sellerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Retailer" ADD CONSTRAINT "Retailer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("customId") ON DELETE SET NULL ON UPDATE CASCADE;

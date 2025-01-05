-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_retailerId_fkey";

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_sellerId_fkey";

-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "sellerId" DROP NOT NULL,
ALTER COLUMN "retailerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

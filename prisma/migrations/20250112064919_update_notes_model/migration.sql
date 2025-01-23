-- DropForeignKey
ALTER TABLE "ReviewAndRating" DROP CONSTRAINT "ReviewAndRating_orderId_fkey";

-- AlterTable
ALTER TABLE "ReviewAndRating" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ReviewAndRating" ADD CONSTRAINT "ReviewAndRating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "OrderProductDetails" DROP CONSTRAINT "OrderProductDetails_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderProductDetails" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderProductDetails" ADD CONSTRAINT "OrderProductDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `OrderDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderProductDetails" DROP CONSTRAINT "OrderProductDetails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderStatusHistory" DROP CONSTRAINT "OrderStatusHistory_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "orderId" DROP DEFAULT,
ALTER COLUMN "orderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderDetails_orderId_seq";

-- AddForeignKey
ALTER TABLE "OrderProductDetails" ADD CONSTRAINT "OrderProductDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

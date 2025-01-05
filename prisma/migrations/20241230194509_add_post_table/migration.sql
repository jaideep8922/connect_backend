/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_orderId_key" ON "OrderDetails"("orderId");

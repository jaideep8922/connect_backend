/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Retailer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "OrderDetails" (
    "orderId" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "retailerId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "totalItem" INTEGER NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderProductDetails" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Retailer_phone_key" ON "Retailer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_phone_key" ON "Seller"("phone");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProductDetails" ADD CONSTRAINT "OrderProductDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProductDetails" ADD CONSTRAINT "OrderProductDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

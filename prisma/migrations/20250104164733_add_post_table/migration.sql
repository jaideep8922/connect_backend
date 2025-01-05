/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Retailer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qrCode]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderProductDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderStatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Retailer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Retailer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReviewAndRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderProductDetails" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderStatusHistory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Retailer" ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ReviewAndRating" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "retailerId" INTEGER NOT NULL,
    "qrCode" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessOwner" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gstNumber" TEXT NOT NULL,
    "shopMarka" TEXT,
    "transport" TEXT,
    "pincode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerImages" (
    "id" SERIAL NOT NULL,
    "imageLink" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_qrCode_key" ON "Admin"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Retailer_qrCode_key" ON "Retailer"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_qrCode_key" ON "Seller"("qrCode");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerImages" ADD CONSTRAINT "BannerImages_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

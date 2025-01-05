-- CreateTable
CREATE TABLE "ReviewAndRating" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "ratingStars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAndRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "retailerId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewAndRating" ADD CONSTRAINT "ReviewAndRating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "Retailer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

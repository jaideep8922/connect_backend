-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "sellerId" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_phone_key" ON "Guest"("phone");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("customId") ON DELETE SET NULL ON UPDATE CASCADE;

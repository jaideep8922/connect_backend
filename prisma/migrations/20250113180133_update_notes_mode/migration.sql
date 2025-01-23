-- DropForeignKey
ALTER TABLE "BannerImages" DROP CONSTRAINT "BannerImages_sellerId_fkey";

-- AlterTable
ALTER TABLE "BannerImages" ALTER COLUMN "sellerId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "BannerImages" ADD CONSTRAINT "BannerImages_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("customId") ON DELETE RESTRICT ON UPDATE CASCADE;

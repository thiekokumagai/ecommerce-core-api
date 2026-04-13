-- AlterTable

ALTER TABLE "product_items"
ADD COLUMN "price" DECIMAL(10,2),
ADD COLUMN "costPrice" DECIMAL(10,2),
ADD COLUMN "promotionalPrice" DECIMAL(10,2);
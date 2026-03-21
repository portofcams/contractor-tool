-- AlterTable: MaterialCost — add price book fields
ALTER TABLE "MaterialCost" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "MaterialCost" ADD COLUMN "itemType" TEXT NOT NULL DEFAULT 'material';
ALTER TABLE "MaterialCost" ADD COLUMN "wasteFactor" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "MaterialCost" ADD COLUMN "defaultQty" DOUBLE PRECISION;
ALTER TABLE "MaterialCost" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "MaterialCost" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "MaterialCost_contractorId_active_idx" ON "MaterialCost"("contractorId", "active");

-- AlterTable: Quote — add estimate detail fields
ALTER TABLE "Quote" ADD COLUMN "projectName" TEXT;
ALTER TABLE "Quote" ADD COLUMN "address" TEXT;
ALTER TABLE "Quote" ADD COLUMN "sqft" DOUBLE PRECISION;
ALTER TABLE "Quote" ADD COLUMN "notes" TEXT;

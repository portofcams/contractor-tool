-- Add indexes on frequently queried foreign keys and filter columns

CREATE INDEX "Customer_contractorId_idx" ON "Customer"("contractorId");

CREATE INDEX "Quote_contractorId_createdAt_idx" ON "Quote"("contractorId", "createdAt");
CREATE INDEX "Quote_contractorId_status_idx" ON "Quote"("contractorId", "status");
CREATE INDEX "Quote_customerId_idx" ON "Quote"("customerId");

CREATE INDEX "FloorPlan_customerId_idx" ON "FloorPlan"("customerId");

CREATE INDEX "QuoteTemplate_contractorId_idx" ON "QuoteTemplate"("contractorId");

CREATE INDEX "MaterialCost_contractorId_idx" ON "MaterialCost"("contractorId");
CREATE INDEX "MaterialCost_category_idx" ON "MaterialCost"("category");

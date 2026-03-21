CREATE TABLE "PriceHistory" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "materialType" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "source" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PriceHistory_materialType_recordedAt_idx" ON "PriceHistory"("materialType", "recordedAt");

CREATE TABLE "Review" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "contractorId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "quoteId" TEXT NOT NULL,
  "token" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "rating" INTEGER,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Review_token_key" UNIQUE ("token"),
  CONSTRAINT "Review_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE,
  CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id"),
  CONSTRAINT "Review_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE
);
CREATE INDEX "Review_contractorId_idx" ON "Review"("contractorId");
CREATE INDEX "Review_token_idx" ON "Review"("token");

CREATE TABLE "SharedTemplate" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "authorName" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "trade" TEXT NOT NULL,
  "materials" JSONB NOT NULL,
  "markupPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "laborCost" DOUBLE PRECISION,
  "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "description" TEXT,
  "downloads" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SharedTemplate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SharedTemplate_trade_idx" ON "SharedTemplate"("trade");
CREATE INDEX "SharedTemplate_downloads_idx" ON "SharedTemplate"("downloads");

-- Add version field to Quote
ALTER TABLE "Quote" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- Create QuoteRevision table
CREATE TABLE "QuoteRevision" (
  "id" TEXT NOT NULL,
  "quoteId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "materials" JSONB NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "laborCost" DOUBLE PRECISION,
  "markupPercent" DOUBLE PRECISION NOT NULL,
  "taxRate" DOUBLE PRECISION NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,
  "changeNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuoteRevision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QuoteRevision_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "QuoteRevision_quoteId_idx" ON "QuoteRevision"("quoteId");

-- Add publicToken to Quote (nullable first, then populate, then make required)
ALTER TABLE "Quote" ADD COLUMN "publicToken" TEXT;
UPDATE "Quote" SET "publicToken" = gen_random_uuid()::TEXT WHERE "publicToken" IS NULL;
ALTER TABLE "Quote" ALTER COLUMN "publicToken" SET NOT NULL;
ALTER TABLE "Quote" ALTER COLUMN "publicToken" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX "Quote_publicToken_key" ON "Quote"("publicToken");

-- Add signatureData to Quote
ALTER TABLE "Quote" ADD COLUMN "signatureData" TEXT;

-- Add defaultMarkup to Contractor
ALTER TABLE "Contractor" ADD COLUMN "defaultMarkup" DOUBLE PRECISION NOT NULL DEFAULT 50;

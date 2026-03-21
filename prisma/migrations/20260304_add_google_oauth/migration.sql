-- AlterTable: make passwordHash optional and add googleId
ALTER TABLE "Contractor" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "Contractor" ADD COLUMN "googleId" TEXT;
CREATE UNIQUE INDEX "Contractor_googleId_key" ON "Contractor"("googleId");

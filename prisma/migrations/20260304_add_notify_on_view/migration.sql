-- Add notifyOnView preference to Contractor
ALTER TABLE "Contractor" ADD COLUMN "notifyOnView" BOOLEAN NOT NULL DEFAULT true;

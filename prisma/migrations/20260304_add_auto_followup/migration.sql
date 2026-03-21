-- Add auto follow-up fields to Contractor
ALTER TABLE "Contractor" ADD COLUMN "autoFollowUp" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Contractor" ADD COLUMN "followUpSequence" JSONB;

-- Add auto tracking fields to FollowUp
ALTER TABLE "FollowUp" ADD COLUMN "isAuto" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FollowUp" ADD COLUMN "stepIndex" INTEGER;

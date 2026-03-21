-- Migration 004: Project Management Module
-- 8 new tables + 2 ALTER TABLE for projectId on Quote and Job

-- ── Project ──
CREATE TABLE "Project" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "contractorId" TEXT NOT NULL,
  "customerId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "address" TEXT,
  "status" TEXT NOT NULL DEFAULT 'planning',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "startDate" TIMESTAMP(3),
  "estimatedEnd" TIMESTAMP(3),
  "actualEnd" TIMESTAMP(3),
  "budgetEstimated" DOUBLE PRECISION,
  "budgetActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "publicToken" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Project_publicToken_key" UNIQUE ("publicToken"),
  CONSTRAINT "Project_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE,
  CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL
);
CREATE INDEX "Project_contractorId_idx" ON "Project"("contractorId");
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- ── ProjectPhase ──
CREATE TABLE "ProjectPhase" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'not_started',
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "actualStart" TIMESTAMP(3),
  "actualEnd" TIMESTAMP(3),
  "dependsOnId" TEXT,
  "budgetEstimated" DOUBLE PRECISION,
  "budgetActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "color" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectPhase_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProjectPhase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
  CONSTRAINT "ProjectPhase_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL
);
CREATE INDEX "ProjectPhase_projectId_idx" ON "ProjectPhase"("projectId");
CREATE INDEX "ProjectPhase_order_idx" ON "ProjectPhase"("order");

-- ── Subcontractor ──
CREATE TABLE "Subcontractor" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "contractorId" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "trade" TEXT NOT NULL,
  "licenseNumber" TEXT,
  "insuranceExpiry" TIMESTAMP(3),
  "hourlyRate" DOUBLE PRECISION,
  "rating" INTEGER,
  "notes" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subcontractor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Subcontractor_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE
);
CREATE INDEX "Subcontractor_contractorId_idx" ON "Subcontractor"("contractorId");
CREATE INDEX "Subcontractor_trade_idx" ON "Subcontractor"("trade");

-- ── ProjectTask ──
CREATE TABLE "ProjectTask" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "phaseId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'todo',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "assigneeType" TEXT,
  "crewMemberId" TEXT,
  "subcontractorId" TEXT,
  "dueDate" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "estimatedHours" DOUBLE PRECISION,
  "actualHours" DOUBLE PRECISION,
  "estimatedCost" DOUBLE PRECISION,
  "actualCost" DOUBLE PRECISION,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
  CONSTRAINT "ProjectTask_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL,
  CONSTRAINT "ProjectTask_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "CrewMember"("id") ON DELETE SET NULL,
  CONSTRAINT "ProjectTask_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "Subcontractor"("id") ON DELETE SET NULL
);
CREATE INDEX "ProjectTask_projectId_idx" ON "ProjectTask"("projectId");
CREATE INDEX "ProjectTask_phaseId_idx" ON "ProjectTask"("phaseId");
CREATE INDEX "ProjectTask_status_idx" ON "ProjectTask"("status");

-- ── SubcontractorBid ──
CREATE TABLE "SubcontractorBid" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "subcontractorId" TEXT NOT NULL,
  "phaseId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "estimatedDays" INTEGER,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "notes" TEXT,
  CONSTRAINT "SubcontractorBid_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SubcontractorBid_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "Subcontractor"("id") ON DELETE CASCADE,
  CONSTRAINT "SubcontractorBid_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE CASCADE
);
CREATE INDEX "SubcontractorBid_subcontractorId_idx" ON "SubcontractorBid"("subcontractorId");
CREATE INDEX "SubcontractorBid_phaseId_idx" ON "SubcontractorBid"("phaseId");

-- ── DailyLog ──
CREATE TABLE "DailyLog" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "weather" TEXT,
  "temperature" DOUBLE PRECISION,
  "crewOnSite" JSONB,
  "workCompleted" TEXT,
  "issues" TEXT,
  "materialsUsed" JSONB,
  "safetyNotes" TEXT,
  "photos" JSONB,
  "delayReason" TEXT,
  "delayHours" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DailyLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);
CREATE INDEX "DailyLog_projectId_idx" ON "DailyLog"("projectId");
CREATE INDEX "DailyLog_date_idx" ON "DailyLog"("date");

-- ── ChangeOrder ──
CREATE TABLE "ChangeOrder" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "orderNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "reason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'proposed',
  "costImpact" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "daysImpact" INTEGER NOT NULL DEFAULT 0,
  "approvedBy" TEXT,
  "approvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChangeOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ChangeOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);
CREATE INDEX "ChangeOrder_projectId_idx" ON "ChangeOrder"("projectId");
CREATE INDEX "ChangeOrder_status_idx" ON "ChangeOrder"("status");

-- ── ProjectDocument ──
CREATE TABLE "ProjectDocument" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'general',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectDocument_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProjectDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);
CREATE INDEX "ProjectDocument_projectId_idx" ON "ProjectDocument"("projectId");
CREATE INDEX "ProjectDocument_category_idx" ON "ProjectDocument"("category");

-- ── Add projectId to Quote and Job ──
ALTER TABLE "Quote" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL;

ALTER TABLE "Job" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Job" ADD CONSTRAINT "Job_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL;
CREATE INDEX "Job_projectId_idx" ON "Job"("projectId");

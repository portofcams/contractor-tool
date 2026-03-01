-- CreateTable
CREATE TABLE "RoomScan" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "customerId" TEXT,
    "quoteId" TEXT,
    "roomsData" JSONB NOT NULL,
    "surfaceCount" INTEGER NOT NULL DEFAULT 0,
    "scanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "RoomScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePhoto" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "customerId" TEXT,
    "quoteId" TEXT,
    "fileUrl" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SitePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteNote" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "customerId" TEXT,
    "quoteId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomScan_contractorId_idx" ON "RoomScan"("contractorId");
CREATE INDEX "RoomScan_customerId_idx" ON "RoomScan"("customerId");

CREATE INDEX "SitePhoto_contractorId_idx" ON "SitePhoto"("contractorId");
CREATE INDEX "SitePhoto_customerId_idx" ON "SitePhoto"("customerId");
CREATE INDEX "SitePhoto_quoteId_idx" ON "SitePhoto"("quoteId");

CREATE INDEX "SiteNote_contractorId_idx" ON "SiteNote"("contractorId");
CREATE INDEX "SiteNote_customerId_idx" ON "SiteNote"("customerId");
CREATE INDEX "SiteNote_quoteId_idx" ON "SiteNote"("quoteId");

-- AddForeignKey
ALTER TABLE "RoomScan" ADD CONSTRAINT "RoomScan_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoomScan" ADD CONSTRAINT "RoomScan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoomScan" ADD CONSTRAINT "RoomScan_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SitePhoto" ADD CONSTRAINT "SitePhoto_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SitePhoto" ADD CONSTRAINT "SitePhoto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SitePhoto" ADD CONSTRAINT "SitePhoto_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SiteNote" ADD CONSTRAINT "SiteNote_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SiteNote" ADD CONSTRAINT "SiteNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SiteNote" ADD CONSTRAINT "SiteNote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

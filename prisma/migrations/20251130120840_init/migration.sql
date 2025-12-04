-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "niche" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Intake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "rawFaqs" TEXT NOT NULL,
    "rawOffers" TEXT NOT NULL,
    "rawTestimonials" TEXT NOT NULL,
    "rawPromos" TEXT NOT NULL,
    "brandVoiceNotes" TEXT NOT NULL,
    "references" TEXT NOT NULL,
    "assetsFolder" TEXT,
    "brandColors" TEXT,
    "logoUrl" TEXT,
    CONSTRAINT "Intake_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scriptText" TEXT NOT NULL,
    "durationSeconds" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    CONSTRAINT "Script_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Intake_clientId_key" ON "Intake"("clientId");

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
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
    "notes" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentAmount" INTEGER,
    "paymentDate" DATETIME,
    "paymentMethod" TEXT
);
INSERT INTO "new_Client" ("businessName", "contactName", "createdAt", "email", "goals", "id", "niche", "notes", "phone", "tone", "updatedAt", "website") SELECT "businessName", "contactName", "createdAt", "email", "goals", "id", "niche", "notes", "phone", "tone", "updatedAt", "website" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

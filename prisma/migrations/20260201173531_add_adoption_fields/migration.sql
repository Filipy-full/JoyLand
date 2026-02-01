-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adoption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "stripeSessionId" TEXT,
    "giftMessage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'adopted',
    "paymentStatus" TEXT NOT NULL DEFAULT 'completed',
    "certificateUrl" TEXT,
    "certificateCode" TEXT,
    "treeName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Adoption_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adoption" ("createdAt", "endDate", "giftMessage", "id", "startDate", "stripeSessionId", "treeId", "updatedAt", "userId") SELECT "createdAt", "endDate", "giftMessage", "id", "startDate", "stripeSessionId", "treeId", "updatedAt", "userId" FROM "Adoption";
DROP TABLE "Adoption";
ALTER TABLE "new_Adoption" RENAME TO "Adoption";
CREATE UNIQUE INDEX "Adoption_stripeSessionId_key" ON "Adoption"("stripeSessionId");
CREATE UNIQUE INDEX "Adoption_certificateCode_key" ON "Adoption"("certificateCode");
CREATE INDEX "Adoption_userId_idx" ON "Adoption"("userId");
CREATE INDEX "Adoption_treeId_idx" ON "Adoption"("treeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

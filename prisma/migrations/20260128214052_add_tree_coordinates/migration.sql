-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "description" TEXT,
    "yearlyReport" TEXT,
    "images" TEXT,
    "videos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "latitude" REAL,
    "longitude" REAL
);
INSERT INTO "new_Tree" ("createdAt", "description", "id", "images", "latitude", "longitude", "name", "status", "type", "updatedAt", "videos", "yearlyReport") SELECT "createdAt", "description", "id", "images", "latitude", "longitude", "name", "status", "type", "updatedAt", "videos", "yearlyReport" FROM "Tree";
DROP TABLE "Tree";
ALTER TABLE "new_Tree" RENAME TO "Tree";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

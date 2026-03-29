/**
 * Turso DB 초기화 스크립트
 * 실행: npx tsx scripts/setup-turso.ts
 */
import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setup() {
  console.log("📦 Turso 테이블 생성 중...");

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS "Newsletter" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "date" DATETIME NOT NULL,
      "title" TEXT NOT NULL,
      "summary" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "Section" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "newsletterId" INTEGER NOT NULL,
      "category" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      FOREIGN KEY ("newsletterId") REFERENCES "Newsletter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE TABLE IF NOT EXISTS "NewsItem" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "sectionId" INTEGER NOT NULL,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "tags" TEXT NOT NULL DEFAULT '[]',
      "order" INTEGER NOT NULL,
      FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE TABLE IF NOT EXISTS "Source" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "newsItemId" INTEGER NOT NULL,
      "label" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      FOREIGN KEY ("newsItemId") REFERENCES "NewsItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("✅ 테이블 생성 완료:", res.rows.map((r) => r.name).join(", "));
  client.close();
}

setup().catch(console.error);

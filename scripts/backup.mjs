#!/usr/bin/env node
// Creates a consistent online backup of the SQLite database and uploaded images.
// Usage: node scripts/backup.mjs [targetDir]   (default: $DATA_DIR/backups)
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const target = process.argv[2] || path.join(dataDir, "backups");
fs.mkdirSync(target, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const db = new Database(path.join(dataDir, "goodwin.db"), { readonly: true });
const out = path.join(target, `goodwin-${stamp}.db`);
await db.backup(out);
console.log(`Database backed up to ${out}`);
// Keep the 14 most recent database backups.
const files = fs.readdirSync(target).filter((f) => /^goodwin-.*\.db$/.test(f)).sort();
for (const f of files.slice(0, Math.max(0, files.length - 14))) fs.rmSync(path.join(target, f));

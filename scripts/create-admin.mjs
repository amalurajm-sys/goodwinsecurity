#!/usr/bin/env node
// Create or reset an admin user.
// Usage: node scripts/create-admin.mjs <email> [role]   (password is prompted, not passed on the command line)
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";
import readline from "node:readline";

const [email, role = "admin"] = process.argv.slice(2);
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.error("Usage: node scripts/create-admin.mjs <email> [admin|editor]"); process.exit(1); }

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const ask = (q) => new Promise((r) => { process.stdout.write(q); rl.question("", (a) => r(a)); });
rl._writeToOutput = () => {}; // hide typed password
const pw = await ask("Password (12+ chars, letters and numbers): ");
process.stdout.write("\n");
rl.close();
if (pw.length < 12 || !/[a-z]/i.test(pw) || !/\d/.test(pw)) { console.error("Password too weak."); process.exit(1); }

const dir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const file = path.join(dir, "goodwin.db");
if (!fs.existsSync(file)) { console.error(`Database not found at ${file}. Start the site once first so it can create the database.`); process.exit(1); }
const db = new Database(file);
const hash = bcrypt.hashSync(pw, 12);
const r = role === "editor" ? "editor" : "admin";
db.prepare(`INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role`).run(email.toLowerCase(), hash, r);
console.log(`Saved ${r} user ${email.toLowerCase()}.`);

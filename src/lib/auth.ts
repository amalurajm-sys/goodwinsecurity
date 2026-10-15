import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, type Session } from "./session";

export async function getSession(): Promise<Session | null> {
  const s = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s) return null;
  // Make sure the user still exists (e.g. not deleted since login).
  const u = getDb().prepare("SELECT id, email, role FROM admin_users WHERE id = ?").get(s.uid) as { id: number; email: string; role: string } | undefined;
  return u ? { uid: u.id, email: u.email, role: u.role === "admin" ? "admin" : "editor" } : null;
}

export async function requireUser(role?: "admin"): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (role === "admin" && s.role !== "admin") redirect("/admin?denied=1");
  return s;
}

export async function startSession(s: Session) {
  (await cookies()).set(SESSION_COOKIE, await signSession(s), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS,
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "true",
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

let dummyHash = "";
export function hashPassword(pw: string) { return bcrypt.hashSync(pw, 12); }

export function checkCredentials(email: string, password: string): Session | null {
  bootstrapAdmin();
  const u = getDb().prepare("SELECT * FROM admin_users WHERE email = ?").get(email.toLowerCase().trim()) as
    { id: number; email: string; password_hash: string; role: string } | undefined;
  // Compare against a dummy hash when the user doesn't exist to keep timing uniform.
  if (!dummyHash) dummyHash = bcrypt.hashSync("not-a-real-password", 12);
  const ok = bcrypt.compareSync(password, u?.password_hash ?? dummyHash);
  return u && ok ? { uid: u.id, email: u.email, role: u.role === "admin" ? "admin" : "editor" } : null;
}

export function passwordProblem(pw: string): string | null {
  if (pw.length < 12) return "Password must be at least 12 characters.";
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return "Password must contain letters and numbers.";
  return null;
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no users exist yet. */
export function bootstrapAdmin() {
  const db = getDb();
  const n = (db.prepare("SELECT COUNT(*) AS n FROM admin_users").get() as { n: number }).n;
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const pw = process.env.ADMIN_PASSWORD;
  if (n === 0 && email && pw && !passwordProblem(pw)) {
    db.prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, 'admin')").run(email, hashPassword(pw));
    console.log(`[auth] Created initial admin user ${email}. Remove ADMIN_PASSWORD from the environment now.`);
  }
}

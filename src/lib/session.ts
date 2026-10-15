// Edge-safe session helpers (used by middleware and server code).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "gw_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type Session = { uid: number; email: string; role: "admin" | "editor" };

function key(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(s);
}

export async function signSession(s: Session): Promise<string> {
  return new SignJWT({ ...s }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(key());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (typeof payload.uid !== "number" || typeof payload.email !== "string") return null;
    return { uid: payload.uid, email: payload.email, role: payload.role === "admin" ? "admin" : "editor" };
  } catch {
    return null;
  }
}

import "server-only";
import { headers } from "next/headers";

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/** Simple fixed-window in-memory limiter (single-instance deployment). */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return true; }
  b.count++;
  return b.count <= limit;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

/** Rejects cross-site POSTs: Origin (or Referer) must match the request host. */
export async function sameOrigin(): Promise<boolean> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const origin = h.get("origin") || h.get("referer");
  if (!host || !origin) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

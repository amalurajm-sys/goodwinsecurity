import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";
import { MIME_BY_EXT } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const m = /^[a-z0-9-]+\.(jpg|png|webp)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": MIME_BY_EXT[m[1]], "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

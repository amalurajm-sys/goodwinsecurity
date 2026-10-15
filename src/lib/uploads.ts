import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { UPLOAD_DIR } from "./db";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { ext: "webp", magic: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
};
export const MIME_BY_EXT: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/**
 * Validates and stores an uploaded image. Returns its public path (/uploads/...),
 * "" when no file was provided, or throws with a user-facing message.
 * SVG is intentionally not accepted (it can carry scripts).
 */
export async function saveImage(file: FormDataEntryValue | null): Promise<string> {
  if (!file || typeof file === "string" || file.size === 0) return "";
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than 5 MB.");
  const t = TYPES[file.type];
  if (!t) throw new Error("Only JPG, PNG or WebP images are allowed.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (!t.magic(buf)) throw new Error("The file does not look like a valid image.");
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(8).toString("hex")}.${t.ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf, { mode: 0o644 });
  return `/uploads/${name}`;
}

export async function deleteImage(p: string) {
  const m = /^\/uploads\/([a-z0-9-]+\.(jpg|png|webp))$/.exec(p || "");
  if (m) await fs.rm(path.join(UPLOAD_DIR, m[1]), { force: true });
}

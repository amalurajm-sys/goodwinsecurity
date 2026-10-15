import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "@/lib/db";
import { enquirySchema } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rateLimit";
import { getProductById, getSettings } from "@/lib/queries";
import { sendMail } from "@/lib/mail";
import { ENQUIRY_TYPES, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

function newRef(): string {
  const d = new Date();
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  return `GW-${ymd}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req: Request) {
  if (!(await sameOrigin())) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const ip = await clientIp();
  if (!rateLimit(`enq:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes, or contact us directly." }, { status: 429 });
  }

  let body: unknown;
  try {
    if (Number(req.headers.get("content-length") || 0) > 20_000) throw new Error("too large");
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    // Bot traps: respond generically.
    if (fields.website || fields.started) return NextResponse.json({ error: "Submission could not be accepted." }, { status: 400 });
    return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 422 });
  }
  const v = parsed.data;

  // Submitted faster than a human could fill the form → treat as bot.
  if (Date.now() - v.started < 3000) return NextResponse.json({ error: "Submission could not be accepted." }, { status: 400 });

  const product = v.product_id ? getProductById(v.product_id) : null;
  const productLabel = product ? `${product.name}${product.model ? ` (${product.model})` : ""}` : v.item;
  const ref = newRef();

  const db = getDb();
  const info = db.prepare(`INSERT INTO enquiries
    (ref, type, name, company, email, phone, preferred_contact, property_type, product_id, product_label, service, quantity, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    ref, v.type, v.name, v.company, v.email, v.phone, v.preferred_contact, v.property_type,
    product?.id ?? null, productLabel, v.service, typeof v.quantity === "number" ? v.quantity : null, v.message,
  );

  const s = getSettings();
  const to = s.notify_email || process.env.ENQUIRY_NOTIFY_EMAIL || "";
  const typeLabel = ENQUIRY_TYPES.find((t) => t.value === v.type)?.label ?? v.type;
  const lines: string[] = [`New enquiry ${ref} received via ${SITE_URL}`, "", `Type: ${typeLabel}`, `Name: ${v.name}`];
  if (v.company) lines.push(`Company: ${v.company}`);
  lines.push(`Email: ${v.email}`, `Phone: ${v.phone}`, `Preferred contact: ${v.preferred_contact}`);
  if (v.property_type) lines.push(`Property type: ${v.property_type}`);
  if (productLabel) lines.push(`Product: ${productLabel}`);
  if (v.service) lines.push(`Service: ${v.service}`);
  if (typeof v.quantity === "number") lines.push(`Quantity: ${v.quantity}`);
  lines.push("", "Message:", v.message, "", `Manage: ${SITE_URL}/admin/enquiries/${info.lastInsertRowid}`);
  const text = lines.join("\n");

  const sent = await sendMail({ to, subject: `[Website enquiry] ${ref} – ${typeLabel} – ${v.name}`, text, replyTo: v.email });
  if (sent) db.prepare("UPDATE enquiries SET email_sent = 1 WHERE id = ?").run(info.lastInsertRowid);

  return NextResponse.json({ ok: true, ref });
}

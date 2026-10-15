import "server-only";
import { getDb } from "./db";

export type Category = { id: number; slug: string; name: string; description: string; sort: number; count?: number };
export type Brand = { id: number; slug: string; name: string; description: string; website: string; logo_path: string; featured: number; sort: number };
export type Spec = { label: string; value: string };
export type Product = {
  id: number; slug: string; name: string; model: string; sku: string;
  category_id: number | null; brand_id: number | null;
  category_name: string | null; category_slug: string | null;
  brand_name: string | null; brand_slug: string | null;
  summary: string; description: string; specs: Spec[];
  compatibility: string; accessories: string; image_path: string;
  featured: number; published: number; is_sample: number;
};
export type Service = { id: number; slug: string; title: string; summary: string; description: string; benefits: string[]; icon: string; image_path: string; sort: number; published: number };
export type Project = { id: number; slug: string; title: string; category: string; location: string; description: string; systems: string; cover_path: string; published: number; is_sample: number; created_at: string };
export type ProjectImage = { id: number; project_id: number; path: string; caption: string; sort: number };
export type Enquiry = {
  id: number; ref: string; type: string; name: string; company: string; email: string; phone: string;
  preferred_contact: string; property_type: string; product_id: number | null; product_label: string;
  service: string; quantity: number | null; message: string; status: string; notes: string;
  email_sent: number; created_at: string; updated_at: string;
};

function parseJson<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

/* ---------- settings ---------- */
export function getSettings(): Record<string, string> {
  const rows = getDb().prepare("SELECT key, value FROM settings WHERE key NOT LIKE '\\_\\_%' ESCAPE '\\'").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/* ---------- catalogue ---------- */
export function getCategories(): Category[] {
  return getDb().prepare(`SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.published = 1) AS count
    FROM categories c ORDER BY c.sort, c.name`).all() as Category[];
}
export function getBrands(): Brand[] {
  return getDb().prepare("SELECT * FROM brands ORDER BY sort, name").all() as Brand[];
}

const PRODUCT_SELECT = `SELECT p.*, c.name AS category_name, c.slug AS category_slug, b.name AS brand_name, b.slug AS brand_slug
  FROM products p LEFT JOIN categories c ON c.id = p.category_id LEFT JOIN brands b ON b.id = p.brand_id`;

function toProduct(r: Record<string, unknown>): Product {
  return { ...(r as unknown as Product), specs: parseJson<Spec[]>(r.specs as string, []) };
}

export function searchProducts(opts: { q?: string; category?: string; brand?: string; includeUnpublished?: boolean }): Product[] {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (!opts.includeUnpublished) where.push("p.published = 1");
  if (opts.category) { where.push("c.slug = ?"); params.push(opts.category); }
  if (opts.brand) { where.push("b.slug = ?"); params.push(opts.brand); }
  if (opts.q) {
    const like = `%${opts.q.replace(/[%_\\]/g, (m) => "\\" + m)}%`;
    where.push("(p.name LIKE ? ESCAPE '\\' OR p.model LIKE ? ESCAPE '\\' OR p.sku LIKE ? ESCAPE '\\' OR p.summary LIKE ? ESCAPE '\\')");
    params.push(like, like, like, like);
  }
  const sql = `${PRODUCT_SELECT} ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY p.featured DESC, c.sort, p.name`;
  return (getDb().prepare(sql).all(...params) as Record<string, unknown>[]).map(toProduct);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return (getDb().prepare(`${PRODUCT_SELECT} WHERE p.published = 1 AND p.featured = 1 ORDER BY p.name LIMIT ?`).all(limit) as Record<string, unknown>[]).map(toProduct);
}

export function getProductBySlug(slug: string, includeUnpublished = false): Product | null {
  const r = getDb().prepare(`${PRODUCT_SELECT} WHERE p.slug = ? ${includeUnpublished ? "" : "AND p.published = 1"}`).get(slug) as Record<string, unknown> | undefined;
  return r ? toProduct(r) : null;
}
export function getProductById(id: number): Product | null {
  const r = getDb().prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(id) as Record<string, unknown> | undefined;
  return r ? toProduct(r) : null;
}
export function getRelatedProducts(p: Product, limit = 3): Product[] {
  return (getDb().prepare(`${PRODUCT_SELECT} WHERE p.published = 1 AND p.category_id = ? AND p.id != ? LIMIT ?`).all(p.category_id, p.id, limit) as Record<string, unknown>[]).map(toProduct);
}

/* ---------- services ---------- */
function toService(r: Record<string, unknown>): Service {
  return { ...(r as unknown as Service), benefits: parseJson<string[]>(r.benefits as string, []) };
}
export function getServices(includeUnpublished = false): Service[] {
  return (getDb().prepare(`SELECT * FROM services ${includeUnpublished ? "" : "WHERE published = 1"} ORDER BY sort, title`).all() as Record<string, unknown>[]).map(toService);
}
export function getServiceById(id: number): Service | null {
  const r = getDb().prepare("SELECT * FROM services WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return r ? toService(r) : null;
}

/* ---------- projects ---------- */
export function getProjects(includeUnpublished = false): Project[] {
  return getDb().prepare(`SELECT * FROM projects ${includeUnpublished ? "" : "WHERE published = 1"} ORDER BY is_sample, created_at DESC`).all() as Project[];
}
export function getProjectBySlug(slug: string, includeUnpublished = false): Project | null {
  return (getDb().prepare(`SELECT * FROM projects WHERE slug = ? ${includeUnpublished ? "" : "AND published = 1"}`).get(slug) as Project) ?? null;
}
export function getProjectById(id: number): Project | null {
  return (getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project) ?? null;
}
export function getProjectImages(projectId: number): ProjectImage[] {
  return getDb().prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort, id").all(projectId) as ProjectImage[];
}

/* ---------- enquiries ---------- */
export const ENQUIRY_STATUSES = ["New", "Contacted", "Quotation Sent", "Won", "Closed"] as const;

export function getEnquiries(status?: string): Enquiry[] {
  if (status) return getDb().prepare("SELECT * FROM enquiries WHERE status = ? ORDER BY id DESC").all(status) as Enquiry[];
  return getDb().prepare("SELECT * FROM enquiries ORDER BY id DESC").all() as Enquiry[];
}
export function getEnquiryById(id: number): Enquiry | null {
  return (getDb().prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Enquiry) ?? null;
}
export function enquiryCounts(): Record<string, number> {
  const rows = getDb().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as { status: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

/* ---------- SEO ---------- */
export function getPageSeo(path: string): { title: string; description: string } | null {
  const r = getDb().prepare("SELECT title, description FROM page_seo WHERE path = ?").get(path) as { title: string; description: string } | undefined;
  if (!r || (!r.title && !r.description)) return null;
  return r;
}
export function getAllPageSeo(): { path: string; title: string; description: string }[] {
  return getDb().prepare("SELECT * FROM page_seo ORDER BY path").all() as { path: string; title: string; description: string }[];
}

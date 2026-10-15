"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { checkCredentials, endSession, hashPassword, passwordProblem, requireUser, startSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { deleteImage, saveImage } from "@/lib/uploads";
import { ENQUIRY_STATUSES } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/seed";

/* ---------- helpers ---------- */
const str = (fd: FormData, k: string, max = 5000) => String(fd.get(k) ?? "").trim().slice(0, max);
const num = (fd: FormData, k: string) => { const n = Number(fd.get(k)); return Number.isInteger(n) ? n : null; };
const bool = (fd: FormData, k: string) => (fd.get(k) === "on" || fd.get(k) === "1" ? 1 : 0);
const enc = encodeURIComponent;

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80) || "item";
}
function uniqueSlug(table: "products" | "categories" | "brands" | "services" | "projects", base: string, id?: number | null): string {
  const db = getDb();
  let slug = slugify(base); let i = 2;
  while (db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`).get(slug, id ?? -1)) slug = `${slugify(base)}-${i++}`;
  return slug;
}
function fail(path: string, msg: string): never { redirect(`${path}${path.includes("?") ? "&" : "?"}error=${enc(msg)}`); }
function refreshSite() { revalidatePath("/", "layout"); }

/* ---------- auth ---------- */
export async function loginAction(fd: FormData) {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000)) fail("/admin/login", "Too many attempts. Please wait 15 minutes.");
  const s = checkCredentials(str(fd, "email", 200), String(fd.get("password") ?? "").slice(0, 200));
  if (!s) fail("/admin/login", "Incorrect email or password.");
  await startSession(s);
  redirect("/admin");
}
export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/* ---------- enquiries ---------- */
export async function updateEnquiryAction(fd: FormData) {
  await requireUser();
  const id = num(fd, "id"); const status = str(fd, "status", 40);
  if (!id || !(ENQUIRY_STATUSES as readonly string[]).includes(status)) fail("/admin/enquiries", "Invalid update.");
  getDb().prepare("UPDATE enquiries SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?").run(status, str(fd, "notes", 5000), id);
  redirect(`/admin/enquiries/${id}?saved=1`);
}
export async function deleteEnquiryAction(fd: FormData) {
  await requireUser("admin");
  getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(num(fd, "id"));
  redirect("/admin/enquiries?saved=1");
}

/* ---------- products ---------- */
function parseSpecs(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 60).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim().slice(0, 80), value: l.slice(i + 1).trim().slice(0, 300) } : { label: l.slice(0, 80), value: "" };
  });
}
export async function saveProductAction(fd: FormData) {
  await requireUser();
  const db = getDb();
  const id = num(fd, "id");
  const back = id ? `/admin/products/${id}` : "/admin/products/new";
  const name = str(fd, "name", 200);
  if (name.length < 2) fail(back, "Name is required.");
  let image = id ? (db.prepare("SELECT image_path FROM products WHERE id = ?").get(id) as { image_path: string } | undefined)?.image_path ?? "" : "";
  try {
    const up = await saveImage(fd.get("image"));
    if (up) { if (image) await deleteImage(image); image = up; }
  } catch (e) { fail(back, (e as Error).message); }
  if (fd.get("remove_image") === "on") { await deleteImage(image); image = ""; }
  if (!image) image = str(fd, "placeholder", 30) ? `icon:${str(fd, "placeholder", 30)}` : "";

  const vals = {
    slug: uniqueSlug("products", str(fd, "slug", 80) || name, id), name, model: str(fd, "model", 120), sku: str(fd, "sku", 120),
    category_id: num(fd, "category_id") || null, brand_id: num(fd, "brand_id") || null,
    summary: str(fd, "summary", 400), description: str(fd, "description", 5000), specs: JSON.stringify(parseSpecs(str(fd, "specs", 10000))),
    compatibility: str(fd, "compatibility", 2000), accessories: str(fd, "accessories", 2000), image_path: image,
    featured: bool(fd, "featured"), published: bool(fd, "published"), is_sample: bool(fd, "is_sample"),
  };
  let newId = id;
  if (id) {
    db.prepare(`UPDATE products SET slug=@slug, name=@name, model=@model, sku=@sku, category_id=@category_id, brand_id=@brand_id, summary=@summary,
      description=@description, specs=@specs, compatibility=@compatibility, accessories=@accessories, image_path=@image_path, featured=@featured,
      published=@published, is_sample=@is_sample, updated_at=datetime('now') WHERE id=@id`).run({ ...vals, id });
  } else {
    newId = Number(db.prepare(`INSERT INTO products (slug, name, model, sku, category_id, brand_id, summary, description, specs, compatibility, accessories,
      image_path, featured, published, is_sample) VALUES (@slug, @name, @model, @sku, @category_id, @brand_id, @summary, @description, @specs, @compatibility,
      @accessories, @image_path, @featured, @published, @is_sample)`).run(vals).lastInsertRowid);
  }
  refreshSite();
  redirect(`/admin/products/${newId}?saved=1`);
}
export async function deleteProductAction(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const r = getDb().prepare("SELECT image_path FROM products WHERE id = ?").get(id) as { image_path: string } | undefined;
  if (r) await deleteImage(r.image_path);
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  refreshSite();
  redirect("/admin/products?saved=1");
}

/* ---------- categories & brands ---------- */
export async function saveCategoryAction(fd: FormData) {
  await requireUser();
  const id = num(fd, "id"); const name = str(fd, "name", 120);
  if (name.length < 2) fail("/admin/categories", "Category name is required.");
  const v = { name, description: str(fd, "description", 500), sort: num(fd, "sort") ?? 0, slug: uniqueSlug("categories", str(fd, "slug", 80) || name, id) };
  if (id) getDb().prepare("UPDATE categories SET name=@name, description=@description, sort=@sort, slug=@slug WHERE id=@id").run({ ...v, id });
  else getDb().prepare("INSERT INTO categories (name, description, sort, slug) VALUES (@name, @description, @sort, @slug)").run(v);
  refreshSite();
  redirect("/admin/categories?saved=1");
}
export async function deleteCategoryAction(fd: FormData) {
  await requireUser();
  getDb().prepare("DELETE FROM categories WHERE id = ?").run(num(fd, "id"));
  refreshSite();
  redirect("/admin/categories?saved=1");
}
export async function saveBrandAction(fd: FormData) {
  await requireUser();
  const db = getDb();
  const id = num(fd, "id"); const name = str(fd, "name", 120);
  if (name.length < 2) fail("/admin/brands", "Brand name is required.");
  const website = str(fd, "website", 300);
  if (website && !/^https:\/\//.test(website)) fail("/admin/brands", "Website must start with https://");
  let logo = id ? (db.prepare("SELECT logo_path FROM brands WHERE id = ?").get(id) as { logo_path: string } | undefined)?.logo_path ?? "" : "";
  try { const up = await saveImage(fd.get("logo")); if (up) { await deleteImage(logo); logo = up; } } catch (e) { fail("/admin/brands", (e as Error).message); }
  if (fd.get("remove_logo") === "on") { await deleteImage(logo); logo = ""; }
  const v = { name, description: str(fd, "description", 500), website, logo_path: logo, featured: bool(fd, "featured"), sort: num(fd, "sort") ?? 0, slug: uniqueSlug("brands", str(fd, "slug", 80) || name, id) };
  if (id) db.prepare("UPDATE brands SET name=@name, description=@description, website=@website, logo_path=@logo_path, featured=@featured, sort=@sort, slug=@slug WHERE id=@id").run({ ...v, id });
  else db.prepare("INSERT INTO brands (name, description, website, logo_path, featured, sort, slug) VALUES (@name, @description, @website, @logo_path, @featured, @sort, @slug)").run(v);
  refreshSite();
  redirect("/admin/brands?saved=1");
}
export async function deleteBrandAction(fd: FormData) {
  await requireUser();
  const r = getDb().prepare("SELECT logo_path FROM brands WHERE id = ?").get(num(fd, "id")) as { logo_path: string } | undefined;
  if (r) await deleteImage(r.logo_path);
  getDb().prepare("DELETE FROM brands WHERE id = ?").run(num(fd, "id"));
  refreshSite();
  redirect("/admin/brands?saved=1");
}

/* ---------- services ---------- */
export async function saveServiceAction(fd: FormData) {
  await requireUser();
  const db = getDb();
  const id = num(fd, "id");
  const back = id ? `/admin/services/${id}` : "/admin/services/new";
  const title = str(fd, "title", 160);
  if (title.length < 2) fail(back, "Title is required.");
  let image = id ? (db.prepare("SELECT image_path FROM services WHERE id = ?").get(id) as { image_path: string } | undefined)?.image_path ?? "" : "";
  try { const up = await saveImage(fd.get("image")); if (up) { await deleteImage(image); image = up; } } catch (e) { fail(back, (e as Error).message); }
  if (fd.get("remove_image") === "on") { await deleteImage(image); image = ""; }
  const v = {
    title, slug: uniqueSlug("services", str(fd, "slug", 80) || title, id), summary: str(fd, "summary", 400), description: str(fd, "description", 5000),
    benefits: JSON.stringify(str(fd, "benefits", 5000).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 20)),
    icon: str(fd, "icon", 30) || "shield", image_path: image, sort: num(fd, "sort") ?? 0, published: bool(fd, "published"),
  };
  let newId = id;
  if (id) db.prepare("UPDATE services SET title=@title, slug=@slug, summary=@summary, description=@description, benefits=@benefits, icon=@icon, image_path=@image_path, sort=@sort, published=@published WHERE id=@id").run({ ...v, id });
  else newId = Number(db.prepare("INSERT INTO services (title, slug, summary, description, benefits, icon, image_path, sort, published) VALUES (@title, @slug, @summary, @description, @benefits, @icon, @image_path, @sort, @published)").run(v).lastInsertRowid);
  refreshSite();
  redirect(`/admin/services/${newId}?saved=1`);
}
export async function deleteServiceAction(fd: FormData) {
  await requireUser();
  const r = getDb().prepare("SELECT image_path FROM services WHERE id = ?").get(num(fd, "id")) as { image_path: string } | undefined;
  if (r) await deleteImage(r.image_path);
  getDb().prepare("DELETE FROM services WHERE id = ?").run(num(fd, "id"));
  refreshSite();
  redirect("/admin/services?saved=1");
}

/* ---------- projects ---------- */
export async function saveProjectAction(fd: FormData) {
  await requireUser();
  const db = getDb();
  const id = num(fd, "id");
  const back = id ? `/admin/projects/${id}` : "/admin/projects/new";
  const title = str(fd, "title", 200);
  if (title.length < 2) fail(back, "Title is required.");
  let cover = id ? (db.prepare("SELECT cover_path FROM projects WHERE id = ?").get(id) as { cover_path: string } | undefined)?.cover_path ?? "" : "";
  try { const up = await saveImage(fd.get("cover")); if (up) { await deleteImage(cover); cover = up; } } catch (e) { fail(back, (e as Error).message); }
  if (fd.get("remove_cover") === "on") { await deleteImage(cover); cover = ""; }
  const v = {
    title, slug: uniqueSlug("projects", str(fd, "slug", 80) || title, id), category: str(fd, "category", 100), location: str(fd, "location", 160),
    description: str(fd, "description", 8000), systems: str(fd, "systems", 400), cover_path: cover, published: bool(fd, "published"), is_sample: bool(fd, "is_sample"),
  };
  let newId = id;
  if (id) db.prepare("UPDATE projects SET title=@title, slug=@slug, category=@category, location=@location, description=@description, systems=@systems, cover_path=@cover_path, published=@published, is_sample=@is_sample WHERE id=@id").run({ ...v, id });
  else newId = Number(db.prepare("INSERT INTO projects (title, slug, category, location, description, systems, cover_path, published, is_sample) VALUES (@title, @slug, @category, @location, @description, @systems, @cover_path, @published, @is_sample)").run(v).lastInsertRowid);

  // Gallery uploads (multiple)
  const files = fd.getAll("gallery");
  const ins = db.prepare("INSERT INTO project_images (project_id, path, caption, sort) VALUES (?, ?, '', ?)");
  for (const [i, f] of files.slice(0, 20).entries()) {
    try { const p = await saveImage(f); if (p) ins.run(newId, p, i); } catch (e) { fail(`/admin/projects/${newId}`, (e as Error).message); }
  }
  refreshSite();
  redirect(`/admin/projects/${newId}?saved=1`);
}
export async function updateProjectImageAction(fd: FormData) {
  await requireUser();
  const id = num(fd, "image_id"); const pid = num(fd, "project_id");
  if (fd.get("delete") === "1") {
    const r = getDb().prepare("SELECT path FROM project_images WHERE id = ?").get(id) as { path: string } | undefined;
    if (r) await deleteImage(r.path);
    getDb().prepare("DELETE FROM project_images WHERE id = ?").run(id);
  } else {
    getDb().prepare("UPDATE project_images SET caption = ? WHERE id = ?").run(str(fd, "caption", 300), id);
  }
  refreshSite();
  redirect(`/admin/projects/${pid}?saved=1`);
}
export async function deleteProjectAction(fd: FormData) {
  await requireUser();
  const db = getDb(); const id = num(fd, "id");
  const imgs = db.prepare("SELECT path FROM project_images WHERE project_id = ?").all(id) as { path: string }[];
  for (const im of imgs) await deleteImage(im.path);
  const r = db.prepare("SELECT cover_path FROM projects WHERE id = ?").get(id) as { cover_path: string } | undefined;
  if (r) await deleteImage(r.cover_path);
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  refreshSite();
  redirect("/admin/projects?saved=1");
}

/* ---------- settings ---------- */
export async function saveSettingsAction(fd: FormData) {
  await requireUser("admin");
  const db = getDb();
  const up = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (k === "free_consultation") { up.run(k, fd.get(k) === "on" ? "1" : "0"); continue; }
    if (k === "hero_image") continue;
    if (!fd.has(k)) continue;
    const v = str(fd, k, 4000);
    if (["facebook", "instagram", "linkedin", "x_twitter", "map_embed_url"].includes(k) && v && !/^https:\/\//.test(v)) fail("/admin/settings", `${k} must be an https:// link.`);
    if ((k === "email" || k === "notify_email") && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) fail("/admin/settings", `${k} is not a valid email address.`);
    up.run(k, v);
  }
  const cur = (db.prepare("SELECT value FROM settings WHERE key = 'hero_image'").get() as { value: string } | undefined)?.value ?? "";
  try { const img = await saveImage(fd.get("hero_image_file")); if (img) { await deleteImage(cur); up.run("hero_image", img); } } catch (e) { fail("/admin/settings", (e as Error).message); }
  if (fd.get("remove_hero_image") === "on") { await deleteImage(cur); up.run("hero_image", ""); }
  refreshSite();
  redirect("/admin/settings?saved=1");
}

/* ---------- SEO ---------- */
export async function saveSeoAction(fd: FormData) {
  await requireUser();
  const path = str(fd, "path", 200);
  if (!/^\/[a-z0-9\-/]*$/.test(path)) fail("/admin/seo", "Invalid path.");
  getDb().prepare("INSERT INTO page_seo (path, title, description) VALUES (?, ?, ?) ON CONFLICT(path) DO UPDATE SET title = excluded.title, description = excluded.description")
    .run(path, str(fd, "title", 70), str(fd, "description", 170));
  refreshSite();
  redirect("/admin/seo?saved=1");
}

/* ---------- users ---------- */
export async function createUserAction(fd: FormData) {
  await requireUser("admin");
  const email = str(fd, "email", 200).toLowerCase();
  const pw = String(fd.get("password") ?? "");
  const role = fd.get("role") === "admin" ? "admin" : "editor";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("/admin/users", "Enter a valid email.");
  const p = passwordProblem(pw); if (p) fail("/admin/users", p);
  try { getDb().prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)").run(email, hashPassword(pw), role); }
  catch { fail("/admin/users", "A user with that email already exists."); }
  redirect("/admin/users?saved=1");
}
export async function deleteUserAction(fd: FormData) {
  const me = await requireUser("admin");
  const id = num(fd, "id");
  if (id === me.uid) fail("/admin/users", "You can't delete your own account.");
  getDb().prepare("DELETE FROM admin_users WHERE id = ?").run(id);
  redirect("/admin/users?saved=1");
}
export async function changePasswordAction(fd: FormData) {
  const me = await requireUser();
  const pw = String(fd.get("password") ?? "");
  const p = passwordProblem(pw); if (p) fail("/admin/users", p);
  if (pw !== String(fd.get("confirm") ?? "")) fail("/admin/users", "Passwords don't match.");
  getDb().prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(hashPassword(pw), me.uid);
  redirect("/admin/users?saved=1");
}

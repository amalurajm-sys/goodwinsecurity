import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero, ProductCard, SampleNotice } from "@/components/ui";
import { getBrands, getCategories, searchProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/products", "CCTV Cameras, NVRs & Security Products in Bahrain",
    "Browse CCTV cameras, IP cameras, NVRs, DVRs, access control, video intercoms, alarms and PoE network equipment. Request a price from GOODWIN SECURITY W.L.L. in Bahrain.");
}

type SP = Promise<{ q?: string; category?: string; brand?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 80).trim();
  const category = (sp.category ?? "").slice(0, 60);
  const brand = (sp.brand ?? "").slice(0, 60);
  const cats = getCategories();
  const brands = getBrands();
  const products = searchProducts({ q, category, brand });
  const activeCat = cats.find((c) => c.slug === category);
  const hasSamples = products.some((p) => p.is_sample);

  const link = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(brand && { brand }), ...patch });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    const s = p.toString();
    return `/products${s ? "?" + s : ""}`;
  };

  return (
    <>
      <PageHero eyebrow="Product Catalogue" title={activeCat ? activeCat.name : "Security Products"} crumbs={[{ label: "Products" }]}
        intro={activeCat?.description || "Cameras, recorders, access control, intercoms, alarms and network equipment. Request a price on any product and we'll come back to you with a quotation."} />

      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="container-site grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside aria-label="Product categories" className="order-2 lg:order-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-navy-900">Categories</h2>
              <ul className="mt-4 space-y-0.5 text-sm">
                <li><Link href={link({ category: "" })} className={`flex justify-between rounded-md px-2.5 py-2 ${!category ? "bg-brand/10 font-semibold text-brand-dark" : "hover:bg-slate-50"}`}>All products</Link></li>
                {cats.map((c) => (
                  <li key={c.id}>
                    <Link href={link({ category: c.slug })} aria-current={c.slug === category ? "page" : undefined}
                      className={`flex justify-between gap-2 rounded-md px-2.5 py-2 ${c.slug === category ? "bg-brand/10 font-semibold text-brand-dark" : "hover:bg-slate-50"}`}>
                      <span>{c.name}</span><span className="text-slate-400">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="order-1 lg:order-2">
            <form role="search" action="/products" method="get" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_180px_180px_auto]">
              <div className="relative">
                <label htmlFor="q" className="sr-only">Search products</label>
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by name, model or SKU" className="input pl-10" maxLength={80} />
              </div>
              <div>
                <label htmlFor="category" className="sr-only">Category</label>
                <select id="category" name="category" defaultValue={category} className="input">
                  <option value="">All categories</option>
                  {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="brand" className="sr-only">Brand</label>
                <select id="brand" name="brand" defaultValue={brand} className="input">
                  <option value="">All brands</option>
                  {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary justify-center">Search</button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600" aria-live="polite">
                <strong className="text-navy-900">{products.length}</strong> {products.length === 1 ? "product" : "products"}
                {q && <> matching “{q}”</>}
              </p>
              {(q || category || brand) && <Link href="/products" className="text-sm font-semibold text-brand hover:underline">Clear filters</Link>}
            </div>

            {hasSamples && (
              <div className="mt-4"><SampleNotice>Listings marked <strong>Sample listing</strong> are placeholders for layout only. Contact us for current models, specifications and availability.</SampleNotice></div>
            )}

            {products.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <Icon name="search" className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-4 text-xl font-semibold">No products found</h2>
                <p className="mx-auto mt-2 max-w-md text-slate-600">We couldn't find a product matching your search. Try a different term, or tell us what you need — we can often source it.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/products" className="btn-outline">View all products</Link>
                  <Link href={`/quote?type=product-price${q ? "&item=" + encodeURIComponent(q) : ""}`} className="btn-primary">Ask us about it</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProductImage } from "@/components/ProductArt";
import { ProductCard, SampleNotice } from "@/components/ui";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type P = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: P }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return pageMeta(`/products/${p.slug}`, `${p.name}${p.brand_name && p.brand_slug !== "other" ? " – " + p.brand_name : ""} | Bahrain`,
    `${p.summary} Request a price from GOODWIN SECURITY W.L.L. in Bahrain.`,
    p.is_sample ? { robots: { index: false, follow: true } } : {});
}

export default async function ProductPage({ params }: { params: P }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  const related = getRelatedProducts(p);

  const jsonLd = p.is_sample ? null : {
    "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku || undefined, mpn: p.model || undefined,
    description: p.summary, brand: p.brand_name && p.brand_slug !== "other" ? { "@type": "Brand", name: p.brand_name } : undefined,
    url: `${SITE_URL}/products/${p.slug}`, category: p.category_name ?? undefined,
  };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <div className="border-b border-slate-200 bg-slate-50">
        <nav aria-label="Breadcrumb" className="container-site py-4 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-brand">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link href="/products" className="hover:text-brand">Products</Link></li><li aria-hidden="true">/</li>
            {p.category_slug && <><li><Link href={`/products?category=${p.category_slug}`} className="hover:text-brand">{p.category_name}</Link></li><li aria-hidden="true">/</li></>}
            <li aria-current="page" className="text-navy-900">{p.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-site grid gap-10 py-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-navy-900">
          <ProductImage path={p.image_path} alt={`${p.name}${p.model ? " " + p.model : ""}`} />
          {p.is_sample === 1 && <span className="sample-badge absolute left-4 top-4">Sample listing</span>}
        </div>
        <div>
          <p className="eyebrow">{p.brand_name} · {p.category_name}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{p.name}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-slate-500">
            <div className="flex gap-1.5"><dt>Model:</dt><dd className="text-navy-900">{p.model || "—"}</dd></div>
            {p.sku && <div className="flex gap-1.5"><dt>SKU:</dt><dd className="text-navy-900">{p.sku}</dd></div>}
          </dl>
          <p className="mt-6 text-lg leading-relaxed text-slate-700">{p.summary}</p>
          {p.description && <p className="mt-4 leading-relaxed text-slate-600">{p.description}</p>}
          {p.is_sample === 1 && <div className="mt-5"><SampleNotice>This is a sample listing. Model, specifications and availability are to be confirmed.</SampleNotice></div>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/quote?product=${p.id}&type=product-price`} className="btn-primary px-6 py-3 text-base">Request Price <Icon name="arrow" className="h-5 w-5" /></Link>
            <Link href={`/quote?product=${p.id}&type=installation`} className="btn-outline px-6 py-3 text-base">Request installation</Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Prices and availability are provided on request and depend on the specific model and supplier.</p>
        </div>
      </section>

      <section className="container-site grid gap-6 pb-16 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Specifications</h2>
          {p.specs.length ? (
            <table className="mt-4 w-full text-sm">
              <tbody>
                {p.specs.map((s, i) => (
                  <tr key={i} className="border-t border-slate-100 first:border-0">
                    <th scope="row" className="w-2/5 py-3 pr-4 text-left font-medium text-slate-500">{s.label}</th>
                    <td className="py-3 text-navy-900">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="mt-3 text-sm text-slate-500">Specifications available on request.</p>}
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold">Compatibility</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.compatibility || "Contact us to confirm compatibility with your system."}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold">Available accessories</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.accessories || "Ask us about compatible accessories."}</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container-site">
            <h2 className="text-2xl font-bold">Related products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}

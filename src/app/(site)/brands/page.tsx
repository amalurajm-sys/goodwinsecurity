import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getBrands, searchProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/brands", "Hikvision & Dahua CCTV in Bahrain – Brands",
    "Hikvision cameras, Dahua CCTV and other compatible security and networking brands supplied and installed in Bahrain by GOODWIN SECURITY W.L.L.");
}

export default function BrandsPage() {
  const brands = getBrands();
  return (
    <>
      <PageHero eyebrow="Brands" title="Security technology brands" crumbs={[{ label: "Brands" }]}
        intro="We work with products from recognised security technology manufacturers, and recommend compatible security and networking brands to suit each project." />
      <section className="section bg-white">
        <div className="container-site">
          <ul className="grid gap-6 md:grid-cols-3">
            {brands.map((b) => {
              const n = searchProducts({ brand: b.slug }).length;
              return (
                <li key={b.id} className="card flex flex-col p-8">
                  <div className="flex h-16 items-center">
                    {b.logo_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.logo_path} alt={b.name} className="max-h-12 w-auto" loading="lazy" />
                    ) : <span className="font-display text-2xl font-bold text-navy-900">{b.name}</span>}
                  </div>
                  <p className="mt-4 flex-1 text-slate-600">{b.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link href={`/products?brand=${b.slug}`} className="btn-outline">View products ({n})</Link>
                    {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:underline">Manufacturer site ↗</a>}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-600">
            <h2 className="font-display text-base font-semibold text-navy-900">Please note</h2>
            <p className="mt-2">Brand names and logos are trademarks of their respective owners and are used here only to identify products. Their appearance on this website does not imply that GOODWIN SECURITY W.L.L. is an authorised distributor, certified partner or otherwise endorsed by the manufacturer. Product availability and compatibility depend on the specific model and supplier.</p>
          </div>
        </div>
      </section>
    </>
  );
}

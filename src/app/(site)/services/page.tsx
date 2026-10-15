import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero } from "@/components/ui";
import { getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/services", "CCTV Installation & Maintenance Services in Bahrain",
    "CCTV installation, CCTV maintenance, access control, video intercom, networking and security system upgrades for homes and businesses in Bahrain.");
}

export default function ServicesPage() {
  const services = getServices();
  const s = getSettings();
  return (
    <>
      <PageHero eyebrow="Services" title="Installation, maintenance and technical services" crumbs={[{ label: "Services" }]}
        intro="Complete security system services — from site assessment and installation to troubleshooting, upgrades and ongoing support." />
      <nav aria-label="Services on this page" className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <ul className="container-site flex gap-1 overflow-x-auto py-2 text-sm">
          {services.map((v) => (<li key={v.id} className="shrink-0"><a href={`#${v.slug}`} className="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-brand">{v.title}</a></li>))}
        </ul>
      </nav>
      <div className="bg-white">
        {services.map((v, i) => (
          <section key={v.id} id={v.slug} className={`scroll-mt-32 py-16 sm:py-20 ${i % 2 ? "bg-slate-50" : ""}`}>
            <div className={`container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
              <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-navy-950 ${i % 2 ? "lg:order-2" : ""}`}>
                {v.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.image_path} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <div className="grid-bg absolute inset-0" aria-hidden="true" />
                    <Icon name={v.icon} className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-brand-light" />
                    <Icon name={v.icon} className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5" />
                  </>
                )}
              </div>
              <div>
                <p className="eyebrow">Service 0{i + 1}</p>
                <h2 className="mt-3 text-3xl font-bold">{v.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{v.description}</p>
                {v.benefits.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {v.benefits.map((b) => (
                      <li key={b} className="flex gap-3 text-slate-700">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon name="check" className="h-3.5 w-3.5" /></span>{b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={`/quote?type=${v.slug.includes("maintenance") ? "maintenance" : "installation"}&service=${encodeURIComponent(v.title)}`} className="btn-primary mt-8">
                  Enquire about {v.title.toLowerCase()} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
      <CtaBand free={s.free_consultation === "1"} />
    </>
  );
}

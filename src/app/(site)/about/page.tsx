import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ShieldMark } from "@/components/Logo";
import { CtaBand, PageHero } from "@/components/ui";
import { getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/about", "About GOODWIN SECURITY W.L.L. – Security Systems Bahrain",
    "GOODWIN SECURITY W.L.L. provides security system products and technical services in Bahrain for residential, commercial and industrial customers.");
}

const VALUES = [
  { icon: "shield", title: "Reliability", text: "Equipment and installations chosen to work dependably day after day." },
  { icon: "target", title: "Practical solutions", text: "Recommendations based on real requirements and budget." },
  { icon: "tools", title: "Technical support", text: "Help with troubleshooting, maintenance and system changes." },
  { icon: "chat", title: "Customer service", text: "Clear communication from first enquiry to handover." },
];

export default function AboutPage() {
  const s = getSettings();
  const services = getServices();
  return (
    <>
      <PageHero eyebrow="About Us" title={s.company_name} crumbs={[{ label: "About Us" }]}
        intro="Security system products and technical services for homes and businesses across Bahrain." />

      <section className="section bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Company Overview</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Security technology, properly installed and supported</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">{s.about_overview}</p>
          </div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-navy-950">
            <div className="grid-bg absolute inset-0" aria-hidden="true" />
            <div className="absolute h-2/3 w-2/3 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
            <ShieldMark className="relative h-1/2 w-auto" />
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Our Approach</p>
            <h2 className="mt-3 text-3xl font-bold">Requirements first, equipment second</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{s.about_approach}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <li key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <Icon name={v.icon} className="h-7 w-7 text-brand" />
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <p className="eyebrow">Our Solutions</p>
          <h2 className="mt-3 text-3xl font-bold">What we do</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((v) => (
              <li key={v.id}>
                <Link href={`/services#${v.slug}`} className="card flex h-full gap-4 p-6">
                  <Icon name={v.icon} className="h-7 w-7 shrink-0 text-brand" />
                  <span><span className="block font-display font-semibold text-navy-900">{v.title}</span><span className="mt-1 block text-sm text-slate-600">{v.summary}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-navy-950 text-white">
        <div className="container-site max-w-3xl text-center">
          <p className="eyebrow text-brand-light">Our Commitment to Customers</p>
          <p className="mt-6 font-display text-2xl leading-relaxed text-white sm:text-3xl">{s.about_commitment}</p>
        </div>
      </section>

      <div className="pt-16 sm:pt-24"><CtaBand free={s.free_consultation === "1"} /></div>
    </>
  );
}

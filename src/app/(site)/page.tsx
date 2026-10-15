import Link from "next/link";
import { Icon } from "@/components/Icon";
import { HeroArt } from "@/components/HeroArt";
import { CtaBand, ProductCard, SectionHeading } from "@/components/ui";
import { getBrands, getFeaturedProducts, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/", "CCTV & Security Systems Bahrain | GOODWIN SECURITY W.L.L.",
    "CCTV installation, IP cameras, access control, video intercoms and security system maintenance for homes and businesses across Bahrain. Request a quote from GOODWIN SECURITY W.L.L.");
}

const SOLUTIONS = [
  { icon: "camera", title: "CCTV Surveillance Systems", text: "Complete camera systems planned around your site, installed and configured for reliable recording.", href: "/services#cctv-installation" },
  { icon: "ip", title: "IP Camera Systems", text: "High-resolution network cameras with remote viewing on phone and PC where supported.", href: "/products?category=ip-cameras" },
  { icon: "recorder", title: "Video Recording & Storage Solutions", text: "NVRs, DVRs and surveillance-grade storage sized to your retention needs.", href: "/products?category=nvr" },
  { icon: "key", title: "Access Control Systems", text: "Card, PIN, fingerprint and face access for doors, offices and restricted areas.", href: "/services#access-control" },
  { icon: "intercom", title: "Video Door Phones & Intercoms", text: "See and speak to visitors before opening the door — for villas, buildings and offices.", href: "/services#video-intercom" },
  { icon: "alarm", title: "Intruder Alarm Systems", text: "Alarm panels, detectors and sirens to alert you to unauthorised entry.", href: "/products?category=alarm-systems" },
  { icon: "network", title: "Network Cabling & Infrastructure", text: "Structured cabling and PoE networking that your security devices depend on.", href: "/services#networking-infrastructure" },
  { icon: "wrench", title: "Security System Maintenance", text: "Inspection, troubleshooting and repairs to keep existing systems working.", href: "/services#cctv-maintenance" },
];

const WHY = [
  { icon: "target", title: "Tailored to your requirements", text: "Solutions designed around your property, risks and how the space is used." },
  { icon: "tools", title: "Professional installation", text: "Careful installation and configuration, with neat cabling and secure mounting." },
  { icon: "building", title: "Homes to commercial sites", text: "Suitable options for homes, shops, offices, warehouses and commercial properties." },
  { icon: "headset", title: "Ongoing technical support", text: "Maintenance, troubleshooting and technical assistance when you need it." },
  { icon: "wallet", title: "Right product, right budget", text: "Equipment selected on application, compatibility and budget — not one fixed package." },
];

const INDUSTRIES = [
  { icon: "home", title: "Residential properties", text: "Villas, apartments and compounds" },
  { icon: "store", title: "Retail shops & showrooms", text: "Loss prevention and customer areas" },
  { icon: "building", title: "Offices & commercial buildings", text: "Entrances, floors and car parks" },
  { icon: "warehouse", title: "Warehouses & industrial", text: "Perimeters, loading bays and stock" },
  { icon: "hotel", title: "Hospitality & other premises", text: "Hotels, restaurants and venues" },
];

const STEPS = [
  { title: "Consultation", text: "Understand the customer's security requirements." },
  { title: "Solution Design", text: "Recommend suitable equipment and system configuration." },
  { title: "Installation", text: "Install and configure the approved solution." },
  { title: "Support", text: "Provide maintenance and technical assistance as agreed." },
];

export default function Home() {
  const s = getSettings();
  const featured = getFeaturedProducts(3);
  const brands = getBrands().filter((b) => b.featured);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-brand-dark/50 blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="eyebrow fade-up text-brand-light">Security systems · Bahrain</p>
            <h1 className="fade-up mt-4 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.6rem]">{s.hero_heading}</h1>
            <p className="fade-up-2 mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{s.hero_text}</p>
            <div className="fade-up-3 mt-9 flex flex-wrap gap-3">
              <Link href="/quote" className="btn-primary px-6 py-3 text-base">Request a Quote <Icon name="arrow" className="h-5 w-5" /></Link>
              <Link href="#solutions" className="btn-ghost px-6 py-3 text-base">Explore Our Solutions</Link>
            </div>
            <ul className="fade-up-3 mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              {["Professional Installation", "Reliable Security Technology", "Technical Support & Maintenance"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm font-medium text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand-light"><Icon name="check" className="h-3.5 w-3.5" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            {s.hero_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.hero_image} alt="Security system installation by GOODWIN SECURITY" className="aspect-[7/6] w-full rounded-3xl object-cover" fetchPriority="high" />
            ) : (
              <HeroArt className="w-full" />
            )}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="section scroll-mt-20 bg-slate-50">
        <div className="container-site">
          <SectionHeading eyebrow="Our Solutions" title="Security technology for every type of property"
            intro="From a single camera to a complete multi-site system — supply, installation and support under one roof." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((x) => (
              <li key={x.title}>
                <Link href={x.href} className="card group flex h-full flex-col p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-dark to-brand text-white">
                    <Icon name={x.icon} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold leading-snug">{x.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{x.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="section bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Why Choose Us" title="Why choose GOODWIN SECURITY?"
              intro="Practical security solutions, installed properly and supported afterwards." />
            <Link href="/about" className="btn-outline mt-8">About our company</Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <li key={w.title} className={`rounded-2xl border border-slate-200 p-6 ${i === WHY.length - 1 ? "sm:col-span-2" : ""}`}>
                <Icon name={w.icon} className="h-7 w-7 text-brand" />
                <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section relative overflow-hidden bg-navy-950">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="container-site relative">
          <SectionHeading dark eyebrow="Industries We Serve" title="Protecting homes and businesses across Bahrain" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INDUSTRIES.map((x, i) => (
              <li key={x.title} className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-navy-800 to-navy-900 p-6">
                <Icon name={x.icon} className="absolute right-4 top-4 h-16 w-16 text-brand/20 transition duration-500 group-hover:text-brand/40" />
                <span className="font-mono text-xs text-brand-light">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{x.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{x.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading center eyebrow="How We Work" title="A simple, four-step process" />
          <ol className="relative mt-14 grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block" aria-hidden="true" />
            {STEPS.map((st, i) => (
              <li key={st.title} className="relative text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark font-display text-lg font-bold text-white ring-8 ring-white">{i + 1}</span>
                <h3 className="mt-5 text-lg font-semibold">{st.title}</h3>
                <p className="mx-auto mt-2 max-w-[230px] text-sm leading-relaxed text-slate-600">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-site">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Products" title="Featured products" />
              <Link href="/products" className="btn-outline self-start sm:self-auto">Browse the catalogue</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* BRANDS */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading center eyebrow="Featured Brands" title="Recognised security technology manufacturers"
            intro="We work with products from established manufacturers, alongside other compatible security and networking brands where appropriate." />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {brands.map((b) => (
              <li key={b.id} className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 px-6">
                {b.logo_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo_path} alt={b.name} className="max-h-12 w-auto" loading="lazy" />
                ) : (
                  <span className="font-display text-xl font-bold tracking-tight text-navy-900">{b.name}</span>
                )}
              </li>
            ))}
            <li className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 text-center text-sm font-medium text-slate-500">
              + Other compatible brands
            </li>
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate-500">
            Brand names are trademarks of their respective owners. Product availability and compatibility depend on the specific model and supplier.
          </p>
        </div>
      </section>

      <CtaBand free={s.free_consultation === "1"} />
    </>
  );
}

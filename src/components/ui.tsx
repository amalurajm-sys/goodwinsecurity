import Link from "next/link";
import { Icon } from "./Icon";
import { ProductImage } from "./ProductArt";
import type { Product } from "@/lib/queries";

export function PageHero({ eyebrow, title, intro, crumbs }: { eyebrow?: string; title: string; intro?: string; crumbs?: { href?: string; label: string }[] }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
      <div className="container-site relative py-16 sm:py-20">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span aria-current="page" className="text-slate-200">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow fade-up text-brand-light">{eyebrow}</p>}
        <h1 className="fade-up mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">{title}</h1>
        {intro && <p className="fade-up-2 mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, center = false, dark = false }: { eyebrow?: string; title: string; intro?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-brand-light" : ""}`}>{eyebrow}</p>}
      <h2 className={`mt-3 text-3xl font-bold leading-tight sm:text-4xl ${dark ? "text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{intro}</p>}
    </div>
  );
}

export function CtaBand({ free }: { free: boolean }) {
  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-navy-950 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Looking for the Right Security Solution?</h2>
              <p className="mt-4 text-lg text-slate-300">Tell us about your requirements, and our team will help you find a suitable security system for your property or business.</p>
            </div>
            <Link href="/quote?type=complete-system" className="btn-primary shrink-0 self-start px-7 py-3.5 text-base lg:self-auto">
              {free ? "Request a Free Consultation" : "Request a Consultation"} <Icon name="arrow" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/products/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-navy-900" tabIndex={-1} aria-hidden="true">
        <ProductImage path={p.image_path} alt="" className="transition duration-500 group-hover:scale-[1.03]" />
        {p.is_sample === 1 && <span className="sample-badge absolute left-3 top-3">Sample listing</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{p.brand_name ?? "—"} · {p.category_name}</p>
        <h3 className="mt-2 text-lg font-semibold leading-snug"><Link href={`/products/${p.slug}`} className="hover:text-brand">{p.name}</Link></h3>
        <p className="mt-1 font-mono text-xs text-slate-500">Model: {p.model || "—"}{p.sku ? ` · SKU: ${p.sku}` : ""}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/quote?product=${p.id}&type=product-price`} className="btn-primary px-4 py-2 text-[13px]">Request Price</Link>
          <Link href={`/products/${p.slug}`} className="btn-outline px-4 py-2 text-[13px]">Details</Link>
        </div>
      </div>
    </article>
  );
}

export function SampleNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Icon name="pencil" className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

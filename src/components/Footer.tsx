import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { getCategories, getServices, getSettings } from "@/lib/queries";
import { formatBhPhone, telHref, waHref } from "@/lib/site";

export function Footer() {
  const s = getSettings();
  const cats = getCategories().slice(0, 6);
  const svcs = getServices().slice(0, 6);
  const socials = [["Facebook", s.facebook], ["Instagram", s.instagram], ["LinkedIn", s.linkedin], ["X", s.x_twitter]].filter(([, u]) => u);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">{s.short_description}</p>
          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-3 text-sm">
              {socials.map(([n, u]) => (<li key={n}><a href={u} rel="noopener noreferrer" target="_blank" className="hover:text-white">{n}</a></li>))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="footer-h">Products</h2>
          <ul className="space-y-2 text-sm">
            {cats.map((c) => (<li key={c.id}><Link className="hover:text-white" href={`/products?category=${c.slug}`}>{c.name}</Link></li>))}
            <li><Link className="text-brand-light hover:text-white" href="/products">All products →</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-h">Services</h2>
          <ul className="space-y-2 text-sm">
            {svcs.map((v) => (<li key={v.id}><Link className="hover:text-white" href={`/services#${v.slug}`}>{v.title}</Link></li>))}
          </ul>
        </div>
        <div>
          <h2 className="footer-h">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{s.address || s.country}</li>
            {s.phone && (<li className="flex gap-2"><Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><a className="hover:text-white" href={telHref(s.phone)}>{formatBhPhone(s.phone)}</a></li>)}
            {s.whatsapp && (<li className="flex gap-2"><Icon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><a className="hover:text-white" href={waHref(s.whatsapp)} rel="noopener noreferrer" target="_blank">WhatsApp</a></li>)}
            {s.email && (<li className="flex gap-2"><Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><a className="hover:text-white" href={`mailto:${s.email}`}>{s.email}</a></li>)}
            <li><Link className="text-brand-light hover:text-white" href="/contact">Send us an enquiry →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} {s.company_name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-5">
            <li><Link className="hover:text-white" href="/about">About</Link></li>
            <li><Link className="hover:text-white" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms and Conditions</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { NAV } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled || open ? "border-white/10 bg-navy-950/95 backdrop-blur" : "border-transparent bg-navy-950"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-navy-900">Skip to content</a>
      <div className="mx-auto flex h-[72px] max-w-site items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="GOODWIN SECURITY W.L.L. — Home"><Logo /></Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                  className={`relative rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors ${active(n.href) ? "text-white" : "text-slate-300 hover:text-white"}`}>
                  {n.label}
                  {active(n.href) && <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded bg-brand" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/quote" className="btn-primary hidden sm:inline-flex">Request a Quote</Link>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-white/10 bg-navy-950 lg:hidden">
        <nav aria-label="Mobile" className="mx-auto max-w-site px-4 py-3">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-3 text-base ${active(n.href) ? "bg-white/5 text-white" : "text-slate-300"}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <Link href="/quote" className="btn-primary mt-3 w-full justify-center">Request a Quote</Link>
        </nav>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireUser } from "@/lib/auth";
import { enquiryCounts } from "@/lib/queries";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser();
  const newCount = enquiryCounts().New ?? 0;
  const nav = [
    ["/admin", "Dashboard"], ["/admin/enquiries", "Enquiries"], ["/admin/products", "Products"], ["/admin/categories", "Categories"],
    ["/admin/brands", "Brands"], ["/admin/services", "Services"], ["/admin/projects", "Projects"], ["/admin/seo", "SEO"],
    ...(me.role === "admin" ? [["/admin/settings", "Company & homepage"]] : []), ["/admin/users", me.role === "admin" ? "Users" : "My account"],
  ];
  return (
    <div className="min-h-screen bg-slate-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-navy-950 text-slate-300 md:min-h-screen">
        <div className="flex items-center justify-between p-5 md:block">
          <Link href="/admin"><Logo /></Link>
          <a href="/" target="_blank" className="text-xs text-brand-light hover:text-white md:mt-4 md:block">View website ↗</a>
        </div>
        <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 md:pb-6">
          <ul className="flex gap-1 md:flex-col">
            {nav.map(([href, label]) => (
              <li key={href} className="shrink-0">
                <Link href={href} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white">
                  {label}
                  {href === "/admin/enquiries" && newCount > 0 && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{newCount}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-white/10 p-5 text-xs md:block">
          <p className="truncate text-slate-400">{me.email}</p>
          <p className="mt-0.5 uppercase tracking-wider text-slate-500">{me.role}</p>
          <form action={logoutAction}><button className="mt-3 text-brand-light hover:text-white">Sign out</button></form>
        </div>
      </aside>
      <div className="min-w-0 p-4 sm:p-8">
        <form action={logoutAction} className="mb-4 text-right md:hidden"><button className="text-sm text-brand">Sign out</button></form>
        {children}
      </div>
    </div>
  );
}

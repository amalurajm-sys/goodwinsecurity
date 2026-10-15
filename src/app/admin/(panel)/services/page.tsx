import Link from "next/link";
import { AdminHeader, Flash } from "@/components/admin";
import { getServices } from "@/lib/queries";

export const metadata = { title: "Services" };

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const list = getServices(true);
  return (
    <>
      <AdminHeader title="Services" action={{ href: "/admin/services/new", label: "Add service" }} />
      <Flash saved={saved} />
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {list.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-4 p-4">
            <span><Link href={`/admin/services/${s.id}`} className="font-semibold text-brand">{s.title}</Link><span className="block text-sm text-slate-500">{s.summary}</span></span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${s.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{s.published ? "Published" : "Hidden"}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

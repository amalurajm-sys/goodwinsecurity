import Link from "next/link";
import { AdminHeader, Flash } from "@/components/admin";
import { getProjects } from "@/lib/queries";
export const metadata = { title: "Projects" };
export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const list = getProjects(true);
  return (
    <>
      <AdminHeader title="Projects" action={{ href: "/admin/projects/new", label: "Add project" }} />
      <Flash saved={saved} />
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {list.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 p-4">
            <span><Link href={`/admin/projects/${p.id}`} className="font-semibold text-brand">{p.title}</Link><span className="block text-sm text-slate-500">{p.category}</span></span>
            <span className="flex shrink-0 gap-1">{p.is_sample === 1 && <span className="sample-badge">Sample</span>}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{p.published ? "Published" : "Draft"}</span></span>
          </li>
        ))}
        {!list.length && <li className="p-8 text-center text-slate-500">No projects yet.</li>}
      </ul>
    </>
  );
}

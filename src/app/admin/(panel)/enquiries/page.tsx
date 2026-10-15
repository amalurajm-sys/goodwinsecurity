import Link from "next/link";
import { AdminHeader, Flash } from "@/components/admin";
import { ENQUIRY_STATUSES, getEnquiries } from "@/lib/queries";
import { ENQUIRY_TYPES } from "@/lib/site";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string }> }) {
  const { status, saved } = await searchParams;
  const st = (ENQUIRY_STATUSES as readonly string[]).includes(status ?? "") ? status : undefined;
  const list = getEnquiries(st);
  return (
    <>
      <AdminHeader title="Enquiries" />
      <Flash saved={saved} />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[undefined, ...ENQUIRY_STATUSES].map((s) => (
          <Link key={s ?? "all"} href={s ? `/admin/enquiries?status=${encodeURIComponent(s)}` : "/admin/enquiries"}
            className={`rounded-full border px-3 py-1.5 ${st === s ? "border-brand bg-brand text-white" : "border-slate-300 bg-white hover:border-brand"}`}>{s ?? "All"}</Link>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Reference</th><th className="p-3">Date (UTC)</th><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Product / service</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="p-3"><Link href={`/admin/enquiries/${e.id}`} className="font-mono font-semibold text-brand">{e.ref}</Link></td>
                <td className="p-3 text-slate-500">{e.created_at.slice(0, 16)}</td>
                <td className="p-3">{e.name}{e.company && <span className="block text-xs text-slate-500">{e.company}</span>}</td>
                <td className="p-3">{ENQUIRY_TYPES.find((t) => t.value === e.type)?.label ?? e.type}</td>
                <td className="p-3">{e.product_label || e.service || "—"}</td>
                <td className="p-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{e.status}</span></td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No enquiries.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

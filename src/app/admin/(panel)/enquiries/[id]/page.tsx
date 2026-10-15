import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete, Flash, Panel } from "@/components/admin";
import { requireUser } from "@/lib/auth";
import { ENQUIRY_STATUSES, getEnquiryById } from "@/lib/queries";
import { ENQUIRY_TYPES, telHref, waHref } from "@/lib/site";
import { deleteEnquiryAction, updateEnquiryAction } from "../../../actions";

export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const { saved } = await searchParams;
  const e = getEnquiryById(Number(id));
  if (!e) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Type", ENQUIRY_TYPES.find((t) => t.value === e.type)?.label ?? e.type],
    ["Name", e.name], ["Company", e.company || "—"],
    ["Email", <a key="m" href={`mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry " + e.ref)}`} className="text-brand underline">{e.email}</a>],
    ["Phone", <span key="p"><a href={telHref(e.phone)} className="text-brand underline">{e.phone}</a> · <a href={waHref(e.phone)} target="_blank" rel="noopener noreferrer" className="text-brand underline">WhatsApp</a></span>],
    ["Preferred contact", e.preferred_contact], ["Property type", e.property_type || "—"],
    ["Product", e.product_id ? <Link key="pr" href={`/admin/products/${e.product_id}`} className="text-brand underline">{e.product_label}</Link> : e.product_label || "—"],
    ["Service", e.service || "—"], ["Quantity", e.quantity ?? "—"],
    ["Received", `${e.created_at} UTC`], ["Email notification", e.email_sent ? "Sent" : "Not sent (SMTP not configured or failed)"],
  ];
  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/enquiries" className="text-brand">← All enquiries</Link></p>
      <h1 className="mb-6 font-mono text-2xl font-bold">{e.ref}</h1>
      <Flash saved={saved} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
            {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="font-semibold text-slate-500">{k}</dt><dd className="text-navy-900">{v}</dd></div>))}
          </dl>
          <h2 className="mt-6 text-sm font-semibold text-slate-500">Message</h2>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-navy-900">{e.message}</p>
        </Panel>
        <Panel className="h-fit">
          <form action={updateEnquiryAction} className="space-y-4">
            <input type="hidden" name="id" value={e.id} />
            <div><label htmlFor="status" className="label">Status</label>
              <select id="status" name="status" defaultValue={e.status} className="input">{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label htmlFor="notes" className="label">Internal notes</label><textarea id="notes" name="notes" rows={6} defaultValue={e.notes} className="input" /></div>
            <button className="btn-primary">Save</button>
          </form>
          {me.role === "admin" && <div className="mt-6 border-t border-slate-100 pt-4"><ConfirmDelete action={deleteEnquiryAction} id={e.id} /></div>}
        </Panel>
      </div>
    </>
  );
}

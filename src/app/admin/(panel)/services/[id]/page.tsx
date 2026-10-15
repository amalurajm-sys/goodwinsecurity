import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete, Flash } from "@/components/admin";
import { getServiceById } from "@/lib/queries";
import { deleteServiceAction } from "../../../actions";
import { ServiceForm } from "../ServiceForm";
export const metadata = { title: "Edit service" };
export default async function EditService({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await params; const { saved, error } = await searchParams;
  const s = getServiceById(Number(id)); if (!s) notFound();
  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/services" className="text-brand">← Services</Link></p>
      <div className="mb-6 flex items-center justify-between gap-3"><h1 className="text-2xl font-bold">{s.title}</h1><ConfirmDelete action={deleteServiceAction} id={s.id} /></div>
      <Flash saved={saved} error={error} /><ServiceForm s={s} />
    </>
  );
}

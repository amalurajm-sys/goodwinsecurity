import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete, Flash } from "@/components/admin";
import { getProductById } from "@/lib/queries";
import { deleteProductAction } from "../../../actions";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await params; const { saved, error } = await searchParams;
  const p = getProductById(Number(id));
  if (!p) notFound();
  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/products" className="text-brand">← Products</Link></p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <div className="flex gap-2">{p.published === 1 && <a href={`/products/${p.slug}`} target="_blank" className="btn-outline">View ↗</a>}<ConfirmDelete action={deleteProductAction} id={p.id} /></div>
      </div>
      <Flash saved={saved} error={error} />
      <ProductForm p={p} />
    </>
  );
}

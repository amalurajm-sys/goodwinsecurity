import Link from "next/link";
import { AdminHeader, Flash } from "@/components/admin";
import { ProductImage } from "@/components/ProductArt";
import { searchProducts } from "@/lib/queries";

export const metadata = { title: "Products" };

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string }> }) {
  const { q, saved } = await searchParams;
  const list = searchProducts({ q: q?.slice(0, 80), includeUnpublished: true });
  return (
    <>
      <AdminHeader title="Products" action={{ href: "/admin/products/new", label: "Add product" }} />
      <Flash saved={saved} />
      <form className="mb-4 max-w-sm"><label htmlFor="q" className="sr-only">Search</label><input id="q" name="q" defaultValue={q} placeholder="Search name, model, SKU…" className="input" /></form>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3"></th><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Brand</th><th className="p-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="w-16 p-3"><div className="h-12 w-12 overflow-hidden rounded-md"><ProductImage path={p.image_path} alt="" /></div></td>
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-semibold text-brand">{p.name}</Link><span className="block font-mono text-xs text-slate-500">{p.model} {p.sku && `· ${p.sku}`}</span></td>
                <td className="p-3">{p.category_name ?? "—"}</td><td className="p-3">{p.brand_name ?? "—"}</td>
                <td className="space-x-1 p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{p.published ? "Published" : "Draft"}</span>
                  {p.is_sample === 1 && <span className="sample-badge">Sample</span>}
                  {p.featured === 1 && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-dark">Featured</span>}
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No products.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

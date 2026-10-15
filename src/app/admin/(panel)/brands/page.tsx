import { AdminHeader, Check, ConfirmDelete, Field, Flash, Panel, Thumb } from "@/components/admin";
import { getBrands } from "@/lib/queries";
import { deleteBrandAction, saveBrandAction } from "../../actions";

export const metadata = { title: "Brands" };

function BrandFields({ b }: { b?: ReturnType<typeof getBrands>[number] }) {
  return (
    <>
      <Field label="Name" name="name" defaultValue={b?.name} required />
      <Field label="Manufacturer website" name="website" defaultValue={b?.website} hint="https:// link (optional)" />
      <Field label="Order" name="sort" type="number" defaultValue={b?.sort ?? 0} />
      <div className="sm:col-span-3"><Field label="Description" name="description" defaultValue={b?.description} rows={2} /></div>
      <div className="sm:col-span-3">
        <label className="label" htmlFor={`logo-${b?.id ?? "new"}`}>Logo</label>
        <input id={`logo-${b?.id ?? "new"}`} name="logo" type="file" accept="image/png,image/webp,image/jpeg" className="block text-sm" />
        <p className="mt-1 text-xs text-slate-500">Only upload official logos you are permitted to use. PNG/WebP/JPG, max 5 MB.</p>
        {b?.logo_path && <><Thumb path={b.logo_path} /><div className="mt-2"><Check label="Remove logo" name="remove_logo" /></div></>}
      </div>
      <div className="sm:col-span-3"><Check label="Show in homepage 'Featured Brands'" name="featured" defaultChecked={b?.featured === 1} /></div>
    </>
  );
}

export default async function Brands({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const brands = getBrands();
  return (
    <>
      <AdminHeader title="Brands" />
      <Flash saved={saved} error={error} />
      <div className="space-y-3">
        {brands.map((b) => (
          <Panel key={b.id}>
            <details>
              <summary className="flex cursor-pointer items-center justify-between"><span className="font-semibold">{b.name}</span><span className="text-xs text-slate-500">{b.featured ? "Featured · " : ""}edit</span></summary>
              <form action={saveBrandAction} className="mt-4 grid gap-4 sm:grid-cols-3">
                <input type="hidden" name="id" value={b.id} />
                <BrandFields b={b} />
                <div><button className="btn-primary">Save</button></div>
              </form>
              <div className="mt-3"><ConfirmDelete action={deleteBrandAction} id={b.id} /></div>
            </details>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6">
        <h2 className="mb-4 font-semibold">Add brand</h2>
        <form action={saveBrandAction} className="grid gap-4 sm:grid-cols-3"><BrandFields /><div><button className="btn-primary">Add brand</button></div></form>
      </Panel>
    </>
  );
}

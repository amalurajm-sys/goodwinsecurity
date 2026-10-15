import { AdminHeader, ConfirmDelete, Field, Flash, Panel } from "@/components/admin";
import { getCategories } from "@/lib/queries";
import { deleteCategoryAction, saveCategoryAction } from "../../actions";

export const metadata = { title: "Categories" };

export default async function Categories({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const cats = getCategories();
  return (
    <>
      <AdminHeader title="Product categories" />
      <Flash saved={saved} error={error} />
      <div className="space-y-3">
        {cats.map((c) => (
          <Panel key={c.id}>
            <details>
              <summary className="flex cursor-pointer items-center justify-between gap-3"><span className="font-semibold">{c.name}</span><span className="text-xs text-slate-500">{c.count} products · order {c.sort} · edit</span></summary>
              <form action={saveCategoryAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_100px]">
                <input type="hidden" name="id" value={c.id} />
                <Field label="Name" name="name" defaultValue={c.name} required />
                <Field label="URL slug" name="slug" defaultValue={c.slug} />
                <Field label="Order" name="sort" type="number" defaultValue={c.sort} />
                <div className="sm:col-span-3"><Field label="Description" name="description" defaultValue={c.description} rows={2} /></div>
                <div className="flex gap-3 sm:col-span-3"><button className="btn-primary">Save</button></div>
              </form>
              <div className="mt-3"><ConfirmDelete action={deleteCategoryAction} id={c.id} /></div>
            </details>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6">
        <h2 className="mb-4 font-semibold">Add category</h2>
        <form action={saveCategoryAction} className="grid gap-4 sm:grid-cols-[1fr_100px]">
          <Field label="Name" name="name" required />
          <Field label="Order" name="sort" type="number" defaultValue={cats.length} />
          <div className="sm:col-span-2"><Field label="Description" name="description" rows={2} /></div>
          <div><button className="btn-primary">Add category</button></div>
        </form>
      </Panel>
    </>
  );
}

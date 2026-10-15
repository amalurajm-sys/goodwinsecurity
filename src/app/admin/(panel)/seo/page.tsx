import { AdminHeader, Field, Flash, Panel } from "@/components/admin";
import { getAllPageSeo } from "@/lib/queries";
import { saveSeoAction } from "../../actions";

export const metadata = { title: "SEO" };
const PAGES = ["/", "/about", "/products", "/services", "/brands", "/projects", "/contact", "/quote"];

export default async function Seo({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const rows = Object.fromEntries(getAllPageSeo().map((r) => [r.path, r]));
  return (
    <>
      <AdminHeader title="SEO titles & descriptions" />
      <p className="mb-5 max-w-2xl text-sm text-slate-600">Leave fields empty to use the built-in defaults. Titles: up to ~60 characters. Descriptions: up to ~160 characters. Product and project pages use their own name and summary.</p>
      <Flash saved={saved} error={error} />
      <div className="space-y-4">
        {PAGES.map((p) => (
          <Panel key={p}>
            <form action={saveSeoAction} className="grid gap-4 lg:grid-cols-[120px_1fr_1.5fr_auto] lg:items-end">
              <input type="hidden" name="path" value={p} />
              <p className="font-mono text-sm font-semibold">{p}</p>
              <Field label="Title" name="title" defaultValue={rows[p]?.title ?? ""} maxLength={70} />
              <Field label="Meta description" name="description" defaultValue={rows[p]?.description ?? ""} maxLength={170} />
              <button className="btn-primary">Save</button>
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}

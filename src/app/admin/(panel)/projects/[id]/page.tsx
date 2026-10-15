import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete, Flash, Panel } from "@/components/admin";
import { getProjectById, getProjectImages } from "@/lib/queries";
import { deleteProjectAction, updateProjectImageAction } from "../../../actions";
import { ProjectForm } from "../ProjectForm";
export const metadata = { title: "Edit project" };
export default async function EditProject({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await params; const { saved, error } = await searchParams;
  const p = getProjectById(Number(id)); if (!p) notFound();
  const images = getProjectImages(p.id);
  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/projects" className="text-brand">← Projects</Link></p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{p.title}</h1>
        <div className="flex gap-2">{p.published === 1 && <a href={`/projects/${p.slug}`} target="_blank" className="btn-outline">View ↗</a>}<ConfirmDelete action={deleteProjectAction} id={p.id} /></div></div>
      <Flash saved={saved} error={error} />
      <ProjectForm p={p} />
      <Panel className="mt-6">
        <h2 className="font-semibold">Gallery ({images.length})</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((im) => (
            <li key={im.id} className="rounded-lg border border-slate-200 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.path} alt="" className="aspect-[4/3] w-full rounded object-cover" />
              <form action={updateProjectImageAction} className="mt-2 flex gap-2">
                <input type="hidden" name="image_id" value={im.id} /><input type="hidden" name="project_id" value={p.id} />
                <label className="sr-only" htmlFor={`cap-${im.id}`}>Caption</label>
                <input id={`cap-${im.id}`} name="caption" defaultValue={im.caption} placeholder="Caption" className="input py-1.5 text-sm" />
                <button className="rounded-md bg-slate-100 px-2 text-xs font-semibold">Save</button>
                <button name="delete" value="1" className="rounded-md bg-red-50 px-2 text-xs font-semibold text-red-700">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        {!images.length && <p className="mt-2 text-sm text-slate-500">Upload gallery photos with the form above.</p>}
      </Panel>
    </>
  );
}

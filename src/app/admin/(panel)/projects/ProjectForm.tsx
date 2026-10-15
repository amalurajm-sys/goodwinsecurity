import { Check, Field, Panel, Thumb } from "@/components/admin";
import type { Project } from "@/lib/queries";
import { saveProjectAction } from "../../actions";

export function ProjectForm({ p }: { p?: Project | null }) {
  return (
    <form action={saveProjectAction} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Panel className="space-y-4">
        <Field label="Project title" name="title" defaultValue={p?.title} required maxLength={200} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" name="category" defaultValue={p?.category} hint="e.g. Retail, Commercial, Residential" />
          <Field label="General location" name="location" defaultValue={p?.location} hint="Only if approved for publication" />
        </div>
        <Field label="Installed systems" name="systems" defaultValue={p?.systems} hint="e.g. IP cameras, NVR, access control" />
        <Field label="Description" name="description" defaultValue={p?.description} rows={8} maxLength={8000} />
      </Panel>
      <div className="space-y-6">
        <Panel className="space-y-3">
          <Check label="Published" name="published" defaultChecked={p ? p.published === 1 : false} />
          <Check label="Sample / placeholder" name="is_sample" defaultChecked={p?.is_sample === 1} />
          <button className="btn-primary w-full justify-center">Save project</button>
        </Panel>
        <Panel className="space-y-3">
          <label htmlFor="f-cover" className="label">Cover photo</label>
          <input id="f-cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="block text-sm" />
          {p?.cover_path && <><Thumb path={p.cover_path} /><Check label="Remove cover" name="remove_cover" /></>}
          <label htmlFor="f-gallery" className="label mt-3">Add gallery photos</label>
          <input id="f-gallery" name="gallery" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block text-sm" />
          <p className="text-xs text-slate-500">Up to 20 at a time, 5 MB each. Before/after and installation photos.</p>
        </Panel>
        <Panel><Field label="URL slug" name="slug" defaultValue={p?.slug} hint="Leave blank to generate from the title." /></Panel>
      </div>
    </form>
  );
}

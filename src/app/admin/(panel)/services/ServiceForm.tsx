import { Check, Field, Panel, Thumb } from "@/components/admin";
import type { Service } from "@/lib/queries";
import { saveServiceAction } from "../../actions";

const ICONS = ["camera", "wrench", "key", "intercom", "network", "upgrade", "alarm", "recorder", "ip", "shield", "headset"];

export function ServiceForm({ s }: { s?: Service | null }) {
  return (
    <form action={saveServiceAction} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {s && <input type="hidden" name="id" value={s.id} />}
      <Panel className="space-y-4">
        <Field label="Title" name="title" defaultValue={s?.title} required maxLength={160} />
        <Field label="Short summary" name="summary" defaultValue={s?.summary} rows={2} maxLength={400} />
        <Field label="Description" name="description" defaultValue={s?.description} rows={6} maxLength={5000} />
        <Field label="Benefits" name="benefits" defaultValue={s?.benefits.join("\n")} rows={6} hint="One benefit per line." />
      </Panel>
      <div className="space-y-6">
        <Panel className="space-y-3">
          <Check label="Published" name="published" defaultChecked={s ? s.published === 1 : true} />
          <button className="btn-primary w-full justify-center">Save service</button>
        </Panel>
        <Panel className="space-y-3">
          <div><label htmlFor="f-icon" className="label">Icon</label><select id="f-icon" name="icon" defaultValue={s?.icon ?? "shield"} className="input">{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
          <label htmlFor="f-image" className="label">Photo (optional)</label>
          <input id="f-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block text-sm" />
          {s?.image_path && <><Thumb path={s.image_path} /><Check label="Remove photo" name="remove_image" /></>}
        </Panel>
        <Panel className="space-y-4">
          <Field label="Order" name="sort" type="number" defaultValue={s?.sort ?? 0} />
          <Field label="Anchor / slug" name="slug" defaultValue={s?.slug} hint="Used in links like /services#slug" />
        </Panel>
      </div>
    </form>
  );
}

import { Check, Field, Panel, Thumb } from "@/components/admin";
import type { Product } from "@/lib/queries";
import { getBrands, getCategories } from "@/lib/queries";
import { saveProductAction } from "../../actions";

const PLACEHOLDERS = ["turret", "bullet", "dome", "recorder", "drive", "terminal", "intercom", "alarm", "switch", "accessory", "cable", "power"];

export function ProductForm({ p }: { p?: Product | null }) {
  const cats = getCategories(); const brands = getBrands();
  const placeholder = p?.image_path.startsWith("icon:") ? p.image_path.slice(5) : "turret";
  return (
    <form action={saveProductAction} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Panel className="space-y-4">
        <Field label="Product name" name="name" defaultValue={p?.name} required maxLength={200} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Model number" name="model" defaultValue={p?.model} maxLength={120} />
          <Field label="SKU" name="sku" defaultValue={p?.sku} maxLength={120} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="f-category_id" className="label">Category</label>
            <select id="f-category_id" name="category_id" defaultValue={p?.category_id ?? ""} className="input"><option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label htmlFor="f-brand_id" className="label">Brand / manufacturer</label>
            <select id="f-brand_id" name="brand_id" defaultValue={p?.brand_id ?? ""} className="input"><option value="">—</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        </div>
        <Field label="Short summary" name="summary" defaultValue={p?.summary} rows={2} maxLength={400} hint="Shown on product cards." />
        <Field label="Description" name="description" defaultValue={p?.description} rows={5} maxLength={5000} />
        <Field label="Specifications" name="specs" rows={7} maxLength={10000}
          defaultValue={p?.specs.map((s) => `${s.label}: ${s.value}`).join("\n")} hint="One per line, as Label: Value — copy from the manufacturer's datasheet." />
        <Field label="Compatibility information" name="compatibility" defaultValue={p?.compatibility} rows={3} maxLength={2000} />
        <Field label="Available accessories" name="accessories" defaultValue={p?.accessories} rows={3} maxLength={2000} />
      </Panel>
      <div className="space-y-6">
        <Panel className="space-y-3">
          <Check label="Published" name="published" defaultChecked={p ? p.published === 1 : true} />
          <Check label="Featured on homepage" name="featured" defaultChecked={p?.featured === 1} />
          <Check label="Sample / placeholder (shows a 'Sample listing' badge)" name="is_sample" defaultChecked={p?.is_sample === 1} />
          <button className="btn-primary mt-2 w-full justify-center">Save product</button>
        </Panel>
        <Panel className="space-y-3">
          <label htmlFor="f-image" className="label">Product photo</label>
          <input id="f-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
          <p className="text-xs text-slate-500">JPG, PNG or WebP, max 5 MB. Square images work best.</p>
          {p && <Thumb path={p.image_path} />}
          {p?.image_path && !p.image_path.startsWith("icon:") && <Check label="Remove photo" name="remove_image" />}
          <div><label htmlFor="f-placeholder" className="label mt-3">Illustration (used when no photo)</label>
            <select id="f-placeholder" name="placeholder" defaultValue={placeholder} className="input">{PLACEHOLDERS.map((x) => <option key={x}>{x}</option>)}</select></div>
        </Panel>
        <Panel><Field label="URL slug" name="slug" defaultValue={p?.slug} maxLength={80} hint="Leave blank to generate from the name." /></Panel>
      </div>
    </form>
  );
}

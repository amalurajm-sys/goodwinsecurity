import { AdminHeader, Check, Field, Flash, Panel, Thumb } from "@/components/admin";
import { requireUser } from "@/lib/auth";
import { mailConfigured } from "@/lib/mail";
import { getSettings } from "@/lib/queries";
import { saveSettingsAction } from "../../actions";

export const metadata = { title: "Company & homepage" };

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireUser("admin");
  const { saved, error } = await searchParams;
  const s = getSettings();
  return (
    <>
      <AdminHeader title="Company & homepage" />
      <Flash saved={saved} error={error} />
      <form action={saveSettingsAction} className="space-y-6">
        <Panel className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Company</h2>
          <Field label="Company name" name="company_name" defaultValue={s.company_name} required />
          <Field label="Country" name="country" defaultValue={s.country} />
          <div className="sm:col-span-2"><Field label="Short description (footer)" name="short_description" defaultValue={s.short_description} rows={2} /></div>
        </Panel>
        <Panel className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Contact details <span className="text-sm font-normal text-slate-500">— only enter verified details; empty fields are hidden on the site</span></h2>
          <Field label="Telephone" name="phone" defaultValue={s.phone} hint="e.g. +973 1234 5678" />
          <Field label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} hint="With country code, e.g. 97312345678" />
          <Field label="Public email" name="email" type="email" defaultValue={s.email} />
          <Field label="Opening hours" name="opening_hours" defaultValue={s.opening_hours} />
          <div className="sm:col-span-2"><Field label="Street address" name="address" defaultValue={s.address} /></div>
          <div className="sm:col-span-2"><Field label="Google Maps embed URL" name="map_embed_url" defaultValue={s.map_embed_url} hint="Google Maps → Share → Embed a map → copy only the src URL (https://www.google.com/maps/embed?pb=…)" /></div>
        </Panel>
        <Panel className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Enquiry notifications</h2>
          <Field label="Send new enquiries to" name="notify_email" type="email" defaultValue={s.notify_email} hint="Overrides ENQUIRY_NOTIFY_EMAIL from the server environment." />
          <p className="self-end text-sm text-slate-600">{mailConfigured() ? "✅ SMTP is configured on the server." : "⚠️ SMTP is not configured on the server — enquiries are stored here but not emailed."}</p>
          <div className="sm:col-span-2"><Check label="Initial consultations are free (changes the call-to-action wording)" name="free_consultation" defaultChecked={s.free_consultation === "1"} /></div>
        </Panel>
        <Panel className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Social media</h2>
          <Field label="Facebook URL" name="facebook" defaultValue={s.facebook} />
          <Field label="Instagram URL" name="instagram" defaultValue={s.instagram} />
          <Field label="LinkedIn URL" name="linkedin" defaultValue={s.linkedin} />
          <Field label="X (Twitter) URL" name="x_twitter" defaultValue={s.x_twitter} />
        </Panel>
        <Panel className="grid gap-4">
          <h2 className="font-semibold">Homepage banner</h2>
          <Field label="Heading" name="hero_heading" defaultValue={s.hero_heading} />
          <Field label="Supporting text" name="hero_text" defaultValue={s.hero_text} rows={3} />
          <div>
            <label htmlFor="f-hero" className="label">Banner photo</label>
            <input id="f-hero" name="hero_image_file" type="file" accept="image/jpeg,image/png,image/webp" className="block text-sm" />
            <p className="mt-1 text-xs text-slate-500">Optional. Landscape, at least 1400px wide. Without a photo the homepage shows an illustration.</p>
            {s.hero_image && <><Thumb path={s.hero_image} /><div className="mt-2"><Check label="Remove photo" name="remove_hero_image" /></div></>}
          </div>
        </Panel>
        <Panel className="grid gap-4">
          <h2 className="font-semibold">About Us page</h2>
          <Field label="Company overview" name="about_overview" defaultValue={s.about_overview} rows={4} />
          <Field label="Our approach" name="about_approach" defaultValue={s.about_approach} rows={4} />
          <Field label="Our commitment to customers" name="about_commitment" defaultValue={s.about_commitment} rows={3} />
        </Panel>
        <button className="btn-primary">Save settings</button>
      </form>
    </>
  );
}

import Link from "next/link";
import { AdminHeader, Panel } from "@/components/admin";
import { getDb } from "@/lib/db";
import { mailConfigured } from "@/lib/mail";
import { ENQUIRY_STATUSES, enquiryCounts, getEnquiries, getSettings } from "@/lib/queries";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const counts = enquiryCounts();
  const recent = getEnquiries().slice(0, 6);
  const db = getDb();
  const n = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  const samples = n("SELECT COUNT(*) AS n FROM products WHERE is_sample = 1") + n("SELECT COUNT(*) AS n FROM projects WHERE is_sample = 1");
  const s = getSettings();
  const missing = [["phone", "Phone number"], ["email", "Public email"], ["whatsapp", "WhatsApp number"], ["address", "Street address"]].filter(([k]) => !s[k]).map(([, l]) => l);

  return (
    <>
      <AdminHeader title="Dashboard" />
      {denied && <p role="alert" className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">That section is only available to administrators.</p>}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ENQUIRY_STATUSES.map((st) => (
          <Link key={st} href={`/admin/enquiries?status=${encodeURIComponent(st)}`} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand">
            <p className="text-sm text-slate-500">{st}</p><p className="mt-1 font-display text-3xl font-bold text-navy-900">{counts[st] ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Latest enquiries</h2><Link href="/admin/enquiries" className="text-sm font-semibold text-brand">View all</Link></div>
          {recent.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {recent.map((e) => (
                <li key={e.id}><Link href={`/admin/enquiries/${e.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-brand">
                  <span><span className="font-mono text-xs text-slate-500">{e.ref}</span><span className="block font-medium">{e.name}</span></span>
                  <span className="text-right text-xs text-slate-500">{e.status}<span className="block">{e.created_at.slice(0, 16)} UTC</span></span>
                </Link></li>
              ))}
            </ul>
          ) : <p className="mt-4 text-sm text-slate-500">No enquiries yet.</p>}
        </Panel>
        <div className="space-y-6">
          <Panel>
            <h2 className="text-lg font-semibold">Setup checklist</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>{mailConfigured() ? "✅ Email notifications configured" : "⚠️ Email (SMTP) not configured — enquiries are saved here only"}</li>
              <li>{missing.length ? `⚠️ Missing company details: ${missing.join(", ")}` : "✅ Company contact details entered"}</li>
              <li>{samples ? `⚠️ ${samples} sample products/projects still published` : "✅ No sample content"}</li>
              <li>{s.hero_image ? "✅ Homepage photo uploaded" : "ℹ️ Homepage uses an illustration — upload a photo in Company & homepage"}</li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

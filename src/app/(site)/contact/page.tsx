import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/ui";
import { getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatBhPhone, telHref, waHref } from "@/lib/site";

export function generateMetadata() {
  return pageMeta("/contact", "Contact Us – Security Systems Bahrain",
    "Contact GOODWIN SECURITY W.L.L. for CCTV, access control and security system enquiries, quotations and maintenance in Bahrain.");
}

function safeMapUrl(u: string): string {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && /(^|\.)google\.com$/.test(url.hostname) && url.pathname.startsWith("/maps/embed") ? url.toString() : "";
  } catch { return ""; }
}

export default function ContactPage() {
  const s = getSettings();
  const services = getServices().map((v) => v.title);
  const map = safeMapUrl(s.map_embed_url);
  const items = [
    { icon: "building", label: "Company", value: s.company_name },
    { icon: "pin", label: "Location", value: s.address ? `${s.address}, ${s.country}` : s.country },
    s.phone && { icon: "phone", label: "Telephone", value: formatBhPhone(s.phone), href: telHref(s.phone) },
    s.whatsapp && { icon: "whatsapp", label: "WhatsApp", value: "Chat on WhatsApp", href: waHref(s.whatsapp), ext: true },
    s.email && { icon: "mail", label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.opening_hours && { icon: "clock", label: "Hours", value: s.opening_hours },
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string; ext?: boolean }[];

  return (
    <>
      <PageHero eyebrow="Contact Us" title="Talk to our team" crumbs={[{ label: "Contact Us" }]}
        intro="Business enquiries, product quotations, installation requests or service and maintenance — send us your details and we'll get back to you." />
      <section className="section bg-slate-50">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-navy-950 p-7 text-white">
              <h2 className="text-xl font-semibold text-white">Contact details</h2>
              <ul className="mt-6 space-y-5">
                {items.map((it) => (
                  <li key={it.label} className="flex gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-light"><Icon name={it.icon} className="h-5 w-5" /></span>
                    <span><span className="block text-xs uppercase tracking-wider text-slate-400">{it.label}</span>
                      {it.href ? <a href={it.href} className="font-medium text-white hover:text-brand-light" {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{it.value}</a> : <span className="font-medium">{it.value}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              {!s.phone && !s.email && <p className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">Direct phone and email details will be published here shortly. In the meantime, please use the enquiry form.</p>}
            </div>
            {map ? (
              <iframe src={map} title={`Map showing ${s.company_name}`} className="aspect-[4/3] w-full rounded-2xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500">
                <Icon name="pin" className="h-8 w-8 text-slate-300" /><span className="mt-2">Serving customers across Bahrain</span>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Send an enquiry</h2>
            <p className="mt-2 text-slate-600">Fields marked * are required.</p>
            <div className="mt-6"><EnquiryForm services={services} /></div>
          </div>
        </div>
      </section>
    </>
  );
}

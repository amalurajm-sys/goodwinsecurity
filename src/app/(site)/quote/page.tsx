import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/ui";
import { getProductById, getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { ENQUIRY_TYPES } from "@/lib/site";

export function generateMetadata() {
  return pageMeta("/quote", "Request a Quote – CCTV & Security Systems Bahrain",
    "Request a price or quotation for CCTV cameras, installation, maintenance or a complete security system in Bahrain.", { robots: { index: true, follow: true } });
}

type SP = Promise<{ product?: string; type?: string; service?: string; item?: string }>;

export default async function QuotePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const pid = Number(sp.product);
  const p = Number.isInteger(pid) && pid > 0 ? getProductById(pid) : null;
  const product = p && p.published ? { id: p.id, label: `${p.name}${p.model ? ` (${p.model})` : ""}` } : null;
  const type = ENQUIRY_TYPES.some((t) => t.value === sp.type) ? sp.type! : product ? "product-price" : "complete-system";
  const s = getSettings();

  return (
    <>
      <PageHero eyebrow="Request a Quote" title={product ? "Request a price" : "Request a quote"} crumbs={[{ label: "Request a Quote" }]}
        intro="Tell us what you need — a product price, an installation, maintenance, or a complete security system — and we'll prepare a quotation." />
      <section className="section bg-slate-50">
        <div className="container-site grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <EnquiryForm defaultType={type} product={product} defaultItem={(sp.item ?? "").slice(0, 200)}
              defaultService={(sp.service ?? "").slice(0, 160)} services={getServices().map((v) => v.title)} />
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl bg-navy-950 p-7 text-white">
              <h2 className="text-lg font-semibold text-white">What happens next</h2>
              <ol className="mt-5 space-y-4 text-sm text-slate-300">
                {["You receive a reference number straight away.", "Our team reviews your requirements.", "We contact you to clarify details or arrange a site visit if needed.", "You receive a quotation."].map((t, i) => (
                  <li key={t} className="flex gap-3"><span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span>{t}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              <Icon name="shield" className="h-6 w-6 text-brand" />
              <p className="mt-3">{s.free_consultation === "1" ? "Initial consultations are free of charge." : "Prices depend on the exact model, quantity and site requirements, and are confirmed in your quotation."}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

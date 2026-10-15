import { PageHero } from "@/components/ui";
import { getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/terms", "Terms and Conditions", "Terms for using the GOODWIN SECURITY W.L.L. website.");
}

export default function TermsPage() {
  const s = getSettings();
  return (
    <>
      <PageHero title="Terms and Conditions" crumbs={[{ label: "Terms and Conditions" }]} />
      <article className="container-site max-w-3xl py-14 text-slate-700 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mb-4">
        <p className="text-sm text-slate-500">These terms are a general template and should be reviewed by {s.company_name} (and its legal adviser, if appropriate) before publication.</p>
        <h2>Use of this website</h2>
        <p>This website is provided by {s.company_name} for general information about our products and services. By using it you agree to these terms.</p>
        <h2>Product information</h2>
        <p>Product descriptions, images and specifications are provided for guidance only. Specifications, availability and compatibility depend on the specific model and supplier and must be confirmed in a written quotation. Listings marked as samples are placeholders and do not represent products currently offered.</p>
        <h2>Prices and quotations</h2>
        <p>Prices are not displayed on this website. Any price, scope of work, warranty or delivery period applies only when confirmed in a written quotation from {s.company_name}.</p>
        <h2>Trademarks</h2>
        <p>Third-party brand names and logos are the property of their respective owners and are used only to identify products. Their use does not imply endorsement, partnership or authorised distributor status unless expressly stated.</p>
        <h2>Limitation of liability</h2>
        <p>While we take care to keep information on this website accurate, we do not guarantee that it is complete or current, and we are not liable for loss arising from reliance on it, to the extent permitted by law.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the {s.country}.</p>
      </article>
    </>
  );
}

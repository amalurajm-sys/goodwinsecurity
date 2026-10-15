import { PageHero } from "@/components/ui";
import { getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta("/privacy", "Privacy Policy", "How GOODWIN SECURITY W.L.L. collects and uses information submitted through this website.");
}

export default function PrivacyPage() {
  const s = getSettings();
  const contact = s.email ? <a href={`mailto:${s.email}`} className="text-brand underline">{s.email}</a> : <a href="/contact" className="text-brand underline">our contact page</a>;
  return (
    <>
      <PageHero title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} />
      <article className="container-site max-w-3xl py-14 text-slate-700 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:space-y-1">
        <p className="text-sm text-slate-500">This policy is a general template and should be reviewed by {s.company_name} (and its legal adviser, if appropriate) before publication.</p>
        <h2>Who we are</h2>
        <p>This website is operated by {s.company_name}, {s.country}.</p>
        <h2>Information we collect</h2>
        <p>When you submit an enquiry or quotation request, we collect the details you provide, such as your name, company name, email address, phone number, preferred contact method, the products or services you are interested in, and your message.</p>
        <p>Our servers also record standard technical information (such as IP address and browser type) for security, spam prevention and troubleshooting.</p>
        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your enquiry and prepare quotations.</li>
          <li>To arrange site visits, installations, maintenance or support you have requested.</li>
          <li>To protect the website against spam and misuse.</li>
        </ul>
        <p>We do not sell your personal information.</p>
        <h2>Sharing</h2>
        <p>We may share information with service providers who help us operate the website and email (for example, hosting and email delivery providers), and where required by law.</p>
        <h2>Retention</h2>
        <p>We keep enquiry records only as long as needed to respond to you, provide our services and meet our business and legal obligations.</p>
        <h2>Cookies</h2>
        <p>This website uses only cookies that are necessary for it to work (for example, to keep administrators signed in). It does not use advertising cookies.</p>
        <h2>Your choices</h2>
        <p>You may ask us to access, correct or delete the personal information you have submitted by contacting us via {contact}.</p>
        <h2>Changes</h2>
        <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
      </article>
    </>
  );
}

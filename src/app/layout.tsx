import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "GOODWIN SECURITY W.L.L. | Security Systems Bahrain", template: "%s | GOODWIN SECURITY W.L.L." },
  description: "CCTV, access control, video intercom and security system installation and maintenance in Bahrain.",
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#060E24", width: "device-width", initialScale: 1 };

function orgJsonLd(s: Record<string, string>) {
  // Only fields that have actually been entered by the administrator are published.
  const sameAs = [s.facebook, s.instagram, s.linkedin, s.x_twitter].filter(Boolean);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.company_name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: s.short_description,
    areaServed: { "@type": "Country", name: "Bahrain" },
  };
  if (s.email) data.email = s.email;
  if (s.phone) data.telephone = s.phone;
  if (sameAs.length) data.sameAs = sameAs;
  if (s.address) data.address = { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "BH" };
  return data;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <html lang="en" dir="ltr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd(s)).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}

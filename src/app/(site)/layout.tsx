import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSettings } from "@/lib/queries";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {s.whatsapp && <WhatsAppFab number={s.whatsapp} />}
    </>
  );
}

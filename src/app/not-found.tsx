import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="bg-navy-950 py-28 text-center text-white">
        <p className="eyebrow text-brand-light">Error 404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-300">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn-primary">Go to home</Link><Link href="/contact" className="btn-ghost">Contact us</Link></div>
      </main>
      <Footer />
    </>
  );
}

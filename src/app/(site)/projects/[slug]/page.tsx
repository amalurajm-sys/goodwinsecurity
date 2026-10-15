import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, SampleNotice } from "@/components/ui";
import { getProjectBySlug, getProjectImages } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { ProjectCover } from "@/components/ProjectCover";

type P = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: P }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return { title: "Project not found" };
  return pageMeta(`/projects/${p.slug}`, p.title, p.description.slice(0, 155), p.is_sample ? { robots: { index: false, follow: true } } : {});
}

export default async function ProjectPage({ params }: { params: P }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();
  const images = getProjectImages(p.id);
  return (
    <>
      <PageHero eyebrow={p.category} title={p.title} crumbs={[{ href: "/projects", label: "Projects" }, { label: p.title }]} />
      <section className="section bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {p.is_sample === 1 && <div className="mb-6"><SampleNotice>This is a sample placeholder, not a completed project.</SampleNotice></div>}
            <div className="aspect-[16/10] overflow-hidden rounded-3xl"><ProjectCover path={p.cover_path} title={p.title} /></div>
            <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-slate-700">{p.description}</p>
            {images.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold">Gallery</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {images.map((im) => (
                    <li key={im.id}>
                      <figure>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.path} alt={im.caption || p.title} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                        {im.caption && <figcaption className="mt-2 text-sm text-slate-500">{im.caption}</figcaption>}
                      </figure>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-24">
            <dl className="space-y-4 text-sm">
              <div><dt className="font-semibold text-navy-900">Category</dt><dd className="mt-1 text-slate-600">{p.category || "—"}</dd></div>
              {p.location && <div><dt className="font-semibold text-navy-900">Location</dt><dd className="mt-1 text-slate-600">{p.location}</dd></div>}
              {p.systems && <div><dt className="font-semibold text-navy-900">Systems installed</dt><dd className="mt-1 text-slate-600">{p.systems}</dd></div>}
            </dl>
            <Link href="/quote?type=complete-system" className="btn-primary mt-6 w-full justify-center">Discuss a similar project</Link>
          </aside>
        </div>
      </section>
    </>
  );
}

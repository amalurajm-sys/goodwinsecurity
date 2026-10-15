import Link from "next/link";
import { PageHero, SampleNotice } from "@/components/ui";
import { getProjects } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { ProjectCover } from "@/components/ProjectCover";

export function generateMetadata() {
  return pageMeta("/projects", "Projects & Applications – CCTV Installations Bahrain",
    "Security system installations and applications by GOODWIN SECURITY W.L.L. — CCTV, access control and networking projects in Bahrain.");
}

export default function ProjectsPage() {
  const projects = getProjects();
  const hasSamples = projects.some((p) => p.is_sample);
  return (
    <>
      <PageHero eyebrow="Projects & Applications" title="Security installations" crumbs={[{ label: "Projects" }]}
        intro="A selection of security system installations across residential, commercial and industrial sites." />
      <section className="section bg-slate-50">
        <div className="container-site">
          {hasSamples && <div className="mb-8"><SampleNotice>Entries marked <strong>Sample</strong> are placeholders showing how projects will be presented. They are not completed projects.</SampleNotice></div>}
          {projects.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.slug}`} className="card group block overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ProjectCover path={p.cover_path} title={p.title} />
                      {p.is_sample === 1 && <span className="sample-badge absolute left-3 top-3">Sample</span>}
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand">{p.category}{p.location ? ` · ${p.location}` : ""}</p>
                      <h2 className="mt-2 text-lg font-semibold group-hover:text-brand">{p.title}</h2>
                      {p.systems && <p className="mt-2 text-sm text-slate-600">{p.systems}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">Project case studies will be published here soon.</p>
          )}
        </div>
      </section>
    </>
  );
}

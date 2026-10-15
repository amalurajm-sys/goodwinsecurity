import { Icon } from "./Icon";

export function ProjectCover({ path, title }: { path: string; title: string }) {
  if (path) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={path} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />;
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <Icon name="camera" className="relative h-16 w-16 text-brand-light/60" />
      <span className="absolute bottom-3 right-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Photo to be added</span>
    </div>
  );
}


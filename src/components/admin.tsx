import Link from "next/link";

export function AdminHeader({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action && <Link href={action.href} className="btn-primary">{action.label}</Link>}
    </div>
  );
}

export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>;
  if (saved) return <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Changes saved.</p>;
  return null;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Field({ label, name, defaultValue = "", type = "text", hint, required, rows, maxLength }: {
  label: string; name: string; defaultValue?: string | number; type?: string; hint?: string; required?: boolean; rows?: number; maxLength?: number;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && <span className="text-red-600"> *</span>}</label>
      {rows ? (
        <textarea id={id} name={name} defaultValue={defaultValue} rows={rows} required={required} maxLength={maxLength} className="input" />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue} required={required} maxLength={maxLength} className="input" />
      )}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-navy-900">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand" /> {label}
    </label>
  );
}

export function ConfirmDelete({ action, id, label = "Delete", name = "id" }: { action: (fd: FormData) => Promise<void>; id: number; label?: string; name?: string }) {
  return (
    <details className="relative inline-block">
      <summary className="cursor-pointer list-none rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">{label}…</summary>
      <form action={action} className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-lg">
        <input type="hidden" name={name} value={id} />
        <p className="text-slate-600">This can't be undone.</p>
        <button className="mt-2 w-full rounded-md bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700">Confirm {label.toLowerCase()}</button>
      </form>
    </details>
  );
}

export function Thumb({ path }: { path: string }) {
  if (!path || path.startsWith("icon:")) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={path} alt="" className="mt-2 h-24 w-auto rounded-lg border border-slate-200 object-cover" />;
}

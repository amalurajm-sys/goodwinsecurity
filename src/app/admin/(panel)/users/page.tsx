import { AdminHeader, ConfirmDelete, Field, Flash, Panel } from "@/components/admin";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { changePasswordAction, createUserAction, deleteUserAction } from "../../actions";

export const metadata = { title: "Users" };

export default async function Users({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const me = await requireUser();
  const { saved, error } = await searchParams;
  const users = me.role === "admin" ? (getDb().prepare("SELECT id, email, role, created_at FROM admin_users ORDER BY id").all() as { id: number; email: string; role: string; created_at: string }[]) : [];
  return (
    <>
      <AdminHeader title={me.role === "admin" ? "Users" : "My account"} />
      <Flash saved={saved} error={error} />
      {me.role === "admin" && (
        <>
          <ul className="mb-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-4 p-4">
                <span><span className="font-semibold">{u.email}</span><span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs uppercase">{u.role}</span></span>
                {u.id !== me.uid && <ConfirmDelete action={deleteUserAction} id={u.id} />}
              </li>
            ))}
          </ul>
          <Panel className="mb-6">
            <h2 className="mb-4 font-semibold">Add user</h2>
            <form action={createUserAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end">
              <Field label="Email" name="email" type="email" required />
              <Field label="Temporary password" name="password" type="password" required hint="12+ characters, letters and numbers" />
              <div><label htmlFor="f-role" className="label">Role</label><select id="f-role" name="role" className="input"><option value="editor">Editor</option><option value="admin">Admin</option></select></div>
              <button className="btn-primary">Add</button>
            </form>
            <p className="mt-3 text-xs text-slate-500">Editors manage products, services, projects, SEO and enquiries. Admins can also edit company settings, manage users and delete enquiries.</p>
          </Panel>
        </>
      )}
      <Panel>
        <h2 className="mb-4 font-semibold">Change my password</h2>
        <form action={changePasswordAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="New password" name="password" type="password" required />
          <Field label="Confirm" name="confirm" type="password" required />
          <button className="btn-primary">Update</button>
        </form>
      </Panel>
    </>
  );
}

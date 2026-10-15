import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getSession } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <form action={loginAction} className="rounded-2xl bg-white p-7 shadow-xl">
          <h1 className="text-xl font-bold">Admin sign in</h1>
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          <label htmlFor="email" className="label mt-5">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className="input" />
          <label htmlFor="password" className="label mt-4">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
          <button className="btn-primary mt-6 w-full justify-center">Sign in</button>
        </form>
      </div>
    </main>
  );
}

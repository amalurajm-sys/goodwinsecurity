import Link from "next/link";
import { Flash } from "@/components/admin";
import { ProjectForm } from "../ProjectForm";
export const metadata = { title: "Add project" };
export default async function NewProject({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<><p className="mb-2 text-sm"><Link href="/admin/projects" className="text-brand">← Projects</Link></p><h1 className="mb-6 text-2xl font-bold">Add project</h1><Flash error={error} /><ProjectForm /></>);
}

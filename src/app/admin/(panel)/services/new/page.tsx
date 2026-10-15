import Link from "next/link";
import { Flash } from "@/components/admin";
import { ServiceForm } from "../ServiceForm";
export const metadata = { title: "Add service" };
export default async function NewService({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<><p className="mb-2 text-sm"><Link href="/admin/services" className="text-brand">← Services</Link></p><h1 className="mb-6 text-2xl font-bold">Add service</h1><Flash error={error} /><ServiceForm /></>);
}

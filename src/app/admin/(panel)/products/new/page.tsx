import Link from "next/link";
import { Flash } from "@/components/admin";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Add product" };

export default async function NewProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<><p className="mb-2 text-sm"><Link href="/admin/products" className="text-brand">← Products</Link></p><h1 className="mb-6 text-2xl font-bold">Add product</h1><Flash error={error} /><ProductForm /></>);
}

import CustomizerClient from "./CustomizerClient";
import { Suspense } from "react";
import { getProductBySlug } from "@/lib/data/mockCatalog";
import { notFound } from "next/navigation";

type CustomizerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CustomizerPage({ params }: CustomizerPageProps) {
  // Unwrap params using await (Server Component pattern in Next.js 15+)
  const { slug } = await params;

  // Verify product exists on the server to trigger a clean 404 if needed
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading Custom Lab...</div>}>
      <CustomizerClient slug={slug} />
    </Suspense>
  );
}

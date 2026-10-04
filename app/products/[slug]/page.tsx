import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug } from "@/lib/data/mockCatalog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import JsonLd, { generateProductSchema, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Next.js Dynamic Metadata API
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | MW Trends' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mwtrends.com';

  return {
    title: `${product.name} | MW Trends`,
    description: `Buy ${product.name} at MW Trends. Premium quality and customization.`,
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | MW Trends`,
      description: `Buy ${product.name} at MW Trends. Premium quality and customization.`,
      images: [{ url: `${baseUrl}${product.images[0]}` }],
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mwtrends.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;

  const productSchema = generateProductSchema(product, productUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: baseUrl },
    { name: 'Shop', item: `${baseUrl}/shop` },
    { name: product.name, item: productUrl }
  ]);

  return (
    <>
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <ProductDetailClient slug={slug} />
    </>
  );
}

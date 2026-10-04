export type JsonLdProps = {
  schema: Record<string, any>;
};

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper to generate Product Schema
export const generateProductSchema = (product: any, url: string) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || `Buy ${product.name} at MW Trends.`,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "MW Trends"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "PKR",
      "price": product.price,
      // Default to InStock for prototype unless explicitly told otherwise
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
};

// Helper to generate Breadcrumb Schema
export const generateBreadcrumbSchema = (crumbs: { name: string; item: string }[]) => {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  };
};

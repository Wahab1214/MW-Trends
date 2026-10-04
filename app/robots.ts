import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // In a real app, this would be process.env.NEXT_PUBLIC_SITE_ENV
  const env = process.env.NODE_ENV;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mwtrends.com';

  if (env !== 'production') {
    // STAGING/DEV: Block everything
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // PRODUCTION
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/checkout/',
        '/account/',
        '/cart/',
        '/api/',
        '/track-order',
        '/*?*sort=',
        '/*?*filter='
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

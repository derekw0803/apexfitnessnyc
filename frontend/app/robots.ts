import type { MetadataRoute } from 'next';

// `output: export` (STATIC_EXPORT builds) requires every route to be
// explicitly static — metadata route handlers default to dynamic rendering
// otherwise, and the build fails outright ("dynamic ... not configured on
// route /robots.txt with output: export").
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://apexfitnessnyc.vercel.app/sitemap.xml',
  };
}

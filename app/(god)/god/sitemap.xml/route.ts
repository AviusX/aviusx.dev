/**
 * Sitemap for the god domain. Served at devoke.dev/sitemap.xml via the
 * host rewrite in middleware.ts.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://devoke.dev</loc>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

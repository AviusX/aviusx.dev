/**
 * robots.txt for the god domain. Served at devoke.dev/robots.txt via the
 * host rewrite in middleware.ts.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `User-Agent: *
Allow: /

Sitemap: https://devoke.dev/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

import { NextResponse, type NextRequest } from "next/server";

/**
 * Host-based theme routing.
 *
 * The god theme ("Devo ke Dev") lives at the internal /god route and is
 * served at the root of devoke.dev via rewrites, so both themes stay fully
 * statically generated. The matcher below keeps this proxy off every
 * static asset — it only runs for the handful of page/SEO paths it manages.
 *
 * To route a new theme's domain, add its hosts and internal base path here.
 */

const GOD_HOSTS = new Set([
  "devoke.dev",
  "www.devoke.dev",
  // Local development: http://god.localhost:3000
  "god.localhost",
  ...(process.env.NEXT_PUBLIC_GOD_HOSTS?.split(",").map((h) => h.trim()) ??
    []),
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";
  const { pathname } = request.nextUrl;
  const isGodHost = GOD_HOSTS.has(host);

  if (isGodHost) {
    // Serve the god theme at the domain root, plus its own SEO files.
    const rewrites: Record<string, string> = {
      "/": "/god",
      "/robots.txt": "/god/robots.txt",
      "/sitemap.xml": "/god/sitemap.xml",
    };
    const target = rewrites[pathname];
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.rewrite(url);
    }
    // Canonical hygiene: the internal path redirects to the root.
    if (pathname === "/god") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  // On the primary domain, the internal /god route redirects to the god
  // domain (kept accessible in dev/preview for local testing).
  if (
    (pathname === "/god" || pathname.startsWith("/god/")) &&
    (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production"
  ) {
    return NextResponse.redirect("https://devoke.dev", 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/god", "/god/:path*", "/robots.txt", "/sitemap.xml"],
};

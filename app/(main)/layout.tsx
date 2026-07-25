import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { mainContent } from "@/lib/site/main";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const { meta } = mainContent;

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: meta.authorName, url: meta.siteUrl }],
  creator: meta.authorName,
  alternates: {
    canonical: meta.siteUrl,
  },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.siteUrl,
    siteName: meta.authorName,
    locale: meta.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    creator: meta.twitterCreator,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Google Search Console: paste your verification code below once you have it.
  // verification: { google: "YOUR_VERIFICATION_CODE" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {mainContent.jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="noise min-h-screen">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

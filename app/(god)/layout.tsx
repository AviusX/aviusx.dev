import type { Metadata, Viewport } from "next";
import {
  Cinzel_Decorative,
  Geist,
  Geist_Mono,
  Rozha_One,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { godContent } from "@/lib/site/god";
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

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-god-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const rozhaOne = Rozha_One({
  variable: "--font-god-deva",
  subsets: ["latin", "devanagari"],
  weight: "400",
  display: "swap",
});

const { meta } = godContent;

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
    siteName: "Devo ke Dev",
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
};

export const viewport: Viewport = {
  themeColor: meta.themeColor,
};

export default function GodRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="god"
      style={{ colorScheme: "dark" }}
      className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} ${rozhaOne.variable} antialiased`}
    >
      <head>
        {godContent.jsonLd.map((schema, i) => (
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

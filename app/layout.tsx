import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

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

const siteUrl = "https://aviusx.dev";
const title = "Hrijul Bhatnagar — Founding Engineer at Thesys";
const description =
  "Hrijul Bhatnagar (AviusX) is a software engineer building generative UI at Thesys. Turning LLM outputs into live, interactive interfaces.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Hrijul",
    "Hrijul Bhatnagar",
    "AviusX",
    "Founding Engineer",
    "Thesys",
    "Generative UI",
    "Software Engineer",
    "LLMs",
    "React",
    "TypeScript",
    "Bengaluru",
  ],
  authors: [{ name: "Hrijul Bhatnagar", url: siteUrl }],
  creator: "Hrijul Bhatnagar",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Hrijul Bhatnagar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@AviusX",
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Hrijul Bhatnagar",
  alternateName: "AviusX",
  url: siteUrl,
  jobTitle: "Founding Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Thesys",
    url: "https://thesys.dev",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Vellore Institute of Technology",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  email: "mailto:hrijulbhatnagar@protonmail.com",
  knowsAbout: [
    "Generative UI",
    "Large Language Models",
    "React",
    "TypeScript",
    "NestJS",
    "Frontend Engineering",
    "Cybersecurity",
  ],
  sameAs: [
    "https://linkedin.com/in/hrijulbhatnagar",
    "https://github.com/AviusX",
    "https://instagram.com/aviusgx",
    "https://x.com/AviusX",
    "https://music.aviusx.dev",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Hrijul Bhatnagar",
  description,
  author: { "@id": `${siteUrl}/#person` },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="noise min-h-screen">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

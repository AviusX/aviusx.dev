import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hrijul Bhatnagar — Founding Engineer",
  description:
    "Software engineer building generative UI at Thesys. Turning LLM outputs into live, interactive interfaces.",
  metadataBase: new URL("https://aviusx.dev"),
  openGraph: {
    title: "Hrijul Bhatnagar — Founding Engineer",
    description:
      "Software engineer building generative UI at Thesys. Turning LLM outputs into live, interactive interfaces.",
    url: "https://aviusx.dev",
    siteName: "Hrijul Bhatnagar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hrijul Bhatnagar — Founding Engineer",
    description:
      "Software engineer building generative UI at Thesys. Turning LLM outputs into live, interactive interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else if(!t&&window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />
        <link rel="dns-prefetch" href="https://instagram.com" />
        <link rel="dns-prefetch" href="https://thesys.dev" />
        <link rel="preconnect" href="https://thesys.dev" crossOrigin="anonymous" />
        <meta name="theme-color" content="#050507" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f4f4f7" media="(prefers-color-scheme: light)" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

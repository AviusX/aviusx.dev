import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

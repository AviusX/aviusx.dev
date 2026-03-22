"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import FloatingDock from "@/components/ui/FloatingDock";

const ScrollBackground = dynamic(
  () => import("@/components/three/ScrollBackground"),
  { ssr: false }
);

const About = dynamic(() => import("@/components/sections/About"));
const TechStack = dynamic(() => import("@/components/sections/TechStack"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/sections/Footer"));
const CyberMascot = dynamic(() => import("@/components/ui/CyberMascot"), {
  ssr: false,
});

const WarpGrid = dynamic(() => import("@/components/canvas/WarpGrid"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <ScrollBackground />
      <WarpGrid />
      <div className="noise-overlay" />

      <Navbar />
      <FloatingDock />
      <CyberMascot />

      <main className="overflow-x-hidden">
        <Hero />

        <div className="section-divider mx-auto max-w-6xl" />

        <About />

        <TechStack />

        <div className="section-divider mx-auto max-w-6xl" />

        <Experience />

        <div className="section-divider mx-auto max-w-6xl" />

        <Projects />

        <div className="section-divider mx-auto max-w-6xl" />

        <Contact />
      </main>

      <Footer />
    </>
  );
}

"use client";

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import FloatingDock from "@/components/ui/FloatingDock";
import CyberMascot from "@/components/ui/CyberMascot";

export default function Home() {
  return (
    <>
      <div className="gradient-mesh" />
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

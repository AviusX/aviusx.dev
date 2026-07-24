import AnimationProvider from "@/components/AnimationProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechMarquee from "@/components/sections/TechMarquee";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <AnimationProvider />
      <Nav />
      <main>
        <Hero />
        <About />
        <TechMarquee />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

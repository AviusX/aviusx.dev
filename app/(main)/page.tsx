import AnimationProvider from "@/components/AnimationProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechMarquee from "@/components/sections/TechMarquee";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import { mainContent } from "@/lib/site/main";

export default function Home() {
  return (
    <>
      <AnimationProvider />
      <Nav content={mainContent.nav} />
      <main>
        <Hero content={mainContent.hero} />
        <About content={mainContent.about} />
        <TechMarquee content={mainContent.marquee} />
        <Experience content={mainContent.experience} />
        <Projects content={mainContent.projects} />
        <Contact content={mainContent.contact} />
      </main>
      <Footer content={mainContent.footer} />
    </>
  );
}

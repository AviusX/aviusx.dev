import AnimationProvider from "@/components/AnimationProvider";
import GodNav from "@/components/god/GodNav";
import GodFooter from "@/components/god/GodFooter";
import GodHero from "@/components/god/GodHero";
import GodAbout from "@/components/god/GodAbout";
import GodMarquee from "@/components/god/GodMarquee";
import GodExperience from "@/components/god/GodExperience";
import GodProjects from "@/components/god/GodProjects";
import GodContact from "@/components/god/GodContact";
import { godContent } from "@/lib/site/god";

export default function GodHome() {
  return (
    <>
      <AnimationProvider />
      <GodNav content={godContent.nav} />
      <main>
        <GodHero content={godContent.hero} />
        <GodAbout content={godContent.about} />
        <GodMarquee content={godContent.marquee} />
        <GodExperience content={godContent.experience} />
        <GodProjects content={godContent.projects} />
        <GodContact content={godContent.contact} />
      </main>
      <GodFooter content={godContent.footer} />
    </>
  );
}

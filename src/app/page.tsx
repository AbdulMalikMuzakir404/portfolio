import { AboutSection } from "@/sections/About";
import { ContactSection } from "@/sections/Contact";
import { Demo } from "@/sections/Demo";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { SkillsSection } from "@/sections/Skill";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { Experience } from "@/sections/Experience";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <SkillsSection />
      <AboutSection />
      <TapeSection />
      <Experience />
      <TestimonialsSection />
      <Demo />
      <ContactSection />
      <Footer />
    </div>
  );
}

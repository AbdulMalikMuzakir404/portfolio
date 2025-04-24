import { AboutSection } from "@/sections/About";
import { ContactSection } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { CertificateSection } from "@/sections/Certificate";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { Experience } from "@/sections/Experience";
import { Wobble } from "@/sections/Wobble";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <CertificateSection />
      <AboutSection />
      <TapeSection />
      <Experience />
      {/* <TestimonialsSection /> */}
      <Wobble />
      <ContactSection />
      <Footer />
    </div>
  );
}

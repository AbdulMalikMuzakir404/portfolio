import { AboutSection } from "@/sections/About";
import { ContactSection } from "@/sections/Contact";
import { Demo } from "@/sections/Demo";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { CertificatesSection } from "@/sections/Certificate";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <CertificatesSection />
      <TapeSection />
      <TestimonialsSection />
      <AboutSection />
      <Demo />
      <ContactSection />
      <Footer />
    </div>
  );
}

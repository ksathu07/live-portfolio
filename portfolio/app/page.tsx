import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import { VideoPortfolioSection } from "@/components/VideoPortfolio";
import { videoPortfolio } from "@/lib/profile";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Certifications />
      <Projects />
      {videoPortfolio && videoPortfolio.items?.length > 0 && (
        <VideoPortfolioSection data={videoPortfolio} />
      )}
      <Achievements />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
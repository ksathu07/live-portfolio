import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
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
      <Projects />
      <Achievements />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
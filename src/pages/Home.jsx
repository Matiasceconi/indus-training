import { SiteContentProvider } from "@/contexts/SiteContentContext";
import Navbar from "@/components/indus/Navbar";
import Hero from "@/components/indus/Hero";
import Services from "@/components/indus/Services";
import HowWeWork from "@/components/indus/HowWeWork";
import Experiences from "@/components/indus/Experiences";
import Team from "@/components/indus/Team";
import Location from "@/components/indus/Location";
import ContactBlock from "@/components/indus/ContactBlock";
import Footer from "@/components/indus/Footer";

export default function Home() {
  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <HowWeWork />
          <Experiences />
          <Team />
          <Location />
          <ContactBlock />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
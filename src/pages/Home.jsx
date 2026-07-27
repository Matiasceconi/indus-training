import Navbar from "@/components/indus/Navbar";
import Hero from "@/components/indus/Hero";
import Services from "@/components/indus/Services";
import HowWeWork from "@/components/indus/HowWeWork";
import Team from "@/components/indus/Team";
import Location from "@/components/indus/Location";
import ContactBlock from "@/components/indus/ContactBlock";
import Footer from "@/components/indus/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowWeWork />
        <Team />
        <Location />
        <ContactBlock />
      </main>
      <Footer />
    </div>
  );
}
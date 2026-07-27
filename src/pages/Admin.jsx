import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import SiteContentEditor from "@/components/admin/SiteContentEditor";
import ServicesAdmin from "@/components/admin/ServicesAdmin";
import TeamAdmin from "@/components/admin/TeamAdmin";

const TABS = [
  { id: "general", label: "General" },
  { id: "hero", label: "Portada" },
  { id: "services", label: "Servicios" },
  { id: "team", label: "Equipo" },
  { id: "location", label: "Ubicación" },
  { id: "contact", label: "Contacto" },
];

export default function Admin() {
  const [tab, setTab] = useState("general");

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-white border-b border-black/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl text-[#121212]">
              Panel de Administración
            </h1>
            <p className="text-xs text-[#121212]/50">INDUS TRAINING</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#FF6600] font-medium hover:underline"
          >
            <ExternalLink size={15} />
            Ver sitio
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "bg-[#FF6600] text-white"
                  : "bg-white text-[#121212]/60 hover:text-[#121212] border border-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "general" && <SiteContentEditor section="general" />}
        {tab === "hero" && <SiteContentEditor section="hero" />}
        {tab === "services" && <ServicesAdmin />}
        {tab === "team" && <TeamAdmin />}
        {tab === "location" && <SiteContentEditor section="location" />}
        {tab === "contact" && <SiteContentEditor section="contact" />}
      </div>
    </div>
  );
}
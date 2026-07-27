import { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const SiteContentContext = createContext(null);

const DEFAULT_SITE = {
  logo: "",
  heroTitle: "Entrená con propósito. Rendí mejor.",
  heroSubtitle:
    "Entrenamientos personalizados, fútbol y planes de entrenamiento con seguimiento profesional.",
  heroLocation: "Puerto Madero, Buenos Aires",
  heroImage: "",
  whatsappNumber: "",
  whatsappMessage: "Hola INDUS TRAINING, quiero más información sobre los servicios.",
  instagramUrl: "https://instagram.com/indus.training",
  instagramHandle: "@indus.training",
  howWeWorkText:
    "En INDUS TRAINING no ofrecemos rutinas genéricas. Cada proceso comienza entendiendo a la persona, sus objetivos y sus posibilidades reales de entrenamiento.",
  locationTitle: "Entrená con nosotros en Puerto Madero.",
  locationAddress: "[Editable] Dirección o zona exacta en Puerto Madero, Buenos Aires.",
  locationSchedule: "[Editable] Días y horarios de atención y entrenamiento.",
  locationModalities: "[Editable] Presencial, semi-presencial y/o a distancia.",
  contactTitle: "Tu próximo entrenamiento empieza acá.",
  contactText: "Contanos cuál es tu objetivo y te ayudamos a elegir el servicio indicado.",
};

export function SiteContentProvider({ children }) {
  const [data, setData] = useState({ site: DEFAULT_SITE, services: [], team: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [siteContent, services, team] = await Promise.all([
          base44.entities.SiteContent.list(),
          base44.entities.Service.list("order", 50),
          base44.entities.TeamMember.list("order", 50),
        ]);
        setData({
          site: { ...DEFAULT_SITE, ...(siteContent[0] || {}) },
          services: services || [],
          team: team || [],
        });
      } catch (e) {
        console.error("Error al cargar el contenido del sitio:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <SiteContentContext.Provider value={{ ...data, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function whatsappLink(site, message) {
  if (!site?.whatsappNumber) return "#";
  const text = encodeURIComponent(message || site?.whatsappMessage || "");
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
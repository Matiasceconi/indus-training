import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/config/site";

const SERVICES = [
  {
    id: "personalizado",
    number: "01",
    title: "Entrenamientos Personalizados",
    description:
      "Sesiones adaptadas a tus objetivos, nivel y condición física. Entrená con planificación, supervisión profesional y seguimiento individual.",
    features: [
      "Fuerza y acondicionamiento físico",
      "Mejora de la composición corporal",
      "Movilidad y condición física general",
      "Preparación física para deportes",
      "Seguimiento de avances",
    ],
    price: "$35.000 ARS",
    priceUnit: "por clase",
    cta: "Reservar una clase",
    message: WHATSAPP_MESSAGES.personalizado,
    image:
      "https://images.unsplash.com/photo-1534438327425-e44c8b1c0d4f?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "futbol",
    number: "02",
    title: "Entrenamientos Grupales de Fútbol",
    description:
      "Entrenamientos en grupos reducidos para mejorar el rendimiento físico, técnico y deportivo de cada jugador.",
    features: [
      "Técnica individual",
      "Coordinación y agilidad",
      "Velocidad y potencia",
      "Preparación física específica",
      "Juegos y situaciones de fútbol",
      "Grupos organizados por edad y nivel",
    ],
    price: null,
    priceNote: "Consultá por edades, días, cupos y disponibilidad.",
    cta: "Consultar por los grupos",
    message: WHATSAPP_MESSAGES.futbol,
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "planes",
    number: "03",
    title: "Planes de Entrenamiento con Seguimiento",
    description:
      "Recibí una planificación personalizada para entrenar de manera independiente, con acompañamiento y ajustes profesionales.",
    features: [
      "Entrevista inicial",
      "Planificación personalizada",
      "Videos explicativos",
      "Control semanal",
      "Ajustes según la evolución",
      "Comunicación para consultas",
    ],
    price: "$30.000 ARS",
    priceUnit: "por mes",
    cta: "Comenzar mi planificación",
    message: WHATSAPP_MESSAGES.planes,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac2934?auto=format&fit=crop&w=800&q=80",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Services() {
  return (
    <section id="servicios" className="py-20 sm:py-28 bg-[#F5F5F5]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-[#FF6600]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#FF6600] uppercase">
              Servicios
            </span>
          </div>
          <h2 className="font-display font-black text-[#121212] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            Tres caminos para
            <br />
            <span className="text-[#FF6600]">alcanzar tu mejor versión.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className={`relative flex flex-col bg-white rounded-3xl overflow-hidden border ${
                service.featured ? "border-[#FF6600]/30 shadow-xl shadow-[#FF6600]/5" : "border-black/5 shadow-sm"
              } hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Imagen superior */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F5]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-display font-black text-sm text-[#FF6600]">
                    {service.number}
                  </span>
                </div>
                {service.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#FF6600] text-white text-[10px] font-bold tracking-wider uppercase">
                    Más elegido
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6 sm:p-7">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#121212] leading-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-[#121212]/65 leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-[#121212]/80">
                      <Check size={16} className="text-[#FF6600] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Precio destacado */}
                <div className="mt-auto pt-5 border-t border-black/5">
                  {service.price ? (
                    <div className="mb-4">
                      <div className="font-display font-black text-3xl text-[#121212]">
                        {service.price}
                      </div>
                      <div className="text-xs font-medium text-[#121212]/50 uppercase tracking-wide">
                        {service.priceUnit}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-[#121212]/60 italic">
                        {service.priceNote}
                      </div>
                    </div>
                  )}

                  <a
                    href={whatsappLink(service.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      service.featured
                        ? "bg-[#FF6600] text-white hover:bg-[#e65c00] shadow-lg shadow-[#FF6600]/20"
                        : "bg-[#121212] text-white hover:bg-[#FF6600]"
                    }`}
                  >
                    {service.cta}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
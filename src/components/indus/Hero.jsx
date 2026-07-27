import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/config/site";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const scrollToServices = () => {
    const el = document.querySelector("#servicios");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative pt-16 sm:pt-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[calc(100vh-5rem)] py-12 lg:py-0">
          {/* Texto — 5/12 columnas */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[#FF6600]/8 border border-[#FF6600]/20"
            >
              <MapPin size={14} className="text-[#FF6600]" />
              <span className="text-xs font-semibold tracking-wide text-[#FF6600] uppercase">
                Puerto Madero, Buenos Aires
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display font-black text-[#121212] leading-[0.95] tracking-tight text-5xl sm:text-6xl xl:text-7xl"
            >
              Entrená con
              <br />
              propósito.
              <br />
              <span className="text-[#FF6600] pl-6 sm:pl-10 block">Rendí mejor.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-7 text-lg text-[#121212]/70 leading-relaxed max-w-md"
            >
              Entrenamientos personalizados, fútbol y planes de entrenamiento con
              seguimiento profesional.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF6600] text-white text-base font-semibold rounded-full hover:bg-[#e65c00] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#FF6600]/20"
              >
                Quiero empezar
                <ArrowRight size={18} />
              </a>
              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-[#121212] text-base font-semibold rounded-full border-2 border-[#121212]/10 hover:border-[#FF6600] hover:text-[#FF6600] transition-all duration-200"
              >
                Ver servicios
              </button>
            </motion.div>
          </div>

          {/* Imagen — 7/12 columnas */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6] rounded-3xl overflow-hidden bg-[#F5F5F5]"
            >
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
                alt="Atleta entrenando con intensidad"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            {/* Badge de autenticidad — estilo coordenada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-4 -left-2 sm:bottom-6 sm:left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-black/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6600]/10 flex items-center justify-center">
                  <MapPin size={18} className="text-[#FF6600]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.15em] text-[#121212]/40 uppercase">
                    Sede
                  </div>
                  <div className="text-sm font-bold text-[#121212]">Puerto Madero</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
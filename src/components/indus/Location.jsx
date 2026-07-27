import { motion } from "framer-motion";
import { MapPin, Clock, Layers, Navigation } from "lucide-react";

export default function Location() {
  return (
    <section id="ubicacion" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-16 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-[#FF6600]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#FF6600] uppercase">
              Ubicación
            </span>
          </div>
          <h2 className="font-display font-black text-[#121212] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Entrená con nosotros
            <br />
            <span className="text-[#FF6600]">en Puerto Madero.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Info editable */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-[#FF6600]" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-[#121212]/40 uppercase mb-1">
                  Dirección / Zona
                </div>
                <p className="text-[#121212] font-medium">
                  [Editable] Dirección o zona exacta en Puerto Madero, Buenos Aires.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-[#FF6600]" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-[#121212]/40 uppercase mb-1">
                  Días y horarios
                </div>
                <p className="text-[#121212] font-medium">
                  [Editable] Días y horarios de atención y entrenamiento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
              <div className="w-11 h-11 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                <Layers size={20} className="text-[#FF6600]" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-[#121212]/40 uppercase mb-1">
                  Modalidades disponibles
                </div>
                <p className="text-[#121212] font-medium">
                  [Editable] Presencial, semi-presencial y/o a distancia.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mapa placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden bg-[#F5F5F5] border border-black/5 min-h-[320px] lg:min-h-full"
          >
            <iframe
              title="Mapa Puerto Madero"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-58.373%2C-34.625%2C-58.353%2C-34.605&layer=mapnik&marker=-34.615%2C-58.363"
              className="w-full h-full min-h-[320px] absolute inset-0"
              style={{ border: 0 }}
              loading="lazy"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5 pointer-events-none">
              <Navigation size={13} className="text-[#FF6600]" />
              <span className="text-xs font-semibold text-[#121212]">Puerto Madero</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
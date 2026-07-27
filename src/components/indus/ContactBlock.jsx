import { motion } from "framer-motion";
import { MessageCircle, Instagram } from "lucide-react";
import { whatsappLink, WHATSAPP_MESSAGES, SITE_CONFIG } from "@/config/site";

export default function ContactBlock() {
  return (
    <section id="contacto" className="bg-[#FF6600] relative overflow-hidden">
      {/* Patrón sutil de fondo */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]"
        >
          Tu próximo entrenamiento
          <br />
          empieza acá.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Contanos cuál es tu objetivo y te ayudamos a elegir el servicio
          indicado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={whatsappLink(WHATSAPP_MESSAGES.contacto)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#FF6600] text-base font-bold rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-2xl shadow-black/10"
          >
            <MessageCircle size={20} fill="currentColor" />
            Hablar por WhatsApp
          </a>

          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white text-base font-semibold rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200"
          >
            <Instagram size={20} />
            {SITE_CONFIG.instagramHandle}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Services() {
  const { site, services } = useSiteContent();

  if (!services || services.length === 0) return null;

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
          {services.map((service, i) => (
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
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F5]">
                {service.video ? (
                  <video
                    src={service.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : service.image ? (
                  <Image
                    src={service.image}
                    fittingType="fill"
                    focalPointX={0.5}
                    focalPointY={0.5}
                    className="w-full h-full"
                    alt={service.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#121212]/10 text-6xl font-display font-black">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-display font-black text-sm text-[#FF6600]">
                    {String(i + 1).padStart(2, "0")}
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

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#121212]/80">
                        <Check size={16} className="text-[#FF6600] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-5 border-t border-black/5">
                  {service.price ? (
                    <div className="mb-4">
                      <div className="font-display font-black text-3xl text-[#121212]">
                        {service.price}
                      </div>
                      {service.priceUnit && (
                        <div className="text-xs font-medium text-[#121212]/50 uppercase tracking-wide">
                          {service.priceUnit}
                        </div>
                      )}
                    </div>
                  ) : (
                    service.priceNote && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-[#121212]/60 italic">
                          {service.priceNote}
                        </div>
                      </div>
                    )
                  )}

                  <a
                    href={whatsappLink(site, service.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      service.featured
                        ? "bg-[#FF6600] text-white hover:bg-[#e65c00] shadow-lg shadow-[#FF6600]/20"
                        : "bg-[#121212] text-white hover:bg-[#FF6600]"
                    }`}
                  >
                    {service.cta || "Consultar"}
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
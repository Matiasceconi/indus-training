import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { X, MessageCircle, Maximize2 } from "lucide-react";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";

const CTA_MESSAGE =
  "Hola INDUS TRAINING, vi las experiencias de otros alumnos y quiero recibir información para empezar a entrenar.";

export default function Experiences() {
  const { site, experiences } = useSiteContent();
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index) => api?.scrollTo(index), [api]);

  const hasExperiences = experiences && experiences.length > 0;

  return (
    <section id="experiencias" className="py-20 sm:py-28 bg-[#FFF5EC]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 sm:mb-16 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-[#FF6600]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#FF6600] uppercase">
              Experiencias
            </span>
          </div>
          <h2 className="font-display font-black text-[#121212] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Personas que ya entrenaron con nosotros
          </h2>
          <p className="mt-5 text-lg text-[#121212]/65 leading-relaxed">
            Personas con diferentes objetivos que confiaron en INDUS TRAINING para
            acompañar su preparación, entrenamiento y desarrollo deportivo.
          </p>
        </motion.div>

        {hasExperiences ? (
          <div className="relative">
            <Carousel
              opts={{ align: "start", loop: experiences.length > 3 }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {experiences.map((exp) => (
                  <CarouselItem
                    key={exp.id}
                    className="basis-full pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <ExperienceCard exp={exp} onZoom={() => setLightbox(exp.image)} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:-left-5 h-10 w-10 bg-white border-[#FF6600]/20 text-[#FF6600] hover:bg-[#FF6600] hover:text-white shadow-md" />
              <CarouselNext className="right-2 sm:-right-5 h-10 w-10 bg-white border-[#FF6600]/20 text-[#FF6600] hover:bg-[#FF6600] hover:text-white shadow-md" />
            </Carousel>

            {count > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === i
                        ? "w-8 bg-[#FF6600]"
                        : "w-2 bg-[#121212]/20 hover:bg-[#121212]/40"
                    }`}
                    aria-label={`Ir a slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-[#121212]/40 text-sm">
            Próximamente las primeras experiencias de quienes entrenan con nosotros.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 sm:mt-16 text-center"
        >
          <p className="font-display font-bold text-xl sm:text-2xl text-[#121212] mb-6">
            Cada proceso comienza con un objetivo. El próximo puede ser el tuyo.
          </p>
          <a
            href={whatsappLink(site, CTA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FF6600] text-white text-base font-semibold rounded-full hover:bg-[#e65c00] active:scale-95 transition-all duration-200 shadow-lg shadow-[#FF6600]/20"
          >
            <MessageCircle size={20} fill="currentColor" />
            Quiero entrenar con INDUS
          </a>
        </motion.div>
      </div>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-0 overflow-hidden rounded-2xl">
          {lightbox && (
            <div className="relative">
              <DialogClose className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X size={18} />
              </DialogClose>
              <img
                src={lightbox}
                className="w-full h-auto max-h-[85vh] object-contain"
                alt="Experiencia INDUS TRAINING"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ExperienceCard({ exp, onZoom }) {
  const hasInfo =
    exp.name || exp.trainingType || exp.testimonial || exp.goal || exp.result;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <button
        onClick={onZoom}
        className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] group block w-full"
      >
        {exp.image ? (
          <Image
            src={exp.image}
            fittingType="fill"
            focalPointX={exp.focalPointX ?? 0.5}
            focalPointY={exp.focalPointY ?? 0.5}
            className="w-full h-full"
            alt={exp.name || "Experiencia INDUS TRAINING"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#121212]/10 text-5xl font-display font-black">
            ?
          </div>
        )}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={16} className="text-[#121212]" />
        </div>
      </button>

      {hasInfo && (
        <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
          {exp.name && (
            <h3 className="font-display font-bold text-lg text-[#121212]">{exp.name}</h3>
          )}
          {exp.trainingType && (
            <span className="inline-block self-start px-3 py-1 rounded-full bg-[#FF6600]/10 text-[#FF6600] text-xs font-semibold">
              {exp.trainingType}
            </span>
          )}
          {exp.testimonial && (
            <p className="text-sm text-[#121212]/70 leading-relaxed italic">
              &ldquo;{exp.testimonial}&rdquo;
            </p>
          )}
          {exp.goal && (
            <div className="text-sm">
              <span className="font-semibold text-[#121212]">Objetivo: </span>
              <span className="text-[#121212]/60">{exp.goal}</span>
            </div>
          )}
          {exp.result && (
            <div className="text-sm">
              <span className="font-semibold text-[#FF6600]">Resultado: </span>
              <span className="text-[#121212]/60">{exp.result}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
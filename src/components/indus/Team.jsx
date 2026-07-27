import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function Team() {
  const { team } = useSiteContent();

  if (!team || team.length === 0) return null;

  return (
    <section id="equipo" className="py-20 sm:py-28 bg-[#F5F5F5]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-[#FF6600]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#FF6600] uppercase">
              Equipo
            </span>
          </div>
          <h2 className="font-display font-black text-[#121212] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Profesionales que
            <br />
            <span className="text-[#FF6600]">entienden tu objetivo.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
                {member.image ? (
                  <Image
                    src={member.image}
                    fittingType="fill"
                    focalPointX={member.focalPointX ?? 0.5}
                    focalPointY={member.focalPointY ?? 0.5}
                    className="w-full h-full"
                    alt={member.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#121212]/10 text-5xl font-display font-black">
                    {member.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-bold text-xl text-white">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm text-white/80 font-medium">{member.role}</p>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#121212]/60 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
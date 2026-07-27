import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Conocemos tus objetivos",
    description:
      "Una conversación inicial para entender qué querés lograr, tu contexto y tu motivación real.",
  },
  {
    number: "02",
    title: "Evaluamos tu punto de partida",
    description:
      "Identificamos tu nivel actual, condición física y posibilidades reales de entrenamiento.",
  },
  {
    number: "03",
    title: "Diseñamos tu planificación",
    description:
      "Construimos un plan específico para vos, sin rutinas genéricas ni atajos.",
  },
  {
    number: "04",
    title: "Entrenamos y seguimos tu evolución",
    description:
      "Acompañamos el proceso con ajustes constantes según tus avances y tu respuesta al entrenamiento.",
  },
];

export default function HowWeWork() {
  return (
    <section id="como-trabajamos" className="py-20 sm:py-28 bg-white">
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
              Cómo trabajamos
            </span>
          </div>
          <h2 className="font-display font-black text-[#121212] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Un proceso pensado
            <br />
            <span className="text-[#FF6600]">para cada persona.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 rounded-3xl overflow-hidden border border-black/5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white p-7 sm:p-8 lg:p-9 group hover:bg-[#F5F5F5] transition-colors duration-300"
            >
              <div className="font-display font-black text-6xl sm:text-7xl text-[#FF6600]/15 group-hover:text-[#FF6600]/30 transition-colors duration-300 leading-none mb-5">
                {step.number}
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#121212] mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-[#121212]/60 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 sm:mt-16 max-w-3xl"
        >
          <div className="border-l-4 border-[#FF6600] pl-6">
            <p className="text-lg sm:text-xl text-[#121212]/80 leading-relaxed font-medium">
              En INDUS TRAINING no ofrecemos rutinas genéricas. Cada proceso
              comienza entendiendo a la persona, sus objetivos y sus
              posibilidades reales de entrenamiento.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
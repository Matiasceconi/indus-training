import { useState } from "react";
import { Target, Activity, ClipboardList } from "lucide-react";
import { Field } from "@/components/auth/Field";

const SERVICES = [
  "Entrenamiento personalizado",
  "Entrenamiento grupal de fútbol",
  "Plan de entrenamiento con seguimiento",
];

const EXPERIENCE_LEVELS = [
  "Sin experiencia previa",
  "Menos de 6 meses",
  "Entre 6 meses y 1 año",
  "Entre 1 y 3 años",
  "Más de 3 años",
];

export default function StepService({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.serviceInterest) e.serviceInterest = "Seleccioná un servicio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-5">
      <Field label="Servicio de interés" required error={errors.serviceInterest}>
        <div className="space-y-2.5">
          {SERVICES.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                data.serviceInterest === s
                  ? "border-[#FF6600] bg-[#FF6600]/5 ring-2 ring-[#FF6600]/10"
                  : "border-black/10 bg-[#F5F5F5] hover:border-black/20"
              }`}
            >
              <input
                type="radio"
                name="serviceInterest"
                value={s}
                checked={data.serviceInterest === s}
                onChange={(e) => update("serviceInterest", e.target.value)}
                className="w-5 h-5 text-[#FF6600] focus:ring-[#FF6600]/20"
              />
              <span className="text-sm font-medium text-[#121212]">{s}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Objetivo principal" hint="¿Qué querés lograr con tu entrenamiento?">
        <div className="relative">
          <Target className="absolute left-3 top-3.5 w-4 h-4 text-[#121212]/30" />
          <textarea
            value={data.mainGoal || ""}
            onChange={(e) => update("mainGoal", e.target.value)}
            placeholder="Ej: Bajar de peso, mejorar rendimiento, prepararme para un torneo..."
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all resize-none"
          />
        </div>
      </Field>

      <Field label="Experiencia previa entrenando">
        <div className="relative">
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30 pointer-events-none" />
          <select
            value={data.priorExperience || ""}
            onChange={(e) => update("priorExperience", e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all appearance-none"
          >
            <option value="">Seleccioná una opción</option>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
      </Field>

      <Field label="Observaciones generales" hint="Información adicional que consideres relevante">
        <div className="relative">
          <ClipboardList className="absolute left-3 top-3.5 w-4 h-4 text-[#121212]/30" />
          <textarea
            value={data.observations || ""}
            onChange={(e) => update("observations", e.target.value)}
            placeholder="Lesiones, condiciones médicas, horarios preferidos, etc."
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all resize-none"
          />
        </div>
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 h-12 rounded-xl border border-black/10 text-[#121212]/60 font-medium hover:bg-[#F5F5F5] transition-all"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 h-12 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
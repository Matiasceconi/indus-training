import { useState } from "react";
import { User, Calendar, MapPin, Phone, Globe, Camera } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { calculateAge } from "@/lib/age";
import ImageUpload from "@/components/admin/ImageUpload";

export default function StepPersonal({ data, update, onNext, onBack, showBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.firstName?.trim()) e.firstName = "El nombre es obligatorio";
    if (!data.lastName?.trim()) e.lastName = "El apellido es obligatorio";
    if (!data.birthDate) e.birthDate = "La fecha de nacimiento es obligatoria";
    if (!data.phone?.trim()) e.phone = "El teléfono es obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const age = calculateAge(data.birthDate);

  return (
    <div className="space-y-5">
      <ImageUpload
        label="Foto de perfil"
        value={data.profilePhoto || ""}
        onChange={(url) => update("profilePhoto", url)}
        aspect="aspect-square"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre" required error={errors.firstName}>
          <input
            type="text"
            value={data.firstName || ""}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Tu nombre"
            className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
          />
        </Field>
        <Field label="Apellido" required error={errors.lastName}>
          <input
            type="text"
            value={data.lastName || ""}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Tu apellido"
            className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
          />
        </Field>
      </div>

      <Field label="Fecha de nacimiento" required error={errors.birthDate} hint={
        age !== null ? `Edad calculada: ${age} años${age < 18 ? " (menor de edad)" : ""}` : "Calcularemos tu edad automáticamente"
      }>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30 pointer-events-none" />
          <input
            type="date"
            value={data.birthDate || ""}
            onChange={(e) => update("birthDate", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
          />
        </div>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Lugar de nacimiento">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="text"
              value={data.birthPlace || ""}
              onChange={(e) => update("birthPlace", e.target.value)}
              placeholder="Ciudad de nacimiento"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
        <Field label="Nacionalidad">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="text"
              value={data.nationality || ""}
              onChange={(e) => update("nationality", e.target.value)}
              placeholder="Tu nacionalidad"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Número de teléfono" required error={errors.phone}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Ej: +54 11 1234-5678"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
        <Field label="Ciudad o localidad actual">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="text"
              value={data.currentCity || ""}
              onChange={(e) => update("currentCity", e.target.value)}
              placeholder="¿Dónde vivís?"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 h-12 rounded-xl border border-black/10 text-[#121212]/60 font-medium hover:bg-[#F5F5F5] transition-all"
          >
            Volver
          </button>
        )}
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
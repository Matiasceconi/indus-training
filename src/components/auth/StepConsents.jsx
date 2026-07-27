import { useState } from "react";
import { User, Phone, Mail, Plus, X, ShieldCheck, AlertCircle } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { isMinorFromBirthDate, calculateAge } from "@/lib/age";

const RELATIONS = ["Madre", "Padre", "Tutor", "Otro responsable"];

function GuardianFields({ prefix, data, update, required }) {
  const nameKey = `${prefix}Name`;
  const relKey = `${prefix}Relation`;
  const phoneKey = `${prefix}Phone`;
  const emailKey = `${prefix}Email`;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre y apellido" required={required}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="text"
              value={data[nameKey] || ""}
              onChange={(e) => update(nameKey, e.target.value)}
              placeholder="Nombre completo"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
        <Field label="Relación con el alumno" required={required}>
          <select
            value={data[relKey] || ""}
            onChange={(e) => update(relKey, e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
          >
            <option value="">Seleccioná</option>
            {RELATIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Número de teléfono" required={required}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="tel"
              value={data[phoneKey] || ""}
              onChange={(e) => update(phoneKey, e.target.value)}
              placeholder="+54 11 1234-5678"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
        <Field label="Correo electrónico" required={required}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="email"
              value={data[emailKey] || ""}
              onChange={(e) => update(emailKey, e.target.value)}
              placeholder="email@ejemplo.com"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

function ConsentCheckbox({ checked, onChange, label, error }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-5 h-5 rounded border-black/20 text-[#FF6600] focus:ring-[#FF6600]/20 shrink-0"
        />
        <span className="text-sm text-[#121212]/80 leading-relaxed">{label}</span>
      </label>
      {error && <p className="text-xs text-red-500 mt-1 ml-8">{error}</p>}
    </div>
  );
}

export default function StepConsents({ data, update, onSubmit, onBack, loading }) {
  const [errors, setErrors] = useState({});
  const [showGuardian2, setShowGuardian2] = useState(!!data.guardian2Name);
  const minor = isMinorFromBirthDate(data.birthDate);
  const age = calculateAge(data.birthDate);

  const validate = () => {
    const e = {};
    if (!data.acceptedTerms) e.acceptedTerms = "Debés aceptar los términos y condiciones";
    if (!data.acceptedPrivacy) e.acceptedPrivacy = "Debés aceptar la política de privacidad";
    if (!data.confirmedInfoAccuracy) e.confirmedInfoAccuracy = "Debés confirmar que la información es correcta";

    if (minor) {
      if (!data.guardian1Name?.trim()) e.guardian1Name = "Obligatorio";
      if (!data.guardian1Relation) e.guardian1Relation = "Obligatorio";
      if (!data.guardian1Phone?.trim()) e.guardian1Phone = "Obligatorio";
      if (!data.guardian1Email?.trim()) e.guardian1Email = "Obligatorio";
      if (!data.guardianAuthorization) e.guardianAuthorization = "Debés declarar ser responsable autorizado";
    } else {
      if (!data.emergencyContactName?.trim()) e.emergencyContactName = "Obligatorio";
      if (!data.emergencyContactRelation) e.emergencyContactRelation = "Obligatorio";
      if (!data.emergencyContactPhone?.trim()) e.emergencyContactPhone = "Obligatorio";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  return (
    <div className="space-y-6">
      {minor ? (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#FF6600]" />
            <h3 className="font-display font-bold text-base text-[#121212]">
              Datos del padre, madre o responsable
            </h3>
          </div>
          <p className="text-xs text-[#121212]/50 mb-4">
            Sección obligatoria — el alumno es menor de 18 años (edad: {age} años)
          </p>
          <GuardianFields prefix="guardian1" data={data} update={update} required />

          {showGuardian2 ? (
            <div className="mt-4 p-4 rounded-xl border border-black/10 bg-[#F5F5F5]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#121212]">Segundo responsable (opcional)</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowGuardian2(false);
                    update("guardian2Name", "");
                    update("guardian2Relation", "");
                    update("guardian2Phone", "");
                    update("guardian2Email", "");
                  }}
                  className="text-[#121212]/40 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
              <GuardianFields prefix="guardian2" data={data} update={update} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGuardian2(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#FF6600] font-medium hover:underline"
            >
              <Plus size={16} /> Agregar segundo responsable
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-[#FF6600]" />
            <h3 className="font-display font-bold text-base text-[#121212]">
              Contacto de emergencia
            </h3>
          </div>
          <p className="text-xs text-[#121212]/50 mb-4">
            Una persona a quien contactar en caso de emergencia durante el entrenamiento
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre y apellido" required error={errors.emergencyContactName}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
                <input
                  type="text"
                  value={data.emergencyContactName || ""}
                  onChange={(e) => update("emergencyContactName", e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
                />
              </div>
            </Field>
            <Field label="Relación" required error={errors.emergencyContactRelation}>
              <input
                type="text"
                value={data.emergencyContactRelation || ""}
                onChange={(e) => update("emergencyContactRelation", e.target.value)}
                placeholder="Ej: Esposa, hermano, amigo..."
                className="w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
              />
            </Field>
          </div>
          <Field label="Número de teléfono" required error={errors.emergencyContactPhone}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
              <input
                type="tel"
                value={data.emergencyContactPhone || ""}
                onChange={(e) => update("emergencyContactPhone", e.target.value)}
                placeholder="+54 11 1234-5678"
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
              />
            </div>
          </Field>
        </div>
      )}

      <div className="pt-4 border-t border-black/5 space-y-4">
        <h3 className="font-display font-bold text-base text-[#121212]">Consentimientos</h3>
        <ConsentCheckbox
          checked={data.acceptedTerms}
          onChange={(v) => update("acceptedTerms", v)}
          label="Acepto los términos y condiciones de INDUS TRAINING."
          error={errors.acceptedTerms}
        />
        <ConsentCheckbox
          checked={data.acceptedPrivacy}
          onChange={(v) => update("acceptedPrivacy", v)}
          label="Acepto la política de privacidad y el tratamiento de mis datos personales."
          error={errors.acceptedPrivacy}
        />
        <ConsentCheckbox
          checked={data.confirmedInfoAccuracy}
          onChange={(v) => update("confirmedInfoAccuracy", v)}
          label="Confirmo que toda la información proporcionada es correcta."
          error={errors.confirmedInfoAccuracy}
        />
        {minor && (
          <ConsentCheckbox
            checked={data.guardianAuthorization}
            onChange={(v) => update("guardianAuthorization", v)}
            label="Declaro ser el padre, madre o responsable autorizado del menor y autorizo la creación de su perfil."
            error={errors.guardianAuthorization}
          />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-5 h-12 rounded-xl border border-black/10 text-[#121212]/60 font-medium hover:bg-[#F5F5F5] transition-all disabled:opacity-50"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 h-12 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? "Finalizando..." : "Finalizar registro"}
        </button>
      </div>
    </div>
  );
}
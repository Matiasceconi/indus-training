import { useState } from "react";
import { User, Phone, Mail, MapPin, Globe, Target, Activity, Save, X } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { isMinorFromBirthDate, calculateAge } from "@/lib/age";
import ImageUpload from "@/components/admin/ImageUpload";

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

const RELATIONS = ["Madre", "Padre", "Tutor", "Otro responsable"];

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-base text-[#121212] border-b border-black/5 pb-2">{title}</h3>
      {children}
    </div>
  );
}

function inputCls(extra = "") {
  return `w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all ${extra}`;
}

export default function ProfileEditForm({ profile, onSave, onCancel, saving }) {
  const [data, setData] = useState({ ...profile });
  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));
  const minor = isMinorFromBirthDate(data.birthDate);
  const age = calculateAge(data.birthDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section title="Foto de perfil">
        <ImageUpload
          value={data.profilePhoto || ""}
          onChange={(url) => update("profilePhoto", url)}
          aspect="aspect-square"
        />
      </Section>

      <Section title="Datos personales">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre" required>
            <input type="text" value={data.firstName || ""} onChange={(e) => update("firstName", e.target.value)} className={inputCls()} required />
          </Field>
          <Field label="Apellido" required>
            <input type="text" value={data.lastName || ""} onChange={(e) => update("lastName", e.target.value)} className={inputCls()} required />
          </Field>
        </div>
        <Field label="Fecha de nacimiento" required hint={age !== null ? `Edad: ${age} años${age < 18 ? " (menor)" : ""}` : ""}>
          <input type="date" value={data.birthDate || ""} onChange={(e) => update("birthDate", e.target.value)} max={new Date().toISOString().split("T")[0]} className={inputCls()} required />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Lugar de nacimiento">
            <input type="text" value={data.birthPlace || ""} onChange={(e) => update("birthPlace", e.target.value)} className={inputCls()} />
          </Field>
          <Field label="Nacionalidad">
            <input type="text" value={data.nationality || ""} onChange={(e) => update("nationality", e.target.value)} className={inputCls()} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Teléfono" required>
            <input type="tel" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} className={inputCls()} required />
          </Field>
          <Field label="Ciudad actual">
            <input type="text" value={data.currentCity || ""} onChange={(e) => update("currentCity", e.target.value)} className={inputCls()} />
          </Field>
        </div>
      </Section>

      <Section title="Información del servicio">
        <Field label="Servicio de interés" required>
          <select value={data.serviceInterest || ""} onChange={(e) => update("serviceInterest", e.target.value)} className={inputCls()} required>
            <option value="">Seleccioná un servicio</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Objetivo principal">
          <textarea value={data.mainGoal || ""} onChange={(e) => update("mainGoal", e.target.value)} rows={3} className={inputCls("resize-none")} />
        </Field>
        <Field label="Experiencia previa">
          <select value={data.priorExperience || ""} onChange={(e) => update("priorExperience", e.target.value)} className={inputCls()}>
            <option value="">Seleccioná una opción</option>
            {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Observaciones">
          <textarea value={data.observations || ""} onChange={(e) => update("observations", e.target.value)} rows={3} className={inputCls("resize-none")} />
        </Field>
      </Section>

      {minor ? (
        <Section title="Datos del responsable">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre y apellido">
              <input type="text" value={data.guardian1Name || ""} onChange={(e) => update("guardian1Name", e.target.value)} className={inputCls()} />
            </Field>
            <Field label="Relación">
              <select value={data.guardian1Relation || ""} onChange={(e) => update("guardian1Relation", e.target.value)} className={inputCls()}>
                <option value="">Seleccioná</option>
                {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Teléfono">
              <input type="tel" value={data.guardian1Phone || ""} onChange={(e) => update("guardian1Phone", e.target.value)} className={inputCls()} />
            </Field>
            <Field label="Correo">
              <input type="email" value={data.guardian1Email || ""} onChange={(e) => update("guardian1Email", e.target.value)} className={inputCls()} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Responsable 2 - Nombre">
              <input type="text" value={data.guardian2Name || ""} onChange={(e) => update("guardian2Name", e.target.value)} className={inputCls()} />
            </Field>
            <Field label="Responsable 2 - Teléfono">
              <input type="tel" value={data.guardian2Phone || ""} onChange={(e) => update("guardian2Phone", e.target.value)} className={inputCls()} />
            </Field>
          </div>
        </Section>
      ) : (
        <Section title="Contacto de emergencia">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre y apellido">
              <input type="text" value={data.emergencyContactName || ""} onChange={(e) => update("emergencyContactName", e.target.value)} className={inputCls()} />
            </Field>
            <Field label="Relación">
              <input type="text" value={data.emergencyContactRelation || ""} onChange={(e) => update("emergencyContactRelation", e.target.value)} className={inputCls()} />
            </Field>
          </div>
          <Field label="Teléfono">
            <input type="tel" value={data.emergencyContactPhone || ""} onChange={(e) => update("emergencyContactPhone", e.target.value)} className={inputCls()} />
          </Field>
        </Section>
      )}

      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-4 -mx-5 px-5 border-t border-black/5">
        <button type="button" onClick={onCancel} disabled={saving} className="px-5 h-12 rounded-xl border border-black/10 text-[#121212]/60 font-medium hover:bg-[#F5F5F5] transition-all disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="flex-1 h-12 inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all disabled:opacity-60">
          {saving ? "Guardando..." : <><Save size={18} /> Guardar cambios</>}
        </button>
      </div>
    </form>
  );
}
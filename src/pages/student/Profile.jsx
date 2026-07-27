import { useState } from "react";
import { useStudentProfile } from "@/contexts/StudentProfileContext";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import ProfileEditForm from "@/components/auth/ProfileEditForm";
import { calculateAge, isMinorFromBirthDate } from "@/lib/age";
import { Pencil, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  activo: { label: "Activo", cls: "bg-green-50 text-green-700 border-green-200" },
  inactivo: { label: "Inactivo", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  rechazado: { label: "Rechazado", cls: "bg-red-50 text-red-600 border-red-200" },
};

function isProfileComplete(p) {
  if (!p) return false;
  const has = (v) => v && String(v).trim();
  if (!has(p.firstName) || !has(p.lastName) || !has(p.birthDate) || !has(p.phone) || !p.serviceInterest) return false;
  if (isMinorFromBirthDate(p.birthDate)) {
    if (!has(p.guardian1Name) || !has(p.guardian1Phone)) return false;
  } else {
    if (!has(p.emergencyContactName) || !has(p.emergencyContactPhone)) return false;
  }
  return true;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-2.5 border-b border-black/5 last:border-0">
      <span className="text-xs font-medium text-[#121212]/40 uppercase tracking-wide sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-[#121212] font-medium">{value || "—"}</span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-6">
      <h3 className="font-display font-bold text-sm text-[#121212] mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Profile() {
  const { profile, reload } = useStudentProfile();
  const [mode, setMode] = useState("view");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (updatedData) => {
    setSaving(true);
    try {
      await base44.entities.ClientProfile.update(profile.id, updatedData);
      await reload();
      setMode("view");
      toast({ title: "Perfil actualizado" });
    } catch (e) {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (mode === "edit") {
    return (
      <div className="p-5 lg:p-8 max-w-2xl mx-auto">
        <button onClick={() => setMode("view")} className="inline-flex items-center gap-1 text-sm text-[#121212]/60 hover:text-[#121212] mb-4">
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 className="font-display font-bold text-2xl text-[#121212] mb-6">Editar mi perfil</h1>
        <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-6">
          <ProfileEditForm profile={profile} onSave={handleSave} onCancel={() => setMode("view")} saving={saving} />
        </div>
      </div>
    );
  }

  const age = calculateAge(profile.birthDate);
  const minor = isMinorFromBirthDate(profile.birthDate);
  const complete = isProfileComplete(profile);
  const statusCfg = STATUS_CONFIG[profile.status] || STATUS_CONFIG.pendiente;

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-[#121212]">Mi perfil</h1>
        <button
          onClick={() => setMode("edit")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6600] text-white text-sm font-semibold rounded-xl hover:bg-[#e65c00] transition-all"
        >
          <Pencil size={16} /> Editar
        </button>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#F5F5F5] shrink-0 border border-black/5">
            {profile.profilePhoto ? (
              <Image src={profile.profilePhoto} fittingType="fill" className="w-full h-full" alt={profile.firstName} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-display font-black text-[#FF6600]">
                {(profile.firstName?.[0] || "?").toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-[#121212]">{profile.firstName} {profile.lastName}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.cls}`}>
                Cuenta {statusCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                complete ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {complete ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {complete ? "Perfil completo" : "Perfil incompleto"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card title="Datos personales">
          <InfoRow label="Nombre" value={profile.firstName} />
          <InfoRow label="Apellido" value={profile.lastName} />
          <InfoRow label="Nacimiento" value={profile.birthDate} />
          <InfoRow label="Edad" value={age !== null ? `${age} años` : "—"} />
          <InfoRow label="Lugar de nacimiento" value={profile.birthPlace} />
          <InfoRow label="Nacionalidad" value={profile.nationality} />
          <InfoRow label="Teléfono" value={profile.phone} />
          <InfoRow label="Ciudad actual" value={profile.currentCity} />
        </Card>
        <Card title="Servicio seleccionado">
          <InfoRow label="Servicio" value={profile.serviceInterest} />
          <InfoRow label="Objetivo" value={profile.mainGoal} />
          <InfoRow label="Experiencia" value={profile.priorExperience} />
          <InfoRow label="Observaciones" value={profile.observations} />
        </Card>
        {minor ? (
          <Card title="Datos del responsable">
            <InfoRow label="Responsable" value={profile.guardian1Name} />
            <InfoRow label="Relación" value={profile.guardian1Relation} />
            <InfoRow label="Teléfono" value={profile.guardian1Phone} />
            <InfoRow label="Correo" value={profile.guardian1Email} />
            {profile.guardian2Name && (
              <>
                <div className="pt-3 pb-1"><p className="text-xs font-semibold text-[#FF6600] uppercase">Segundo responsable</p></div>
                <InfoRow label="Nombre" value={profile.guardian2Name} />
                <InfoRow label="Teléfono" value={profile.guardian2Phone} />
                <InfoRow label="Correo" value={profile.guardian2Email} />
              </>
            )}
          </Card>
        ) : (
          <Card title="Contacto de emergencia">
            <InfoRow label="Nombre" value={profile.emergencyContactName} />
            <InfoRow label="Relación" value={profile.emergencyContactRelation} />
            <InfoRow label="Teléfono" value={profile.emergencyContactPhone} />
          </Card>
        )}
      </div>
    </div>
  );
}
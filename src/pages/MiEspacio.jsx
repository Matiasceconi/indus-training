import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Loader2, LogOut, Pencil, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { calculateAge, isMinorFromBirthDate } from "@/lib/age";
import ProfileEditForm from "@/components/auth/ProfileEditForm";

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
  if (!p.acceptedTerms || !p.acceptedPrivacy || !p.confirmedInfoAccuracy) return false;
  if (isMinorFromBirthDate(p.birthDate)) {
    if (!has(p.guardian1Name) || !has(p.guardian1Phone) || !has(p.guardian1Email)) return false;
    if (!p.guardianAuthorization) return false;
  } else {
    if (!has(p.emergencyContactName) || !has(p.emergencyContactPhone)) return false;
  }
  return true;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2.5 border-b border-black/5 last:border-0">
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

export default function MiEspacio() {
  const { user, isAuthenticated, authChecked } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("view");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    loadProfile();
  }, [authChecked, isAuthenticated]);

  const loadProfile = async () => {
    try {
      const profiles = await base44.entities.ClientProfile.list();
      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
      } else if (user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/register";
      }
    } catch (e) {
      console.error("Error al cargar perfil:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData) => {
    setSaving(true);
    try {
      const updated = await base44.entities.ClientProfile.update(profile.id, updatedData);
      setProfile(updated);
      setMode("view");
    } catch (e) {
      console.error("Error al guardar:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6600]" />
      </div>
    );
  }

  if (!profile) return null;

  const age = calculateAge(profile.birthDate);
  const minor = isMinorFromBirthDate(profile.birthDate);
  const complete = isProfileComplete(profile);
  const statusCfg = STATUS_CONFIG[profile.status] || STATUS_CONFIG.pendiente;

  if (mode === "edit") {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-black/5 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-lg tracking-tight">
                <span className="text-[#121212]">INDUS</span>
                <span className="text-[#FF6600]"> TRAINING</span>
              </span>
            </Link>
            <button onClick={() => setMode("view")} className="inline-flex items-center gap-1 text-sm text-[#121212]/60 hover:text-[#121212]">
              <ArrowLeft size={16} /> Volver
            </button>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-5 py-6">
          <h1 className="font-display font-bold text-2xl text-[#121212] mb-6">Editar mi perfil</h1>
          <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-6">
            <ProfileEditForm profile={profile} onSave={handleSave} onCancel={() => setMode("view")} saving={saving} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="inline-block">
            <span className="font-display font-black text-lg tracking-tight">
              <span className="text-[#121212]">INDUS</span>
              <span className="text-[#FF6600]"> TRAINING</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-[#121212]/60 hover:text-[#FF6600] hover:bg-[#FF6600]/5 transition-all"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 sm:py-8 space-y-6">
        {/* Welcome header */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-7">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#F5F5F5] shrink-0 border border-black/5">
              {profile.profilePhoto ? (
                <Image src={profile.profilePhoto} fittingType="fill" className="w-full h-full" alt={profile.firstName} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-display font-black text-[#FF6600]">
                  {(profile.firstName?.[0] || "?").toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#121212]/40 font-medium uppercase tracking-wide">Mi espacio INDUS</p>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#121212] truncate">
                Hola, {profile.firstName}
              </h1>
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
          <button
            onClick={() => setMode("edit")}
            className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF6600] text-white text-sm font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all"
          >
            <Pencil size={16} /> Editar mi perfil
          </button>
        </div>

        {/* Personal info */}
        <Card title="Datos personales">
          <InfoRow label="Nombre" value={profile.firstName} />
          <InfoRow label="Apellido" value={profile.lastName} />
          <InfoRow label="Fecha de nacimiento" value={profile.birthDate} />
          <InfoRow label="Edad" value={age !== null ? `${age} años` : "—"} />
          <InfoRow label="Lugar de nacimiento" value={profile.birthPlace} />
          <InfoRow label="Nacionalidad" value={profile.nationality} />
          <InfoRow label="Teléfono" value={profile.phone} />
          <InfoRow label="Ciudad actual" value={profile.currentCity} />
        </Card>

        {/* Service info */}
        <Card title="Servicio seleccionado">
          <InfoRow label="Servicio" value={profile.serviceInterest} />
          <InfoRow label="Objetivo principal" value={profile.mainGoal} />
          <InfoRow label="Experiencia previa" value={profile.priorExperience} />
          <InfoRow label="Observaciones" value={profile.observations} />
        </Card>

        {/* Emergency / Guardian */}
        {minor ? (
          <Card title="Datos del responsable">
            <InfoRow label="Responsable" value={profile.guardian1Name} />
            <InfoRow label="Relación" value={profile.guardian1Relation} />
            <InfoRow label="Teléfono" value={profile.guardian1Phone} />
            <InfoRow label="Correo" value={profile.guardian1Email} />
            {profile.guardian2Name && (
              <>
                <div className="pt-3 pb-1">
                  <p className="text-xs font-semibold text-[#FF6600] uppercase tracking-wide">Segundo responsable</p>
                </div>
                <InfoRow label="Responsable" value={profile.guardian2Name} />
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

        <p className="text-center text-xs text-[#121212]/40 pt-2">
          Próximamente: plan de entrenamiento, videos, reservas, evaluaciones y pagos.
        </p>
      </div>
    </div>
  );
}
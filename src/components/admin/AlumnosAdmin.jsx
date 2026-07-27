import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import { Search, Loader2, X, Check, Ban, RotateCcw, Clock, UserCircle, Mail, Phone } from "lucide-react";
import { calculateAge, isMinorFromBirthDate } from "@/lib/age";

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  activo: { label: "Activo", cls: "bg-green-50 text-green-700 border-green-200" },
  inactivo: { label: "Inactivo", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  rechazado: { label: "Rechazado", cls: "bg-red-50 text-red-600 border-red-200" },
};

const SERVICES = [
  "Entrenamiento personalizado",
  "Entrenamiento grupal de fútbol",
  "Plan de entrenamiento con seguimiento",
];

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

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-2 border-b border-black/5 last:border-0">
      <span className="text-xs font-medium text-[#121212]/40 uppercase tracking-wide sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-[#121212]">{value || "—"}</span>
    </div>
  );
}

export default function AlumnosAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await base44.entities.ClientProfile.list("-created_date", 500);
      setProfiles(data || []);
    } catch (e) {
      console.error("Error al cargar alumnos:", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = profiles.filter((p) => {
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
    const email = (p.created_by || "").toLowerCase();
    const q = search.toLowerCase();
    if (q && !fullName.includes(q) && !email.includes(q)) return false;
    if (filterService && p.serviceInterest !== filterService) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (filterAge) {
      const age = calculateAge(p.birthDate);
      const minor = age !== null && age < 18;
      if (filterAge === "menor" && !minor) return false;
      if (filterAge === "mayor" && minor) return false;
    }
    return true;
  });

  const changeStatus = async (newStatus) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const updated = await base44.entities.ClientProfile.update(selected.id, { status: newStatus });
      setProfiles((prev) => prev.map((p) => (p.id === selected.id ? updated : p)));
      setSelected(updated);
      toast({ title: `Estado actualizado a "${STATUS_CONFIG[newStatus].label}"` });
    } catch (e) {
      toast({ title: "Error al actualizar el estado", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6600]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-black/10 bg-white text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600]">
            <option value="">Todos los servicios</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterAge} onChange={(e) => setFilterAge(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600]">
            <option value="">Todas las edades</option>
            <option value="menor">Menores (menos de 18)</option>
            <option value="mayor">Mayores (18+)</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600]">
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-[#121212]/50">{filtered.length} alumno{filtered.length !== 1 ? "s" : ""}</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#121212]/40">
          <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No se encontraron alumnos</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => {
            const age = calculateAge(p.birthDate);
            const minor = isMinorFromBirthDate(p.birthDate);
            const complete = isProfileComplete(p);
            const stCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pendiente;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-black/5 hover:border-[#FF6600]/30 hover:shadow-sm transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F5F5F5] shrink-0 border border-black/5">
                  {p.profilePhoto ? (
                    <Image src={p.profilePhoto} fittingType="fill" className="w-full h-full" alt={p.firstName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-display font-black text-[#FF6600]">
                      {(p.firstName?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#121212] truncate">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-[#121212]/50 truncate">{p.created_by}</p>
                  <p className="text-xs text-[#121212]/40 truncate mt-0.5">
                    {p.serviceInterest || "Sin servicio"} · {age !== null ? `${age} años` : "—"} · {minor ? "Menor" : "Mayor"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${stCfg.cls}`}>
                    {stCfg.label}
                  </span>
                  <span className={`text-[10px] font-medium ${complete ? "text-green-600" : "text-amber-600"}`}>
                    {complete ? "Completo" : "Incompleto"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-black/5 px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-[#121212]">Ficha del alumno</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]">
                <X size={20} className="text-[#121212]/60" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#F5F5F5] shrink-0 border border-black/5">
                  {selected.profilePhoto ? (
                    <Image src={selected.profilePhoto} fittingType="fill" className="w-full h-full" alt={selected.firstName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-display font-black text-[#FF6600]">
                      {(selected.firstName?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#121212]">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-sm text-[#121212]/50">{selected.created_by}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pendiente).cls}`}>
                      {(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pendiente).label}
                    </span>
                    <span className={`text-xs font-medium ${isProfileComplete(selected) ? "text-green-600" : "text-amber-600"}`}>
                      {isProfileComplete(selected) ? "Perfil completo" : "Perfil incompleto"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status actions */}
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-[#F5F5F5]">
                <button
                  onClick={() => changeStatus("activo")}
                  disabled={updating || selected.status === "activo"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40 transition-all"
                >
                  <Check size={15} /> Aprobar
                </button>
                <button
                  onClick={() => changeStatus("rechazado")}
                  disabled={updating || selected.status === "rechazado"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-40 transition-all"
                >
                  <Ban size={15} /> Rechazar
                </button>
                <button
                  onClick={() => changeStatus("inactivo")}
                  disabled={updating || selected.status === "inactivo"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 disabled:opacity-40 transition-all"
                >
                  <Clock size={15} /> Inactivar
                </button>
                <button
                  onClick={() => changeStatus("pendiente")}
                  disabled={updating || selected.status === "pendiente"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-40 transition-all"
                >
                  <RotateCcw size={15} /> Pendiente
                </button>
              </div>

              {/* Personal info */}
              <div>
                <h4 className="font-display font-bold text-sm text-[#121212] mb-2">Datos personales</h4>
                <DetailRow label="Nombre" value={selected.firstName} />
                <DetailRow label="Apellido" value={selected.lastName} />
                <DetailRow label="Nacimiento" value={selected.birthDate} />
                <DetailRow label="Edad" value={calculateAge(selected.birthDate) !== null ? `${calculateAge(selected.birthDate)} años` : "—"} />
                <DetailRow label="Lugar de nac." value={selected.birthPlace} />
                <DetailRow label="Nacionalidad" value={selected.nationality} />
                <DetailRow label="Teléfono" value={selected.phone} />
                <DetailRow label="Ciudad actual" value={selected.currentCity} />
              </div>

              {/* Service info */}
              <div>
                <h4 className="font-display font-bold text-sm text-[#121212] mb-2">Servicio</h4>
                <DetailRow label="Servicio" value={selected.serviceInterest} />
                <DetailRow label="Objetivo" value={selected.mainGoal} />
                <DetailRow label="Experiencia" value={selected.priorExperience} />
                <DetailRow label="Observaciones" value={selected.observations} />
              </div>

              {/* Guardian / Emergency */}
              {isMinorFromBirthDate(selected.birthDate) ? (
                <div>
                  <h4 className="font-display font-bold text-sm text-[#121212] mb-2">Datos del responsable</h4>
                  <DetailRow label="Responsable 1" value={selected.guardian1Name} />
                  <DetailRow label="Relación" value={selected.guardian1Relation} />
                  <DetailRow label="Teléfono" value={selected.guardian1Phone} />
                  <DetailRow label="Correo" value={selected.guardian1Email} />
                  {selected.guardian2Name && (
                    <>
                      <div className="pt-2 pb-1"><p className="text-xs font-semibold text-[#FF6600] uppercase">Segundo responsable</p></div>
                      <DetailRow label="Nombre" value={selected.guardian2Name} />
                      <DetailRow label="Relación" value={selected.guardian2Relation} />
                      <DetailRow label="Teléfono" value={selected.guardian2Phone} />
                      <DetailRow label="Correo" value={selected.guardian2Email} />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <h4 className="font-display font-bold text-sm text-[#121212] mb-2">Contacto de emergencia</h4>
                  <DetailRow label="Nombre" value={selected.emergencyContactName} />
                  <DetailRow label="Relación" value={selected.emergencyContactRelation} />
                  <DetailRow label="Teléfono" value={selected.emergencyContactPhone} />
                </div>
              )}

              {/* Consents */}
              <div>
                <h4 className="font-display font-bold text-sm text-[#121212] mb-2">Consentimientos</h4>
                <DetailRow label="Términos" value={selected.acceptedTerms ? "Aceptado" : "No aceptado"} />
                <DetailRow label="Privacidad" value={selected.acceptedPrivacy ? "Aceptado" : "No aceptado"} />
                <DetailRow label="Info correcta" value={selected.confirmedInfoAccuracy ? "Confirmado" : "No confirmado"} />
                {isMinorFromBirthDate(selected.birthDate) && (
                  <DetailRow label="Autorización responsable" value={selected.guardianAuthorization ? "Aceptada" : "No aceptada"} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { X, Loader2, Plus, Search, Calendar, Repeat, Users } from "lucide-react";
import { CLASS_TYPE_LABELS } from "@/components/student/StatusBadge";
import { createSessionWithParticipants, updateSessionWithParticipants, checkProfessorOverlap, checkStudentOverlap, generateWeeklyDates } from "@/lib/sessionOps";

const SESSION_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "grupal", label: "Grupal" },
  { value: "seguimiento_online", label: "Seguimiento online" },
  { value: "otra", label: "Otra" },
];

const SESSION_STATUSES = [
  { value: "programada", label: "Programada" },
  { value: "pendiente_confirmacion", label: "Pendiente de confirmación" },
  { value: "confirmada", label: "Confirmada" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "reprogramada", label: "Reprogramada" },
];

const RECURRENCE_TYPES = [
  { value: "single", label: "Una sola clase" },
  { value: "weekly", label: "Recurrencia semanal" },
];

function inputCls(extra = "") {
  return `w-full h-11 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 transition-all ${extra}`;
}

export default function SessionForm({ existingSession, allSessions, allParticipants, students, onClose, onSaved }) {
  const isEdit = !!existingSession;
  const [form, setForm] = useState({
    type: existingSession?.type || "individual",
    service: existingSession?.service || "",
    date: existingSession?.date || "",
    startTime: existingSession?.startTime || "",
    endTime: existingSession?.endTime || "",
    professor: existingSession?.professor || "",
    location: existingSession?.location || "",
    maxCapacity: existingSession?.maxCapacity || 1,
    status: existingSession?.status || "programada",
    internalNotes: existingSession?.internalNotes || "",
    studentNotes: existingSession?.studentNotes || "",
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [recurrence, setRecurrence] = useState("single");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEdit && existingSession) {
      base44.entities.SessionParticipant.filter({ sessionId: existingSession.id }).then((parts) => {
        const selectedIds = new Set(parts.map((p) => p.clientProfileId));
        setSelectedStudents(students.filter((s) => selectedIds.has(s.id)));
      });
    }
  }, [isEdit, existingSession, students]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleStudent = (student) => {
    setSelectedStudents((prev) => {
      const exists = prev.find((s) => s.id === student.id);
      if (exists) return prev.filter((s) => s.id !== student.id);
      return [...prev, student];
    });
  };

  const filteredStudents = students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    return name.includes(studentSearch.toLowerCase());
  });

  const validate = () => {
    if (!form.date) return "La fecha es obligatoria";
    if (!form.startTime) return "La hora de inicio es obligatoria";
    if (!form.endTime) return "La hora de finalización es obligatoria";
    if (form.endTime <= form.startTime) return "La hora de finalización debe ser posterior a la de inicio";
    if (!form.professor?.trim()) return "El profesor es obligatorio";
    if (selectedStudents.length === 0) return "Seleccioná al menos un alumno";
    if (form.type === "grupal" && form.maxCapacity < selectedStudents.length) {
      return `El cupo máximo (${form.maxCapacity}) es menor que la cantidad de alumnos seleccionados (${selectedStudents.length})`;
    }
    if (recurrence === "weekly" && !recurrenceEndDate) return "Seleccioná la fecha de finalización de la recurrencia";
    if (recurrence === "weekly" && recurrenceEndDate < form.date) return "La fecha de finalización debe ser posterior a la fecha de inicio";

    // Overlap checks
    if (checkProfessorOverlap(form.professor, form.date, form.startTime, form.endTime, allSessions, existingSession?.id)) {
      return "El profesor ya tiene una clase en ese horario";
    }
    for (const s of selectedStudents) {
      if (checkStudentOverlap(s.created_by_id, form.date, form.startTime, form.endTime, allParticipants, existingSession?.id)) {
        return `El alumno ${s.firstName} ${s.lastName} ya tiene una clase en ese horario`;
      }
    }
    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setSaving(true);
    try {
      const dates = recurrence === "weekly" ? generateWeeklyDates(form.date, recurrenceEndDate) : [form.date];
      for (const date of dates) {
        const sessionData = { ...form, date };
        if (isEdit) {
          await updateSessionWithParticipants(existingSession.id, sessionData, selectedStudents);
          break; // Only update once for edit
        } else {
          await createSessionWithParticipants(sessionData, selectedStudents);
        }
      }
      toast({ title: isEdit ? "Clase actualizada" : dates.length > 1 ? `${dates.length} clases creadas` : "Clase creada" });
      onSaved();
    } catch (e) {
      setError(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-black/5 px-5 py-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#121212]">{isEdit ? "Editar clase" : "Crear clase"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Tipo</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputCls()}>
                {SESSION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Servicio</label>
              <input type="text" value={form.service} onChange={(e) => update("service", e.target.value)} placeholder="Servicio relacionado" className={inputCls()} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Fecha</label>
              <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Inicio</label>
              <input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Fin</label>
              <input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} className={inputCls()} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Profesor</label>
              <input type="text" value={form.professor} onChange={(e) => update("professor", e.target.value)} placeholder="Nombre del profesor" className={inputCls()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Lugar</label>
              <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Lugar de la clase" className={inputCls()} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Cupo máximo {form.type !== "grupal" && "(opcional)"}</label>
              <input type="number" min="1" value={form.maxCapacity} onChange={(e) => update("maxCapacity", parseInt(e.target.value) || 1)} className={inputCls()} disabled={form.type !== "grupal"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">Estado</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputCls()}>
                {SESSION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#121212] mb-1.5">Indicaciones visibles para el alumno</label>
            <textarea value={form.studentNotes} onChange={(e) => update("studentNotes", e.target.value)} rows={2} placeholder="Notas que verá el alumno" className={inputCls("resize-none h-auto py-2")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#121212] mb-1.5">Observaciones internas (solo admin)</label>
            <textarea value={form.internalNotes} onChange={(e) => update("internalNotes", e.target.value)} rows={2} placeholder="Notas internas" className={inputCls("resize-none h-auto py-2")} />
          </div>

          {/* Recurrence (only for new sessions) */}
          {!isEdit && (
            <div className="p-4 rounded-xl bg-[#F5F5F5] space-y-3">
              <div className="flex items-center gap-2">
                <Repeat size={16} className="text-[#FF6600]" />
                <span className="text-sm font-semibold text-[#121212]">Repetición</span>
              </div>
              <div className="flex gap-2">
                {RECURRENCE_TYPES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRecurrence(r.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      recurrence === r.value ? "bg-[#FF6600] text-white" : "bg-white text-[#121212]/60 border border-black/10"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {recurrence === "weekly" && (
                <div>
                  <label className="block text-sm font-medium text-[#121212] mb-1.5">Finaliza el</label>
                  <input type="date" value={recurrenceEndDate} onChange={(e) => setRecurrenceEndDate(e.target.value)} min={form.date} className={inputCls()} />
                  <p className="text-xs text-[#121212]/40 mt-1">Se creará una clase cada semana en el mismo día hasta esta fecha.</p>
                </div>
              )}
            </div>
          )}

          {/* Student selection */}
          <div>
            <label className="block text-sm font-medium text-[#121212] mb-1.5 flex items-center gap-1.5">
              <Users size={15} /> Alumnos participantes ({selectedStudents.length})
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
              <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Buscar alumno..." className={inputCls("pl-9")} />
            </div>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-black/10 divide-y divide-black/5">
              {filteredStudents.length === 0 ? (
                <p className="p-4 text-center text-sm text-[#121212]/40">No hay alumnos registrados</p>
              ) : (
                filteredStudents.map((s) => {
                  const selected = selectedStudents.some((sel) => sel.id === s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStudent(s)}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        selected ? "bg-[#FF6600]/5" : "hover:bg-[#F5F5F5]"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        selected ? "bg-[#FF6600] border-[#FF6600]" : "border-black/20"
                      }`}>
                        {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className="text-sm text-[#121212]">{s.firstName} {s.lastName}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-4 -mx-5 px-5 border-t border-black/5">
            <button onClick={onClose} disabled={saving} className="px-5 h-12 rounded-xl border border-black/10 text-[#121212]/60 font-medium hover:bg-[#F5F5F5] transition-all">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 h-12 inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] transition-all disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={18} />}
              {isEdit ? "Guardar cambios" : "Crear clase"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
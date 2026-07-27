import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { X, Trash2, UserPlus, Pencil, CheckCircle2, Ban, Clock, RotateCcw } from "lucide-react";
import { ClassStatusBadge, AttendanceStatusBadge, CLASS_TYPE_LABELS, ATTENDANCE_STATUS_CONFIG } from "@/components/student/StatusBadge";
import { formatARDate, formatARTime, calculateDuration } from "@/lib/datetime";
import { updateSessionStatus, deleteSessionWithParticipants, removeParticipant, updateParticipantAttendance, addParticipant } from "@/lib/sessionOps";

const ATTENDANCE_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "presente", label: "Presente" },
  { value: "ausente", label: "Ausente" },
  { value: "cancelacion_avisada", label: "Cancelación avisada" },
];

export default function SessionDetail({ session, students, onClose, onEdit, onChanged }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const loadParticipants = async () => {
    try {
      const data = await base44.entities.SessionParticipant.filter({ sessionId: session.id });
      setParticipants(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [session.id]);

  const handleStatusChange = async (status) => {
    try {
      await updateSessionStatus(session.id, status);
      toast({ title: "Estado actualizado" });
      onChanged();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta clase? Se eliminarán también las participaciones de los alumnos.")) return;
    try {
      await deleteSessionWithParticipants(session.id);
      toast({ title: "Clase eliminada" });
      onChanged();
      onClose();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleRemoveParticipant = async (id) => {
    if (!confirm("¿Quitar a este alumno de la clase?")) return;
    try {
      await removeParticipant(id);
      loadParticipants();
      toast({ title: "Alumno quitado" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleAttendanceChange = async (participantId, status) => {
    try {
      await updateParticipantAttendance(participantId, { attendanceStatus: status });
      loadParticipants();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleNoteChange = async (participantId, note) => {
    try {
      await updateParticipantAttendance(participantId, { professionalNote: note });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudent = async (student) => {
    try {
      await addParticipant(session, student);
      loadParticipants();
      setShowAdd(false);
      toast({ title: "Alumno agregado" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const availableStudents = students.filter(
    (s) => !participants.some((p) => p.clientProfileId === s.id) &&
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-black/5 px-5 py-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#121212]">Detalle de clase</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info */}
          <div className="p-4 rounded-xl bg-[#FF6600]/5 border border-[#FF6600]/10">
            <div className="flex items-center gap-2 mb-1">
              <ClassStatusBadge status={session.status} />
            </div>
            <p className="font-display font-bold text-lg text-[#121212] capitalize">{formatARDate(session.date)}</p>
            <p className="text-sm text-[#121212]/60">{formatARTime(session.startTime)} – {formatARTime(session.endTime)} · {calculateDuration(session.startTime, session.endTime)}</p>
            <div className="mt-2 space-y-0.5 text-sm text-[#121212]/70">
              <p><strong>Tipo:</strong> {CLASS_TYPE_LABELS[session.type] || session.type}</p>
              {session.service && <p><strong>Servicio:</strong> {session.service}</p>}
              <p><strong>Profesor:</strong> {session.professor}</p>
              {session.location && <p><strong>Lugar:</strong> {session.location}</p>}
              {session.maxCapacity > 1 && <p><strong>Cupo:</strong> {participants.length}/{session.maxCapacity}</p>}
            </div>
            {session.studentNotes && (
              <div className="mt-2 pt-2 border-t border-[#FF6600]/10">
                <p className="text-xs font-bold text-[#121212]/50 uppercase">Indicaciones para el alumno</p>
                <p className="text-sm text-[#121212] mt-0.5">{session.studentNotes}</p>
              </div>
            )}
            {session.internalNotes && (
              <div className="mt-2 pt-2 border-t border-[#FF6600]/10">
                <p className="text-xs font-bold text-[#121212]/50 uppercase">Observaciones internas</p>
                <p className="text-sm text-[#121212] mt-0.5">{session.internalNotes}</p>
              </div>
            )}
          </div>

          {/* Status actions */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleStatusChange("confirmada")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"><CheckCircle2 size={15} /> Confirmar</button>
            <button onClick={() => handleStatusChange("completada")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-700"><CheckCircle2 size={15} /> Completar</button>
            <button onClick={() => handleStatusChange("reprogramada")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600"><RotateCcw size={15} /> Reprogramar</button>
            <button onClick={() => handleStatusChange("cancelada")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"><Ban size={15} /> Cancelar</button>
            <button onClick={onEdit} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#121212] text-white text-sm font-medium hover:bg-[#333]"><Pencil size={15} /> Editar</button>
            <button onClick={handleDelete} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"><Trash2 size={15} /> Eliminar</button>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-sm text-[#121212]">Alumnos ({participants.length})</h3>
              <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1 text-sm text-[#FF6600] font-medium hover:underline">
                <UserPlus size={15} /> Agregar
              </button>
            </div>

            {showAdd && (
              <div className="mb-3 p-3 rounded-xl border border-black/10 bg-[#F5F5F5]">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar alumno..." className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white text-sm mb-2" />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {availableStudents.length === 0 ? (
                    <p className="text-sm text-[#121212]/40 text-center py-2">No hay alumnos disponibles</p>
                  ) : (
                    availableStudents.map((s) => (
                      <button key={s.id} onClick={() => handleAddStudent(s)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white text-left">
                        <UserPlus size={15} className="text-[#FF6600]" />
                        <span className="text-sm text-[#121212]">{s.firstName} {s.lastName}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-sm text-[#121212]/40 text-center py-4">Cargando...</p>
            ) : participants.length === 0 ? (
              <p className="text-sm text-[#121212]/40 text-center py-4">Sin alumnos asignados</p>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-black/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#121212]">{p.studentName}</span>
                      <button onClick={() => handleRemoveParticipant(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <AttendanceStatusBadge status={p.attendanceStatus} size="xs" />
                      <select
                        value={p.attendanceStatus}
                        onChange={(e) => handleAttendanceChange(p.id, e.target.value)}
                        className="ml-auto h-8 px-2 rounded-lg border border-black/10 bg-white text-xs text-[#121212]"
                      >
                        {ATTENDANCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <input
                      type="text"
                      defaultValue={p.professionalNote || ""}
                      onBlur={(e) => handleNoteChange(p.id, e.target.value)}
                      placeholder="Observación del profesional..."
                      className="w-full mt-2 h-9 px-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-xs text-[#121212]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
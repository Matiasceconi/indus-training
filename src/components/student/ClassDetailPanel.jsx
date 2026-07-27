import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";
import { useToast } from "@/components/ui/use-toast";
import { X, MapPin, User, Clock, Loader2, CheckCircle2, MessageCircle, FileText, Dumbbell } from "lucide-react";
import { ClassStatusBadge, AttendanceStatusBadge, CLASS_TYPE_LABELS } from "./StatusBadge";
import { formatARDate, formatARTime, calculateDuration, formatTimeUntil } from "@/lib/datetime";

export default function ClassDetailPanel({ participant, onClose, onUpdate }) {
  const [confirming, setCancelling] = useState(false);
  const [loading, setLoading] = useState(false);
  const { site } = useSiteContent();
  const { toast } = useToast();

  if (!participant) return null;

  const handleConfirm = async (status) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke("confirmAttendance", {
        participantId: participant.id,
        status,
      });
      onUpdate(response.data.participant);
      toast({ title: status === "confirmado" ? "Asistencia confirmada" : "Cancelación avisada" });
    } catch (e) {
      toast({ title: e?.response?.data?.error || "Error al actualizar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const rescheduleMsg = `Hola INDUS TRAINING, quiero solicitar reprogramar mi clase del ${formatARDate(participant.classDate)} a las ${formatARTime(participant.classStartTime)}.`;
  const rescheduleLink = whatsappLink(site, rescheduleMsg);

  const canAct = !["completada", "cancelada"].includes(participant.classStatus);
  const isPast = new Date(`${participant.classDate}T${participant.classEndTime}:00-03:00`) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-black/5 px-5 py-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#121212]">Detalle de la clase</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]">
            <X size={20} className="text-[#121212]/60" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <ClassStatusBadge status={participant.classStatus} />
            <AttendanceStatusBadge status={participant.attendanceStatus} />
          </div>

          {/* Date and time */}
          <div className="p-4 rounded-xl bg-[#FF6600]/5 border border-[#FF6600]/10">
            <p className="text-xs font-bold text-[#FF6600] uppercase tracking-wide mb-1">
              {formatTimeUntil(participant.classDate, participant.classStartTime)}
            </p>
            <p className="font-display font-bold text-lg text-[#121212] capitalize">{formatARDate(participant.classDate)}</p>
            <p className="text-sm text-[#121212]/60 mt-0.5">
              {formatARTime(participant.classStartTime)} – {formatARTime(participant.classEndTime)} · {calculateDuration(participant.classStartTime, participant.classEndTime)}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-xs text-[#121212]/40 uppercase font-medium">Tipo</p>
                <p className="text-sm text-[#121212] font-medium">{CLASS_TYPE_LABELS[participant.classType] || participant.classType}</p>
                {participant.classService && <p className="text-xs text-[#121212]/50">{participant.classService}</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-xs text-[#121212]/40 uppercase font-medium">Profesor</p>
                <p className="text-sm text-[#121212] font-medium">{participant.classProfessor}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-xs text-[#121212]/40 uppercase font-medium">Lugar</p>
                <p className="text-sm text-[#121212] font-medium">{participant.classLocation || "A confirmar"}</p>
              </div>
            </div>
          </div>

          {/* Student notes */}
          {participant.classStudentNotes && (
            <div className="p-4 rounded-xl bg-[#F5F5F5]">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 text-[#FF6600]" />
                <p className="text-xs font-bold text-[#121212]/60 uppercase tracking-wide">Indicaciones</p>
              </div>
              <p className="text-sm text-[#121212] whitespace-pre-line">{participant.classStudentNotes}</p>
            </div>
          )}

          {/* Professional note (read-only) */}
          {participant.professionalNote && (
            <div className="p-4 rounded-xl bg-white border border-black/10">
              <p className="text-xs font-bold text-[#121212]/60 uppercase tracking-wide mb-1.5">Observación del profesional</p>
              <p className="text-sm text-[#121212] whitespace-pre-line">{participant.professionalNote}</p>
            </div>
          )}

          {/* Actions */}
          {canAct && !isPast && (
            <div className="space-y-2.5 pt-2">
              {participant.attendanceStatus !== "confirmado" && (
                <button
                  onClick={() => handleConfirm("confirmado")}
                  disabled={loading}
                  className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={18} />}
                  Confirmar asistencia
                </button>
              )}
              {participant.attendanceStatus === "confirmado" && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">Asistencia confirmada</p>
                </div>
              )}
              <a
                href={rescheduleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 inline-flex items-center justify-center gap-2 border border-black/10 text-[#121212] font-semibold rounded-xl hover:bg-[#F5F5F5] transition-all"
              >
                <MessageCircle size={18} />
                Solicitar reprogramación
              </a>
            </div>
          )}
          {isPast && participant.classStatus !== "completada" && participant.classStatus !== "cancelada" && (
            <p className="text-center text-sm text-[#121212]/40 py-2">Esta clase ya ocurrió.</p>
          )}
        </div>
      </div>
    </div>
  );
}
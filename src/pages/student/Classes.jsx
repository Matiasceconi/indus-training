import { useState } from "react";
import { useStudentClasses } from "@/hooks/useStudentClasses";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";
import ClassDetailPanel from "@/components/student/ClassDetailPanel";
import ClassHistory from "@/components/student/ClassHistory";
import { ClassStatusBadge, AttendanceStatusBadge, CLASS_TYPE_LABELS } from "@/components/student/StatusBadge";
import { formatARDate, formatARTime, calculateDuration, parseARDateTime, getMonthName } from "@/lib/datetime";
import { Clock, MapPin, User, Dumbbell, MessageCircle, Calendar } from "lucide-react";

export default function Classes() {
  const { participants, loading } = useStudentClasses();
  const { site } = useSiteContent();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("proximas");

  const now = new Date();
  const upcoming = participants
    .filter((p) => {
      const dt = parseARDateTime(p.classDate, p.classEndTime);
      return dt > now && !["cancelada", "completada"].includes(p.classStatus);
    })
    .sort((a, b) => `${a.classDate}T${a.classStartTime}`.localeCompare(`${b.classDate}T${b.classStartTime}`));

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-[#121212] mb-4">Mis clases</h1>
      <div className="flex gap-1.5 p-1 bg-[#F5F5F5] rounded-xl mb-5 w-fit">
        <button onClick={() => setTab("proximas")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "proximas" ? "bg-white text-[#FF6600] shadow-sm" : "text-[#121212]/50"}`}>Próximas</button>
        <button onClick={() => setTab("historial")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "historial" ? "bg-white text-[#FF6600] shadow-sm" : "text-[#121212]/50"}`}>Historial</button>
      </div>

      {tab === "historial" ? (
        <ClassHistory participants={participants} onSelect={setSelected} />
      ) : loading ? (
        <div className="py-20 text-center text-[#121212]/40">Cargando...</div>
      ) : upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
          <Calendar className="w-10 h-10 text-[#121212]/20 mx-auto mb-3" />
          <p className="text-[#121212]/60 mb-4">No tenés próximas clases programadas.</p>
          <a
            href={whatsappLink(site, "Hola INDUS TRAINING, quiero consultar disponibilidad para clases.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6600] text-white text-sm font-semibold rounded-xl hover:bg-[#e65c00] transition-all"
          >
            <MessageCircle size={18} /> Consultar disponibilidad
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full flex items-start gap-4 p-4 bg-white rounded-2xl border border-black/5 hover:border-[#FF6600]/30 hover:shadow-sm transition-all text-left"
            >
              <div className="text-center shrink-0 w-14 pt-1">
                <p className="text-[10px] text-[#121212]/40 uppercase font-bold capitalize">
                  {formatARDate(c.classDate, { weekday: "short" }).split(",")[0]}
                </p>
                <p className="text-2xl font-display font-bold text-[#121212]">{c.classDate.split("-")[2]}</p>
                <p className="text-[10px] text-[#121212]/40 capitalize">{getMonthName(parseInt(c.classDate.split("-")[1]) - 1)}</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-black/5 pl-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <ClassStatusBadge status={c.classStatus} size="xs" />
                  <AttendanceStatusBadge status={c.attendanceStatus} size="xs" />
                </div>
                <p className="text-sm font-semibold text-[#121212] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FF6600]" />
                  {formatARTime(c.classStartTime)} – {formatARTime(c.classEndTime)}
                  <span className="text-[#121212]/40 font-normal">· {calculateDuration(c.classStartTime, c.classEndTime)}</span>
                </p>
                <p className="text-sm text-[#121212]/70 flex items-center gap-1.5 mt-1">
                  <Dumbbell size={14} className="text-[#121212]/40" />
                  {CLASS_TYPE_LABELS[c.classType] || c.classType}
                  {c.classService && <span className="text-[#121212]/40">· {c.classService}</span>}
                </p>
                <p className="text-xs text-[#121212]/50 flex items-center gap-1.5 mt-1">
                  <User size={13} className="text-[#121212]/40" /> {c.classProfessor}
                </p>
                {c.classLocation && (
                  <p className="text-xs text-[#121212]/50 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={13} className="text-[#121212]/40" /> {c.classLocation}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <ClassDetailPanel
          participant={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => setSelected(updated)}
        />
      )}
    </div>
  );
}
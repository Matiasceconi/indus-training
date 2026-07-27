import { useState } from "react";
import { ClassStatusBadge, AttendanceStatusBadge, CLASS_TYPE_LABELS } from "./StatusBadge";
import { formatARTime, parseARDateTime, getMonthName } from "@/lib/datetime";
import { FileText } from "lucide-react";

export default function ClassHistory({ participants, onSelect }) {
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const now = new Date();
  const past = participants.filter((p) => {
    const dt = parseARDateTime(p.classDate, p.classEndTime);
    return dt < now;
  });

  const months = [...new Set(past.map((p) => p.classDate?.substring(0, 7)).filter(Boolean))].sort().reverse();

  const filtered = past
    .filter((p) => {
      if (monthFilter && !p.classDate?.startsWith(monthFilter)) return false;
      if (statusFilter && p.classStatus !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => `${b.classDate}T${b.classStartTime}`.localeCompare(`${a.classDate}T${a.classStartTime}`));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212]">
          <option value="">Todos los meses</option>
          {months.map((m) => {
            const [y, mo] = m.split("-");
            return <option key={m} value={m}>{getMonthName(parseInt(mo) - 1)} {y}</option>;
          })}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm text-[#121212]">
          <option value="">Todos los estados</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
          <option value="reprogramada">Reprogramada</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-[#121212]/40">No hay clases en el historial</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full flex items-start gap-4 p-4 bg-white rounded-2xl border border-black/5 hover:border-[#FF6600]/30 transition-all text-left"
            >
              <div className="text-center shrink-0 w-14 pt-1">
                <p className="text-2xl font-display font-bold text-[#121212]">{c.classDate.split("-")[2]}</p>
                <p className="text-[10px] text-[#121212]/40 capitalize">{getMonthName(parseInt(c.classDate.split("-")[1]) - 1)}</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-black/5 pl-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <ClassStatusBadge status={c.classStatus} size="xs" />
                  <AttendanceStatusBadge status={c.attendanceStatus} size="xs" />
                </div>
                <p className="text-sm font-semibold text-[#121212]">
                  {formatARTime(c.classStartTime)} · {CLASS_TYPE_LABELS[c.classType] || c.classType}
                </p>
                <p className="text-xs text-[#121212]/50 mt-0.5">{c.classProfessor}</p>
                {c.professionalNote && (
                  <div className="mt-1.5 p-2 rounded-lg bg-[#F5F5F5] flex items-start gap-1.5">
                    <FileText size={12} className="text-[#121212]/40 shrink-0 mt-0.5" />
                    <p className="text-xs text-[#121212]/60">{c.professionalNote}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
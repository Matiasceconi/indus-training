import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import { ClassStatusBadge, CLASS_STATUS_CONFIG, CLASS_TYPE_LABELS } from "@/components/student/StatusBadge";
import { formatARDate, formatARTime, getMonthName, getDaysInMonth, getFirstDayOfMonth, todayAR, toARDateString } from "@/lib/datetime";
import SessionForm from "./SessionForm";
import SessionDetail from "./SessionDetail";

const STATUS_FILTERS = [
  { value: "", label: "Todos los estados" },
  { value: "programada", label: "Programada" },
  { value: "pendiente_confirmacion", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "reprogramada", label: "Reprogramada" },
];

export default function AgendaAdmin() {
  const [sessions, setSessions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(todayAR());
  const [selectedDate, setSelectedDate] = useState(todayAR());
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [detailSession, setDetailSession] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProfessor, setFilterProfessor] = useState("");
  const [filterService, setFilterService] = useState("");

  const loadAll = useCallback(async () => {
    try {
      const [sess, studs] = await Promise.all([
        base44.entities.Session.list("-date", 500),
        base44.entities.ClientProfile.list("-created_date", 500),
      ]);
      setSessions(sess || []);
      setStudents(studs || []);
      // Load all participants for overlap checking
      const parts = await base44.entities.SessionParticipant.list("-classDate", 1000);
      setParticipants(parts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const [year, month] = cursor.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, month - 1);
  const firstDay = getFirstDayOfMonth(year, month - 1);

  const professors = [...new Set(sessions.map((s) => s.professor).filter(Boolean))];
  const services = [...new Set(sessions.map((s) => s.service).filter(Boolean))];

  const filteredSessions = sessions.filter((s) => {
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterProfessor && s.professor !== filterProfessor) return false;
    if (filterService && s.service !== filterService) return false;
    return true;
  });

  const sessionsForDate = filteredSessions
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const sessionsForMonth = filteredSessions.filter((s) => s.date?.startsWith(cursor.substring(0, 7)));
  const sessionCountByDate = {};
  sessionsForMonth.forEach((s) => {
    sessionCountByDate[s.date] = (sessionCountByDate[s.date] || 0) + 1;
  });

  const prevMonth = () => { const d = new Date(year, month - 2, 1); setCursor(toARDateString(d)); };
  const nextMonth = () => { const d = new Date(year, month, 1); setCursor(toARDateString(d)); };

  const handleSaved = () => {
    setShowForm(false);
    setEditSession(null);
    loadAll();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#FF6600]" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm">
          {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        {professors.length > 0 && (
          <select value={filterProfessor} onChange={(e) => setFilterProfessor(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm">
            <option value="">Todos los profesores</option>
            {professors.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        )}
        {services.length > 0 && (
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm">
            <option value="">Todos los servicios</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <button
          onClick={() => { setShowForm(true); setEditSession(null); }}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6600] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00]"
        >
          <Plus size={16} /> Crear clase
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]"><ChevronLeft size={18} /></button>
            <h3 className="font-display font-bold text-base text-[#121212] capitalize">{getMonthName(month - 1)} {year}</h3>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-[#121212]/40 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const count = sessionCountByDate[dateStr] || 0;
              const isSel = dateStr === selectedDate;
              const isToday = dateStr === todayAR();
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg p-1 text-left transition-all ${
                    isSel ? "bg-[#FF6600] text-white" : count > 0 ? "bg-[#FF6600]/5 hover:bg-[#FF6600]/10" : "hover:bg-[#F5F5F5]"
                  }`}
                >
                  <span className={`text-xs font-medium ${isSel ? "text-white" : isToday ? "text-[#FF6600]" : "text-[#121212]/60"}`}>{day}</span>
                  {count > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                        <span key={j} className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-[#FF6600]"}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Session list for selected date */}
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <h3 className="font-display font-bold text-base text-[#121212] mb-1 capitalize">{formatARDate(selectedDate)}</h3>
          <p className="text-xs text-[#121212]/40 mb-3">{sessionsForDate.length} clase{sessionsForDate.length !== 1 ? "s" : ""}</p>
          {sessionsForDate.length === 0 ? (
            <div className="py-10 text-center">
              <Calendar className="w-8 h-8 text-[#121212]/20 mx-auto mb-2" />
              <p className="text-sm text-[#121212]/40">No hay clases en esta fecha</p>
              <button onClick={() => { setShowForm(true); setEditSession(null); }} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6600] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00]">
                <Plus size={16} /> Crear clase
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sessionsForDate.map((s) => {
                const count = participants.filter((p) => p.sessionId === s.id).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => setDetailSession(s)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-black/5 hover:border-[#FF6600]/30 transition-all text-left"
                  >
                    <div className="text-center shrink-0 w-14">
                      <p className="text-sm font-bold text-[#121212]">{formatARTime(s.startTime)}</p>
                      <p className="text-[10px] text-[#121212]/40">{formatARTime(s.endTime)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#121212] truncate">{CLASS_TYPE_LABELS[s.type] || s.type}</p>
                      <p className="text-xs text-[#121212]/50 truncate">{s.professor} · {count} alumno{count !== 1 ? "s" : ""}</p>
                    </div>
                    <ClassStatusBadge status={s.status} size="xs" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All sessions list (filtered) */}
      <div className="bg-white rounded-2xl border border-black/5 p-4">
        <h3 className="font-display font-bold text-sm text-[#121212] mb-3">Todas las clases ({filteredSessions.length})</h3>
        {filteredSessions.length === 0 ? (
          <p className="text-sm text-[#121212]/40 text-center py-6">No hay clases que coincidan con los filtros</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSessions.slice(0, 50).map((s) => {
              const count = participants.filter((p) => p.sessionId === s.id).length;
              return (
                <button key={s.id} onClick={() => setDetailSession(s)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-black/5 hover:border-[#FF6600]/30 transition-all text-left">
                  <div className="text-center shrink-0 w-16">
                    <p className="text-xs text-[#121212]/40">{s.date.split("-")[2]}/{s.date.split("-")[1]}</p>
                    <p className="text-sm font-bold text-[#121212]">{formatARTime(s.startTime)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#121212] truncate">{CLASS_TYPE_LABELS[s.type] || s.type} {s.service && `· ${s.service}`}</p>
                    <p className="text-xs text-[#121212]/50 truncate">{s.professor} · {count} alumno{count !== 1 ? "s" : ""}</p>
                  </div>
                  <ClassStatusBadge status={s.status} size="xs" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <SessionForm
          existingSession={editSession}
          allSessions={sessions}
          allParticipants={participants}
          students={students}
          onClose={() => { setShowForm(false); setEditSession(null); }}
          onSaved={handleSaved}
        />
      )}
      {detailSession && (
        <SessionDetail
          session={detailSession}
          students={students}
          onClose={() => setDetailSession(null)}
          onEdit={() => { setEditSession(detailSession); setShowForm(true); setDetailSession(null); }}
          onChanged={loadAll}
        />
      )}
    </div>
  );
}
import { useState } from "react";
import { useStudentClasses } from "@/hooks/useStudentClasses";
import ClassDetailPanel from "@/components/student/ClassDetailPanel";
import { ClassStatusBadge, CLASS_STATUS_CONFIG } from "@/components/student/StatusBadge";
import {
  formatARDate, formatARTime, getMonthName, getDaysInMonth, getFirstDayOfMonth,
  todayAR, toARDateString, parseARDateTime, getWeekDates, getWeekdayShort, isToday,
} from "@/lib/datetime";
import { ChevronLeft, ChevronRight, Calendar, List, Grid, Clock } from "lucide-react";

const VIEWS = [
  { id: "mensual", label: "Mensual", icon: Grid },
  { id: "semanal", label: "Semanal", icon: Calendar },
  { id: "lista", label: "Lista", icon: List },
];

export default function StudentCalendar() {
  const { participants, loading } = useStudentClasses();
  const [view, setView] = useState("mensual");
  const [selected, setSelected] = useState(null);
  const today = todayAR();
  const [cursor, setCursor] = useState(today); // date string for navigation

  const [year, month] = cursor.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, month - 1);
  const firstDay = getFirstDayOfMonth(year, month - 1);

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCursor(toARDateString(d));
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setCursor(toARDateString(d));
  };
  const prevWeek = () => {
    setCursor((prev) => {
      const d = parseARDateTime(prev);
      d.setDate(d.getDate() - 7);
      return toARDateString(d);
    });
  };
  const nextWeek = () => {
    setCursor((prev) => {
      const d = parseARDateTime(prev);
      d.setDate(d.getDate() + 7);
      return toARDateString(d);
    });
  };

  const getClassesForDate = (dateStr) =>
    participants.filter((p) => p.classDate === dateStr).sort((a, b) => a.classStartTime.localeCompare(b.classStartTime));

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-[#121212] mb-4">Mi calendario</h1>

      {/* View toggle */}
      <div className="flex gap-1.5 p-1 bg-[#F5F5F5] rounded-xl mb-5 w-fit">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === v.id ? "bg-white text-[#FF6600] shadow-sm" : "text-[#121212]/50"
            }`}
          >
            <v.icon size={15} /> {v.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#121212]/40">Cargando...</div>
      ) : view === "mensual" ? (
        <MonthlyView
          year={year}
          month={month - 1}
          daysInMonth={daysInMonth}
          firstDay={firstDay}
          getClassesForDate={getClassesForDate}
          onSelect={setSelected}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          today={today}
        />
      ) : view === "semanal" ? (
        <WeeklyView
          cursor={cursor}
          getClassesForDate={getClassesForDate}
          onSelect={setSelected}
          prevWeek={prevWeek}
          nextWeek={nextWeek}
        />
      ) : (
        <ListView participants={participants} onSelect={setSelected} />
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

function MonthlyView({ year, month, daysInMonth, firstDay, getClassesForDate, onSelect, prevMonth, nextMonth, today }) {
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(dateStr);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#F5F5F5]"><ChevronLeft size={20} /></button>
        <h2 className="font-display font-bold text-lg text-[#121212] capitalize">{getMonthName(month)} {year}</h2>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#F5F5F5]"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-[#121212]/40 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={i} />;
          const classes = getClassesForDate(dateStr);
          const dayNum = parseInt(dateStr.split("-")[2]);
          const isTodayCell = dateStr === today;
          return (
            <button
              key={i}
              onClick={() => classes.length > 0 && onSelect(classes[0])}
              className={`min-h-[52px] sm:min-h-[64px] p-1.5 rounded-lg border text-left transition-all ${
                classes.length > 0 ? "bg-white border-black/10 hover:border-[#FF6600]/30" : "border-transparent"
              } ${isTodayCell ? "ring-1 ring-[#FF6600]" : ""}`}
            >
              <span className={`text-xs font-medium ${isTodayCell ? "text-[#FF6600]" : "text-[#121212]/60"}`}>{dayNum}</span>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {classes.slice(0, 3).map((c) => (
                  <span key={c.id} className={`w-1.5 h-1.5 rounded-full ${(CLASS_STATUS_CONFIG[c.classStatus] || CLASS_STATUS_CONFIG.programada).dot}`} />
                ))}
                {classes.length > 3 && <span className="text-[8px] text-[#121212]/40">+{classes.length - 3}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyView({ cursor, getClassesForDate, onSelect, prevWeek, nextWeek }) {
  const weekDates = getWeekDates(cursor);
  const [y, m, d] = cursor.split("-").map(Number);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevWeek} className="p-2 rounded-lg hover:bg-[#F5F5F5]"><ChevronLeft size={20} /></button>
        <h2 className="font-display font-bold text-base text-[#121212]">
          {formatARDate(weekDates[0])} – {formatARDate(weekDates[6])}
        </h2>
        <button onClick={nextWeek} className="p-2 rounded-lg hover:bg-[#F5F5F5]"><ChevronRight size={20} /></button>
      </div>
      <div className="space-y-3">
        {weekDates.map((dateStr) => {
          const classes = getClassesForDate(dateStr);
          return (
            <div key={dateStr}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#121212]/40 uppercase">{getWeekdayShort(dateStr)}</span>
                <span className="text-sm font-medium text-[#121212]">{parseInt(dateStr.split("-")[2])}</span>
                {isToday(dateStr) && <span className="text-[10px] text-[#FF6600] font-bold">HOY</span>}
              </div>
              {classes.length === 0 ? (
                <div className="py-2 pl-4 text-xs text-[#121212]/30">Sin clases</div>
              ) : (
                <div className="space-y-1.5">
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onSelect(c)}
                      className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-black/5 hover:border-[#FF6600]/30 transition-all text-left"
                    >
                      <div className="text-center shrink-0 w-12">
                        <p className="text-sm font-bold text-[#121212]">{formatARTime(c.classStartTime)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#121212] truncate">{c.classService || c.classType}</p>
                        <p className="text-xs text-[#121212]/50 truncate">{c.classProfessor}</p>
                      </div>
                      <ClassStatusBadge status={c.classStatus} size="xs" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListView({ participants, onSelect }) {
  const sorted = [...participants].sort((a, b) =>
    `${a.classDate}T${a.classStartTime}`.localeCompare(`${b.classDate}T${b.classStartTime}`)
  );
  if (sorted.length === 0) {
    return <div className="py-20 text-center text-[#121212]/40">No tenés clases registradas.</div>;
  }
  return (
    <div className="space-y-2">
      {sorted.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-black/5 hover:border-[#FF6600]/30 transition-all text-left"
        >
          <div className="text-center shrink-0 w-14">
            <p className="text-xs text-[#121212]/40 capitalize">{formatARDate(c.classDate, { weekday: "short" }).split(",")[0]}</p>
            <p className="text-lg font-bold text-[#121212]">{c.classDate.split("-")[2]}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#121212]">{c.classService || c.classType}</p>
            <p className="text-xs text-[#121212]/50">{formatARTime(c.classStartTime)} · {c.classProfessor}</p>
          </div>
          <ClassStatusBadge status={c.classStatus} size="xs" />
        </button>
      ))}
    </div>
  );
}
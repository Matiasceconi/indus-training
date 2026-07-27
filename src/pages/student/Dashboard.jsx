import { useStudentClasses } from "@/hooks/useStudentClasses";
import { useStudentProfile } from "@/contexts/StudentProfileContext";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";
import { Image } from "@/components/ui/image";
import { formatARDate, formatARTime, calculateDuration, formatTimeUntil, parseARDateTime, todayAR, getMonthName } from "@/lib/datetime";
import { CLASS_TYPE_LABELS } from "@/components/student/StatusBadge";
import { Clock, MapPin, User, MessageCircle, Calendar, Dumbbell, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { profile } = useStudentProfile();
  const { participants, loading } = useStudentClasses();
  const { site } = useSiteContent();

  const now = new Date();
  const futureClasses = participants
    .filter((p) => {
      const dt = parseARDateTime(p.classDate, p.classEndTime);
      return dt > now && !["cancelada", "completada"].includes(p.classStatus);
    })
    .sort((a, b) => `${a.classDate}T${a.classStartTime}`.localeCompare(`${b.classDate}T${b.classStartTime}`));
  const nextClass = futureClasses[0];

  const today = todayAR();
  const [year, month] = today.split("-").map(Number);
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthClasses = participants.filter((p) => p.classDate?.startsWith(monthPrefix));
  const scheduled = monthClasses.filter((p) => ["programada", "pendiente_confirmacion", "confirmada"].includes(p.classStatus)).length;
  const completed = monthClasses.filter((p) => p.classStatus === "completada").length;
  const pending = monthClasses.filter((p) => p.attendanceStatus === "pendiente" && !["cancelada", "completada"].includes(p.classStatus)).length;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#F5F5F5] border border-black/5 shrink-0">
          {profile.profilePhoto ? (
            <Image src={profile.profilePhoto} fittingType="fill" className="w-full h-full" alt={profile.firstName} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-display font-black text-[#FF6600]">
              {(profile.firstName?.[0] || "?").toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#121212]">Hola, {profile.firstName}</h1>
          <p className="text-[#121212]/60 text-sm sm:text-base">Este es tu espacio personal en INDUS TRAINING.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#121212]/40">Cargando tus clases...</div>
      ) : (
        <>
          {/* Next class */}
          {nextClass ? (
            <div className="bg-gradient-to-br from-[#FF6600] to-[#e65c00] rounded-2xl p-5 sm:p-6 text-white mb-6 shadow-lg shadow-[#FF6600]/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-white/80" />
                <p className="text-xs font-bold text-white/80 uppercase tracking-wide">Próxima clase</p>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl capitalize">{formatARDate(nextClass.classDate)}</p>
              <p className="text-white/90 text-sm sm:text-base mt-0.5">
                {formatARTime(nextClass.classStartTime)} – {formatARTime(nextClass.classEndTime)} · {calculateDuration(nextClass.classStartTime, nextClass.classEndTime)}
              </p>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mt-3">
                <Clock size={14} /> {formatTimeUntil(nextClass.classDate, nextClass.classStartTime)}
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Dumbbell size={15} /> {CLASS_TYPE_LABELS[nextClass.classType] || nextClass.classType}
                  {nextClass.classService && <span className="text-white/60">· {nextClass.classService}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <User size={15} /> {nextClass.classProfessor}
                </div>
                {nextClass.classLocation && (
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <MapPin size={15} /> {nextClass.classLocation}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8 mb-6 text-center">
              <AlertCircle className="w-10 h-10 text-[#121212]/20 mx-auto mb-3" />
              <p className="text-[#121212]/60 mb-4">Todavía no tenés una próxima clase programada.</p>
              <a
                href={whatsappLink(site, "Hola INDUS TRAINING, quiero consultar disponibilidad para clases.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6600] text-white text-sm font-semibold rounded-xl hover:bg-[#e65c00] transition-all"
              >
                <MessageCircle size={18} /> Consultar disponibilidad
              </a>
            </div>
          )}

          {/* Monthly summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-black/5 p-4 text-center">
              <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-display font-bold text-[#121212]">{scheduled}</p>
              <p className="text-xs text-[#121212]/50">Programadas</p>
            </div>
            <div className="bg-white rounded-xl border border-black/5 p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-display font-bold text-green-600">{completed}</p>
              <p className="text-xs text-[#121212]/50">Realizadas</p>
            </div>
            <div className="bg-white rounded-xl border border-black/5 p-4 text-center">
              <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-display font-bold text-amber-600">{pending}</p>
              <p className="text-xs text-[#121212]/50">Pendientes</p>
            </div>
          </div>
          <p className="text-xs text-[#121212]/40 mb-6 -mt-2">Resumen de {getMonthName(month - 1)} {year}</p>

          {/* Upcoming classes */}
          {futureClasses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-base text-[#121212]">Mis próximas clases</h2>
                <Link to="/mi-espacio/clases" className="text-sm text-[#FF6600] font-medium hover:underline">Ver todas</Link>
              </div>
              <div className="space-y-2">
                {futureClasses.slice(0, 3).map((c) => (
                  <Link key={c.id} to="/mi-espacio/clases" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-black/5 hover:border-[#FF6600]/30 transition-all">
                    <div className="text-center shrink-0 w-12">
                      <p className="text-sm font-bold text-[#121212]">{formatARTime(c.classStartTime)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#121212] truncate">{c.classService || c.classType}</p>
                      <p className="text-xs text-[#121212]/50 truncate capitalize">{formatARDate(c.classDate, { weekday: "short" })} · {c.classProfessor}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/mi-espacio/calendario" className="bg-white rounded-xl border border-black/5 p-4 hover:border-[#FF6600]/30 transition-colors">
              <Calendar className="w-6 h-6 text-[#FF6600] mb-2" />
              <p className="font-semibold text-sm text-[#121212]">Mi calendario</p>
              <p className="text-xs text-[#121212]/50">Ver todas tus clases</p>
            </Link>
            <Link to="/mi-espacio/clases" className="bg-white rounded-xl border border-black/5 p-4 hover:border-[#FF6600]/30 transition-colors">
              <Dumbbell className="w-6 h-6 text-[#FF6600] mb-2" />
              <p className="font-semibold text-sm text-[#121212]">Mis clases</p>
              <p className="text-xs text-[#121212]/50">Próximas clases</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
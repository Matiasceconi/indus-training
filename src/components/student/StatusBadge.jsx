export const CLASS_STATUS_CONFIG = {
  programada: { label: "Programada", cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  pendiente_confirmacion: { label: "Pendiente", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  confirmada: { label: "Confirmada", cls: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  completada: { label: "Completada", cls: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  cancelada: { label: "Cancelada", cls: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
  reprogramada: { label: "Reprogramada", cls: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
};

export const ATTENDANCE_STATUS_CONFIG = {
  pendiente: { label: "Pendiente", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  confirmado: { label: "Confirmado", cls: "bg-green-50 text-green-700 border-green-200" },
  presente: { label: "Presente", cls: "bg-green-50 text-green-700 border-green-200" },
  ausente: { label: "Ausente", cls: "bg-red-50 text-red-600 border-red-200" },
  cancelacion_avisada: { label: "Cancelación avisada", cls: "bg-amber-50 text-amber-700 border-amber-200" },
};

export const CLASS_TYPE_LABELS = {
  individual: "Individual",
  grupal: "Grupal",
  seguimiento_online: "Seguimiento online",
  otra: "Otra",
};

export function ClassStatusBadge({ status, size = "sm" }) {
  const cfg = CLASS_STATUS_CONFIG[status] || CLASS_STATUS_CONFIG.programada;
  const sizeCls = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${cfg.cls} ${sizeCls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function AttendanceStatusBadge({ status, size = "sm" }) {
  const cfg = ATTENDANCE_STATUS_CONFIG[status] || ATTENDANCE_STATUS_CONFIG.pendiente;
  const sizeCls = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${cfg.cls} ${sizeCls}`}>
      {cfg.label}
    </span>
  );
}
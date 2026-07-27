const AR_TIMEZONE = "America/Argentina/Buenos_Aires";

export function parseARDateTime(dateStr, timeStr = "00:00") {
  return new Date(`${dateStr}T${timeStr}:00-03:00`);
}

export function formatARDate(dateStr, opts = {}) {
  if (!dateStr) return "—";
  const date = parseARDateTime(dateStr);
  return date.toLocaleDateString("es-AR", {
    weekday: opts.weekday || "long",
    day: "numeric",
    month: opts.month || "long",
    year: opts.year || undefined,
    timeZone: AR_TIMEZONE,
  });
}

export function formatARDateShort(dateStr) {
  if (!dateStr) return "—";
  const date = parseARDateTime(dateStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: AR_TIMEZONE,
  });
}

export function formatARTime(timeStr) {
  if (!timeStr) return "—";
  return timeStr;
}

export function timeUntilClass(dateStr, timeStr) {
  const classDateTime = parseARDateTime(dateStr, timeStr);
  const now = new Date();
  const diff = classDateTime - now;
  if (diff < 0) return { diff, past: true, days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { diff, days, hours, minutes, past: false };
}

export function formatTimeUntil(dateStr, timeStr) {
  const t = timeUntilClass(dateStr, timeStr);
  if (t.past) return "Ya ocurrió";
  if (t.days > 0) return `Faltan ${t.days} ${t.days === 1 ? "día" : "días"}`;
  if (t.hours > 0) return `Faltan ${t.hours} ${t.hours === 1 ? "hora" : "horas"}`;
  return `Faltan ${t.minutes} ${t.minutes === 1 ? "minuto" : "minutos"}`;
}

export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "—";
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function getWeekdayName(dateStr) {
  const date = parseARDateTime(dateStr);
  return WEEKDAYS[date.getDay()];
}

export function getWeekdayShort(dateStr) {
  const date = parseARDateTime(dateStr);
  return WEEKDAYS_SHORT[date.getDay()];
}

export function getMonthName(monthIndex) {
  return MONTHS[monthIndex];
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(dateStr1, dateStr2) {
  return dateStr1 === dateStr2;
}

export function isToday(dateStr) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: AR_TIMEZONE });
  return dateStr === today;
}

export function isFuture(dateStr, timeStr) {
  return timeUntilClass(dateStr, timeStr || "23:59").diff > 0;
}

export function getWeekDates(dateStr) {
  const date = parseARDateTime(dateStr);
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toLocaleDateString("en-CA", { timeZone: AR_TIMEZONE }));
  }
  return dates;
}

export function toARDateString(date) {
  return date.toLocaleDateString("en-CA", { timeZone: AR_TIMEZONE });
}

export function todayAR() {
  return new Date().toLocaleDateString("en-CA", { timeZone: AR_TIMEZONE });
}

export function addDays(dateStr, n) {
  const d = parseARDateTime(dateStr);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-CA", { timeZone: AR_TIMEZONE });
}

export function getMonthLabel(year, month) {
  return `${MONTHS[month]} ${year}`;
}
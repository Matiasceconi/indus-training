// ============================================================
//  CONFIGURACIÓN EDITABLE — INDUS TRAINING
//  Modificá estos valores para actualizar toda la página.
// ============================================================

export const SITE_CONFIG = {
  // EDITAR: Reemplazar con el número real de WhatsApp.
  // Formato internacional sin "+" ni espacios. Ej: 5491112345678
  whatsappNumber: "5491100000000",

  // Mensaje por defecto al abrir WhatsApp
  whatsappMessage: "Hola INDUS TRAINING, quiero más información sobre los servicios.",

  // EDITAR: Reemplazar con el Instagram real de INDUS TRAINING
  instagramUrl: "https://instagram.com/indus.training",
  instagramHandle: "@indus.training",

  // Ubicación
  location: "Puerto Madero, Buenos Aires",
  locationShort: "Puerto Madero, CABA",

  // Año para el footer
  year: "2026",
};

// Genera un enlace de WhatsApp con mensaje opcional pre-cargado
export function whatsappLink(message) {
  const text = encodeURIComponent(message || SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`;
}

// Mensajes pre-cargados por servicio
export const WHATSAPP_MESSAGES = {
  general: "Hola INDUS TRAINING, quiero más información sobre los servicios.",
  personalizado: "Hola INDUS TRAINING, quiero reservar una clase de entrenamiento personalizado.",
  futbol: "Hola INDUS TRAINING, quiero consultar por los grupos de fútbol (edades, días, cupos y disponibilidad).",
  planes: "Hola INDUS TRAINING, quiero comenzar mi planificación con seguimiento.",
  contacto: "Hola INDUS TRAINING, contame cuál es mi objetivo y ayúdenme a elegir el servicio indicado.",
};
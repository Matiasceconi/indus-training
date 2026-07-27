import { MessageCircle, Instagram, MapPin } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink, WHATSAPP_MESSAGES, SITE_CONFIG } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Logo variant="light" />
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin size={14} className="text-[#FF6600]" />
              {SITE_CONFIG.location}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#FF6600] flex items-center justify-center transition-colors duration-200"
            >
              <Instagram size={18} />
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#FF6600] flex items-center justify-center transition-colors duration-200"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-white/50">
            © {SITE_CONFIG.year} INDUS TRAINING. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            Puerto Madero, Buenos Aires · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
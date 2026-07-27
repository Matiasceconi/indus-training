import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";
import { MessageCircle, MapPin, Clock, Instagram, Navigation } from "lucide-react";

export default function Contact() {
  const { site } = useSiteContent();

  return (
    <div className="p-5 lg:p-8 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-[#121212] mb-1">Contacto</h1>
      <p className="text-sm text-[#121212]/50 mb-6">¿Necesitas ayuda? Estamos para vos.</p>

      <div className="space-y-4">
        {/* WhatsApp */}
        <a
          href={whatsappLink(site, site?.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-[#FF6600] rounded-2xl text-white hover:bg-[#e65c00] transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Escribinos por WhatsApp</p>
            <p className="text-sm text-white/80">Respuesta rápida y directa</p>
          </div>
        </a>

        {/* Location */}
        {site?.locationAddress && (
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-[#FF6600]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#121212]/40 uppercase tracking-wide mb-0.5">Ubicación</p>
                <p className="text-sm text-[#121212] font-medium whitespace-pre-line">{site.locationAddress}</p>
              </div>
            </div>
            {site?.locationSchedule && (
              <div className="flex items-start gap-3 mb-3 pl-1">
                <Clock size={18} className="text-[#121212]/40 shrink-0 mt-0.5" />
                <p className="text-sm text-[#121212]/70 whitespace-pre-line">{site.locationSchedule}</p>
              </div>
            )}
            {site?.locationModalities && (
              <div className="flex items-start gap-3 pl-1">
                <Navigation size={18} className="text-[#121212]/40 shrink-0 mt-0.5" />
                <p className="text-sm text-[#121212]/70 whitespace-pre-line">{site.locationModalities}</p>
              </div>
            )}
          </div>
        )}

        {/* Instagram */}
        {site?.instagramUrl && (
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-black/5 hover:border-[#FF6600]/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Instagram size={24} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-base text-[#121212]">Seguinos en Instagram</p>
              <p className="text-sm text-[#121212]/50">{site.instagramHandle || "@indus.training"}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
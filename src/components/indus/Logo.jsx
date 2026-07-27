import { Link } from "react-router-dom";
import { useSiteContent } from "@/contexts/SiteContentContext";

// Logo de INDUS TRAINING. Si hay un logo cargado desde el panel admin,
// muestra la imagen; si no, muestra el logo de texto como fallback.
export default function Logo({ variant = "dark", className = "" }) {
  const { site } = useSiteContent();
  const color = variant === "light" ? "text-white" : "text-[#121212]";

  if (site?.logo) {
    return (
      <Link to="/" className={`inline-block ${className}`}>
        <img
          src={site.logo}
          alt="INDUS TRAINING"
          className={`h-9 sm:h-10 w-auto object-contain ${variant === "light" ? "brightness-0 invert" : ""}`}
        />
      </Link>
    );
  }

  return (
    <Link to="/" className={`inline-flex items-baseline gap-1.5 leading-none select-none ${className}`}>
      <span className={`font-display font-black tracking-tight text-xl sm:text-2xl ${color}`}>
        INDUS
      </span>
      <span className="font-display font-bold tracking-[0.2em] text-[10px] sm:text-xs text-[#FF6600] uppercase">
        Training
      </span>
    </Link>
  );
}
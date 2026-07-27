import { Link } from "react-router-dom";

// Logo de INDUS TRAINING — componente de texto estilizado.
// Para reemplazar por el logo real: cambiá el contenido por <img src="..." />
// y guardá el archivo del logo en src/assets/indus-logo.svg o similar.
export default function Logo({ className = "", variant = "dark" }) {
  const color = variant === "light" ? "text-white" : "text-[#121212]";

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
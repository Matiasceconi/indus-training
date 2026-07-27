import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useSiteContent, whatsappLink } from "@/contexts/SiteContentContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Cómo trabajamos", href: "#como-trabajamos" },
  { label: "Experiencias", href: "#experiencias" },
  { label: "Equipo", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { site } = useSiteContent();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => handleNav("#inicio")} className="shrink-0">
            <Logo />
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-[#121212]/80 hover:text-[#FF6600] transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/mi-espacio" className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#121212]/80 hover:text-[#FF6600] transition-colors">
                Mi espacio
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#121212]/80 hover:text-[#FF6600] transition-colors">
                Iniciar sesión
              </Link>
            )}
            <a
              href={whatsappLink(site, site?.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#FF6600] text-white text-sm font-semibold rounded-full hover:bg-[#e65c00] active:scale-95 transition-all duration-200 shadow-sm"
            >
              Quiero empezar
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 -mr-2 text-[#121212]"
              aria-label="Menú"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-black/5">
          <nav className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left py-3 px-2 text-base font-medium text-[#121212] hover:text-[#FF6600] border-b border-black/5 last:border-0 transition-colors"
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated ? (
              <Link to="/mi-espacio" className="mt-3 inline-flex items-center justify-center px-5 py-3 border border-black/10 text-[#121212] text-sm font-semibold rounded-full">
                Mi espacio
              </Link>
            ) : (
              <Link to="/login" className="mt-3 inline-flex items-center justify-center px-5 py-3 border border-black/10 text-[#121212] text-sm font-semibold rounded-full">
                Iniciar sesión
              </Link>
            )}
            <a
              href={whatsappLink(site, site?.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center px-5 py-3 bg-[#FF6600] text-white text-sm font-semibold rounded-full"
            >
              Quiero empezar
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
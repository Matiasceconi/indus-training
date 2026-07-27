import { NavLink, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Home, Calendar, Dumbbell, User, MessageCircle, LogOut,
  ClipboardList, Award, Video, CreditCard,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/mi-espacio", label: "Inicio", icon: Home, end: true },
  { to: "/mi-espacio/calendario", label: "Mi calendario", icon: Calendar },
  { to: "/mi-espacio/clases", label: "Mis clases", icon: Dumbbell },
  { to: "/mi-espacio/perfil", label: "Mi perfil", icon: User },
  { to: "/mi-espacio/contacto", label: "Contacto", icon: MessageCircle },
];

const FUTURE_ITEMS = [
  { label: "Mi entrenamiento", icon: ClipboardList },
  { label: "Evaluaciones", icon: Award },
  { label: "Videos", icon: Video },
  { label: "Pagos", icon: CreditCard },
];

export default function StudentNav() {
  const handleLogout = () => base44.auth.logout("/");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-black/5 flex-col z-30">
        <div className="px-5 py-5">
          <Link to="/">
            <span className="font-display font-black text-lg tracking-tight">
              <span className="text-[#121212]">INDUS</span>
              <span className="text-[#FF6600]"> TRAINING</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#FF6600]/10 text-[#FF6600]"
                    : "text-[#121212]/60 hover:bg-[#F5F5F5] hover:text-[#121212]"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          <div className="pt-4 mt-4 border-t border-black/5">
            <p className="px-3 text-[10px] font-bold text-[#121212]/30 uppercase tracking-wider mb-2">Próximamente</p>
            {FUTURE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#121212]/30">
                <item.icon size={18} />
                {item.label}
              </div>
            ))}
          </div>
        </nav>
        <div className="p-3 border-t border-black/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#121212]/60 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 flex items-center justify-around px-1 py-1.5 z-30">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${
                isActive ? "text-[#FF6600]" : "text-[#121212]/50"
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[9px] font-medium leading-none">{item.label.replace("Mi ", "")}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
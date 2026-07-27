import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { StudentProfileProvider } from "@/contexts/StudentProfileContext";
import { Loader2, LogOut } from "lucide-react";
import StudentNav from "@/components/student/StudentNav";

export default function MiEspacio() {
  const { isAuthenticated, authChecked, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    loadProfile();
  }, [authChecked, isAuthenticated]);

  const loadProfile = async () => {
    try {
      const profiles = await base44.entities.ClientProfile.list();
      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
      } else if (user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/register";
      }
    } catch (e) {
      console.error("Error al cargar perfil:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6600]" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <StudentProfileProvider value={{ profile, reload: loadProfile }}>
      <div className="min-h-screen bg-[#F5F5F5]">
        <StudentNav />
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 bg-white border-b border-black/5 px-5 py-3 flex items-center justify-between z-20">
          <Link to="/">
            <span className="font-display font-black text-base tracking-tight">
              <span className="text-[#121212]">INDUS</span>
              <span className="text-[#FF6600]"> TRAINING</span>
            </span>
          </Link>
          <button
            onClick={() => base44.auth.logout("/")}
            className="p-2 rounded-lg text-[#121212]/60 hover:text-[#FF6600] hover:bg-[#FF6600]/5"
          >
            <LogOut size={18} />
          </button>
        </header>
        <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
          <Outlet />
        </main>
      </div>
    </StudentProfileProvider>
  );
}
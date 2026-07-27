import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import IndusAuthLayout from "@/components/auth/IndusAuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get("returnTo");
      await base44.auth.loginViaEmailPassword(email, password);
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        try {
          const user = await base44.auth.me();
          window.location.href = user?.role === "admin" ? "/admin" : "/mi-espacio";
        } catch {
          window.location.href = "/mi-espacio";
        }
      }
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IndusAuthLayout
      title="Iniciar sesión"
      subtitle="Ingresá a tu espacio INDUS TRAINING"
      footer={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link to="/register" className="text-[#FF6600] font-semibold hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#121212]">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#121212]">Contraseña</label>
            <Link to="/forgot-password" className="text-xs text-[#FF6600] font-medium hover:underline">
              Olvidé mi contraseña
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Ingresando...
            </>
          ) : (
            <>
              Ingresar <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </IndusAuthLayout>
  );
}
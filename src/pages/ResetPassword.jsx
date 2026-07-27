import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import IndusAuthLayout from "@/components/auth/IndusAuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <IndusAuthLayout
        title="Enlace inválido"
        subtitle="El enlace de recuperación no es válido o está incompleto"
        footer={
          <Link to="/forgot-password" className="text-[#FF6600] font-medium hover:underline">
            Solicitar un nuevo enlace
          </Link>
        }
      >
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            El enlace que usaste parece estar incompleto. Por favor, solicitá un nuevo correo de recuperación.
          </p>
        </div>
      </IndusAuthLayout>
    );
  }

  return (
    <IndusAuthLayout
      title="Nueva contraseña"
      subtitle="Ingresá tu nueva contraseña"
      footer={
        <Link to="/login" className="text-[#FF6600] font-medium hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Volver a iniciar sesión
        </Link>
      }
    >
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#121212]">Nueva contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#121212]">Confirmar contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <Loader2 className="w-4 h-4 animate-spin" /> Restableciendo...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </button>
      </form>
    </IndusAuthLayout>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, Loader2, ArrowRight, Check, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/AuthContext";
import IndusAuthLayout from "@/components/auth/IndusAuthLayout";
import StepPersonal from "@/components/auth/StepPersonal";
import StepService from "@/components/auth/StepService";
import StepConsents from "@/components/auth/StepConsents";
import { isMinorFromBirthDate } from "@/lib/age";

const STEPS = [
  { num: 1, label: "Cuenta" },
  { num: 2, label: "Datos personales" },
  { num: 3, label: "Servicio" },
  { num: 4, label: "Consentimientos" },
];

const EMPTY_DATA = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  birthPlace: "",
  nationality: "",
  phone: "",
  currentCity: "",
  profilePhoto: "",
  serviceInterest: "",
  mainGoal: "",
  priorExperience: "",
  observations: "",
  guardian1Name: "",
  guardian1Relation: "",
  guardian1Phone: "",
  guardian1Email: "",
  guardian2Name: "",
  guardian2Relation: "",
  guardian2Phone: "",
  guardian2Email: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
  confirmedInfoAccuracy: false,
  guardianAuthorization: false,
};

export default function Register() {
  const { isAuthenticated, authChecked } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY_DATA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      setStep(2);
      setAccountCreated(true);
    }
  }, [authChecked, isAuthenticated]);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (data.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email: data.email, password: data.password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: data.email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setAccountCreated(true);
      setShowOtp(false);
      setStep(2);
    } catch (err) {
      setError(err.message || "Código de verificación incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(data.email);
    } catch (err) {
      setError(err.message || "No se pudo reenviar el código");
    }
  };

  const handleCreateProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const minor = isMinorFromBirthDate(data.birthDate);
      await base44.entities.ClientProfile.create({
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        nationality: data.nationality,
        phone: data.phone,
        currentCity: data.currentCity,
        profilePhoto: data.profilePhoto,
        serviceInterest: data.serviceInterest,
        mainGoal: data.mainGoal,
        priorExperience: data.priorExperience,
        observations: data.observations,
        guardian1Name: minor ? data.guardian1Name : "",
        guardian1Relation: minor ? data.guardian1Relation : "",
        guardian1Phone: minor ? data.guardian1Phone : "",
        guardian1Email: minor ? data.guardian1Email : "",
        guardian2Name: minor ? data.guardian2Name : "",
        guardian2Relation: minor ? data.guardian2Relation : "",
        guardian2Phone: minor ? data.guardian2Phone : "",
        guardian2Email: minor ? data.guardian2Email : "",
        emergencyContactName: !minor ? data.emergencyContactName : "",
        emergencyContactRelation: !minor ? data.emergencyContactRelation : "",
        emergencyContactPhone: !minor ? data.emergencyContactPhone : "",
        acceptedTerms: data.acceptedTerms,
        acceptedPrivacy: data.acceptedPrivacy,
        confirmedInfoAccuracy: data.confirmedInfoAccuracy,
        guardianAuthorization: minor ? data.guardianAuthorization : false,
        status: "pendiente",
      });
      window.location.href = "/mi-espacio";
    } catch (err) {
      setError(err.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  const progressStep = showOtp ? 1 : step;
  const progressPct = (progressStep / 4) * 100;

  return (
    <IndusAuthLayout
      title="Crear cuenta"
      subtitle="Sumate a la comunidad INDUS TRAINING"
      maxWidth="max-w-lg"
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-[#FF6600] font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#121212]/50">
            Paso {progressStep} de 4
          </span>
          <span className="text-xs font-medium text-[#FF6600]">
            {STEPS[progressStep - 1].label}
          </span>
        </div>
        <div className="h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF6600] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Step 1: Account */}
      {step === 1 && !showOtp && (
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#121212]">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
              <input
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="tu@email.com"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#121212]">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={data.password}
                onChange={(e) => update("password", e.target.value)}
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
                placeholder="Repetí tu contraseña"
                value={data.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
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
                <Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      {/* OTP Verification */}
      {showOtp && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-[#121212]/60">
              Te enviamos un código de verificación a <strong className="text-[#121212]">{data.email}</strong>
            </p>
          </div>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              autoFocus
              autoComplete="one-time-code"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otpCode.length < 6}
            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-semibold rounded-xl hover:bg-[#e65c00] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              <>
                <Check size={18} /> Verificar código
              </>
            )}
          </button>
          <p className="text-center text-sm text-[#121212]/60">
            ¿No recibiste el código?{" "}
            <button onClick={handleResendOtp} className="text-[#FF6600] font-medium hover:underline">
              Reenviar
            </button>
          </p>
        </div>
      )}

      {/* Step 2: Personal */}
      {step === 2 && !showOtp && (
        <StepPersonal
          data={data}
          update={update}
          onNext={() => setStep(3)}
          onBack={() => (accountCreated ? null : setStep(1))}
          showBack={!accountCreated}
        />
      )}

      {/* Step 3: Service */}
      {step === 3 && !showOtp && (
        <StepService
          data={data}
          update={update}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* Step 4: Consents */}
      {step === 4 && !showOtp && (
        <StepConsents
          data={data}
          update={update}
          onSubmit={handleCreateProfile}
          onBack={() => setStep(3)}
          loading={loading}
        />
      )}
    </IndusAuthLayout>
  );
}
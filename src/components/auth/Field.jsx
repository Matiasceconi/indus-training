export function Field({ label, error, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#121212]">
        {label}
        {required && <span className="text-[#FF6600]"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#121212]/40">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function TextInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/30" />
      )}
      <input
        {...props}
        className={`w-full h-12 ${Icon ? "pl-10" : "pl-4"} pr-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all ${props.className || ""}`}
      />
    </div>
  );
}

export function TextAreaInput({ ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] placeholder:text-[#121212]/30 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all resize-none ${props.className || ""}`}
    />
  );
}

export function SelectInput({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full h-12 px-4 rounded-xl border border-black/10 bg-[#F5F5F5] text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 transition-all ${props.className || ""}`}
    >
      {children}
    </select>
  );
}
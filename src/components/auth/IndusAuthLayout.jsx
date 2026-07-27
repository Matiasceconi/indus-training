import { Link } from "react-router-dom";

export default function IndusAuthLayout({ title, subtitle, footer, children, maxWidth = "max-w-md" }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="px-5 py-5">
        <Link to="/" className="inline-block">
          <span className="font-display font-black text-xl tracking-tight">
            <span className="text-[#121212]">INDUS</span>
            <span className="text-[#FF6600]"> TRAINING</span>
          </span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-5 pb-10">
        <div className={`w-full ${maxWidth}`}>
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#121212] tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-[#121212]/60 mt-2">{subtitle}</p>}
          </div>
          {children}
          {footer && (
            <p className="text-center text-sm text-[#121212]/60 mt-6">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
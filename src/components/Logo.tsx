/**
 * GOODWIN SECURITY logo — shield mark with a circuit-trace "G".
 * To swap in a final logo file, replace <ShieldMark/> with an <img src="/logo.svg">.
 */
export function ShieldMark({ className = "", reversed = false }: { className?: string; reversed?: boolean }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <path d="M60 6 L108 22 V64 C108 98 86 120 60 134 C34 120 12 98 12 64 V22 Z" fill={reversed ? "#FFFFFF" : "#1E3A8A"} />
      {!reversed && (
        <path d="M60 14 L100 27.5 V64 C100 93 82 112 60 125 C38 112 20 93 20 64 V27.5 Z" fill="none" stroke="#3B82F6" strokeWidth="2" />
      )}
      <path d="M79.8 48.2 A28 28 0 1 0 88 68 L66 68" fill="none" stroke={reversed ? "#1E3A8A" : "#93C5FD"} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="79.8" cy="48.2" r="5.5" fill={reversed ? "#3B82F6" : "#FFFFFF"} />
      <circle cx="62" cy="68" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
    </svg>
  );
}

export function Logo({ className = "", onDark = true }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <ShieldMark className="h-10 w-auto shrink-0" reversed={false} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[19px] font-extrabold tracking-[0.12em] ${onDark ? "text-white" : "text-brand-dark"}`}>GOODWIN</span>
        <span className={`mt-1 font-display text-[9.5px] font-semibold tracking-[0.32em] ${onDark ? "text-brand-light" : "text-brand"}`}>SECURITY W.L.L.</span>
      </span>
    </span>
  );
}

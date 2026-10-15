/* Vector hero scene: wall-mounted camera scanning a building, with monitoring tiles. */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 480" className={className} role="img" aria-label="Illustration of a CCTV camera monitoring a commercial building">
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity=".45" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0B1633" />
        </linearGradient>
      </defs>
      {/* buildings */}
      <g opacity=".95">
        <rect x="250" y="170" width="150" height="290" rx="4" fill="url(#bld)" stroke="#3B82F6" strokeOpacity=".35" />
        <rect x="410" y="250" width="110" height="210" rx="4" fill="url(#bld)" stroke="#3B82F6" strokeOpacity=".25" />
        <rect x="160" y="300" width="80" height="160" rx="4" fill="url(#bld)" stroke="#3B82F6" strokeOpacity=".25" />
        {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 4 }).map((__, c) => (
          <rect key={`a${r}${c}`} x={268 + c * 32} y={190 + r * 32} width="18" height="16" rx="2" fill={(r + c) % 3 === 0 ? "#93C5FD" : "#12224A"} opacity={(r + c) % 3 === 0 ? 0.7 : 1} />
        )))}
        {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 3 }).map((__, c) => (
          <rect key={`b${r}${c}`} x={426 + c * 30} y={270 + r * 30} width="16" height="14" rx="2" fill={(r * c) % 4 === 1 ? "#93C5FD" : "#12224A"} opacity=".8" />
        )))}
        <path d="M120 460 H540" stroke="#3B82F6" strokeOpacity=".4" />
      </g>
      {/* camera on pole */}
      <g>
        <rect x="70" y="120" width="12" height="340" rx="3" fill="#12224A" stroke="#3B82F6" strokeOpacity=".4" />
        <g className="scan" style={{ transformOrigin: "86px 118px" }}>
          <path d="M120 112 L520 40 L520 260 Z" fill="url(#beam)" />
          <path d="M72 108 h26" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
          <rect x="84" y="88" width="64" height="34" rx="9" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="2.5" />
          <path d="M80 84 L152 80" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="140" cy="105" r="9" fill="#060E24" stroke="#93C5FD" strokeWidth="2" />
          <circle cx="140" cy="105" r="4" fill="#3B82F6" />
          <circle cx="96" cy="97" r="2.5" fill="#EF4444" />
        </g>
      </g>
      {/* monitoring tiles */}
      <g transform="translate(330 18)">
        <rect width="210" height="128" rx="12" fill="#0B1633" stroke="#3B82F6" strokeOpacity=".5" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${12 + (i % 2) * 96} ${14 + Math.floor(i / 2) * 54})`}>
            <rect width="90" height="46" rx="5" fill="#12224A" />
            <path d={`M6 ${38 - i * 3} L28 ${24 + i * 2} L46 ${32 - i} L66 ${18 + i * 3} L84 ${26}`} stroke="#93C5FD" strokeOpacity=".7" fill="none" strokeWidth="1.5" />
            <circle cx="10" cy="9" r="2.5" fill={i === 0 ? "#EF4444" : "#3B82F6"} />
          </g>
        ))}
      </g>
    </svg>
  );
}

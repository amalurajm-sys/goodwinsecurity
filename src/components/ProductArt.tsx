/* Clean vector illustrations used as image placeholders until real product photos are uploaded. */

const S = { stroke: "#93C5FD", fill: "none", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const body = "#1E3A8A";
const face = "#12224A";

function Turret() {
  return (<g>
    <rect x="70" y="128" width="60" height="14" rx="4" fill={body} />
    <circle cx="100" cy="92" r="40" fill={body} />
    <circle cx="100" cy="92" r="40" {...S} />
    <circle cx="100" cy="92" r="20" {...S} fill={face} />
    <circle cx="100" cy="92" r="9" fill="#3B82F6" />
    <circle cx="96" cy="88" r="3" fill="#fff" opacity=".8" />
  </g>);
}
function Bullet() {
  return (<g>
    <path d="M60 120 L80 100" {...S} strokeWidth={8} stroke={body} />
    <rect x="44" y="118" width="40" height="10" rx="3" fill={body} />
    <rect x="62" y="62" width="100" height="44" rx="12" fill={body} transform="rotate(-8 112 84)" />
    <rect x="62" y="62" width="100" height="44" rx="12" {...S} transform="rotate(-8 112 84)" />
    <path d="M58 58 L168 42" {...S} />
    <circle cx="150" cy="78" r="13" {...S} fill={face} />
    <circle cx="150" cy="78" r="6" fill="#3B82F6" />
  </g>);
}
function Dome() {
  return (<g>
    <rect x="46" y="70" width="108" height="12" rx="6" fill={body} />
    <path d="M56 82 a44 44 0 0 0 88 0z" {...S} fill={face} />
    <circle cx="100" cy="102" r="11" fill="#3B82F6" />
    <path d="M74 92 a30 30 0 0 0 14 22" stroke="#fff" opacity=".35" strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>);
}
function Recorder() {
  return (<g>
    <rect x="30" y="72" width="140" height="48" rx="6" {...S} fill={body} />
    <path d="M44 96 h40" {...S} />
    <circle cx="140" cy="96" r="4" fill="#3B82F6" /><circle cx="154" cy="96" r="4" fill="#93C5FD" />
    <path d="M44 128 h112" {...S} opacity=".5" />
    <rect x="96" y="88" width="30" height="16" rx="2" fill={face} />
  </g>);
}
function Drive() {
  return (<g>
    <rect x="58" y="42" width="84" height="116" rx="8" {...S} fill={body} />
    <circle cx="100" cy="90" r="28" {...S} fill={face} />
    <circle cx="100" cy="90" r="6" fill="#3B82F6" />
    <path d="M100 90 L124 130" {...S} />
    <circle cx="74" cy="144" r="3" fill="#93C5FD" />
  </g>);
}
function Terminal() {
  return (<g>
    <rect x="64" y="34" width="72" height="132" rx="10" {...S} fill={body} />
    <rect x="76" y="50" width="48" height="56" rx="4" fill={face} />
    <circle cx="100" cy="72" r="10" {...S} /><path d="M86 98 a14 10 0 0 1 28 0" {...S} />
    <rect x="80" y="118" width="40" height="34" rx="4" {...S} />
    <path d="M90 128 a10 10 0 0 1 20 0M94 134 a6 6 0 0 1 12 0" {...S} strokeWidth={2} />
  </g>);
}
function Intercom() {
  return (<g>
    <rect x="34" y="44" width="56" height="112" rx="8" {...S} fill={body} />
    <circle cx="62" cy="70" r="10" {...S} fill={face} />
    <circle cx="62" cy="70" r="4" fill="#3B82F6" />
    <rect x="50" y="118" width="24" height="24" rx="12" {...S} />
    <rect x="104" y="60" width="66" height="80" rx="8" {...S} fill={body} />
    <rect x="112" y="68" width="50" height="40" rx="3" fill={face} />
    <circle cx="137" cy="88" r="8" {...S} />
    <path d="M118 124 h38" {...S} />
  </g>);
}
function Alarm() {
  return (<g>
    <rect x="40" y="56" width="76" height="96" rx="8" {...S} fill={body} />
    <rect x="52" y="68" width="52" height="22" rx="3" fill={face} />
    <path d="M56 106h8M72 106h8M88 106h8M56 120h8M72 120h8M88 120h8M56 134h8M72 134h8M88 134h8" {...S} strokeWidth={4} />
    <path d="M132 120 V96 a16 16 0 0 1 32 0 V120 z" {...S} fill={body} />
    <path d="M128 120 h40" {...S} />
    <path d="M170 74 l8 -8M148 64 v-10M126 74 l-8 -8" {...S} />
  </g>);
}
function Switch() {
  return (<g>
    <rect x="22" y="78" width="156" height="44" rx="5" {...S} fill={body} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (<rect key={i} x={36 + i * 16} y={92} width={11} height={10} rx={1.5} fill={face} stroke="#93C5FD" strokeWidth={1.5} />))}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (<circle key={"l" + i} cx={41.5 + i * 16} cy={110} r={1.8} fill={i % 3 ? "#3B82F6" : "#93C5FD"} />))}
    <rect x="166" y="92" width="6" height="16" rx="1" fill="#93C5FD" />
  </g>);
}
function Accessory() {
  return (<g>
    <circle cx="100" cy="100" r="54" {...S} fill={body} />
    <circle cx="100" cy="100" r="34" {...S} fill={face} />
    {[0, 90, 180, 270].map((a) => (<circle key={a} cx={100 + 44 * Math.cos((a * Math.PI) / 180)} cy={100 + 44 * Math.sin((a * Math.PI) / 180)} r={4} fill="#93C5FD" />))}
  </g>);
}
function Cable() {
  return (<g>
    <path d="M40 150 C 40 90, 100 120, 100 90 S 160 60, 160 50" stroke={body} strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M40 150 C 40 90, 100 120, 100 90 S 160 60, 160 50" {...S} strokeWidth={2} />
    <rect x="28" y="148" width="24" height="22" rx="3" {...S} fill={face} />
    <rect x="148" y="28" width="24" height="22" rx="3" {...S} fill={face} />
    <path d="M34 164v4M40 164v4M46 164v4M154 34v-4M160 34v-4M166 34v-4" stroke="#3B82F6" strokeWidth={2} />
  </g>);
}
function Power() {
  return (<g>
    <rect x="50" y="56" width="100" height="88" rx="8" {...S} fill={body} />
    <path d="M104 72 L88 102 h16 l-8 26 24-36 h-16 l8-20z" fill="#3B82F6" />
    <path d="M150 100 h22" {...S} /><path d="M28 100 h22" {...S} />
  </g>);
}

const MAP: Record<string, () => React.ReactElement> = {
  turret: Turret, bullet: Bullet, dome: Dome, recorder: Recorder, drive: Drive, terminal: Terminal,
  intercom: Intercom, alarm: Alarm, switch: Switch, accessory: Accessory, cable: Cable, power: Power,
};

export const ART_KINDS = Object.keys(MAP);

export function ProductArt({ kind, className = "", label }: { kind: string; className?: string; label?: string }) {
  const C = MAP[kind] ?? Turret;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={label ?? "Product illustration"}>
      <defs>
        <radialGradient id={`g-${kind}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1B2E66" />
          <stop offset="100%" stopColor="#0B1633" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#g-${kind})`} />
      <C />
    </svg>
  );
}

/** Renders an uploaded image path, or the matching illustration for "icon:<kind>" placeholders. */
export function ProductImage({ path, alt, className = "" }: { path: string; alt: string; className?: string }) {
  if (path && !path.startsWith("icon:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={path} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  const kind = path.replace("icon:", "");
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/art/${ART_KINDS.includes(kind) ? kind : "turret"}.svg`} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
}

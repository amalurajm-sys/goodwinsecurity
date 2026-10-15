const P: Record<string, React.ReactNode> = {
  camera: <><path d="M3 7h12l3-2v10l-3-2H3z" /><circle cx="9" cy="10" r="2" /><path d="M6 13v5h6" /></>,
  ip: <><rect x="3" y="5" width="18" height="10" rx="2" /><path d="M8 19h8M12 15v4" /><circle cx="12" cy="10" r="2.5" /></>,
  recorder: <><rect x="2" y="7" width="20" height="9" rx="1.5" /><path d="M6 11.5h6M16 11.5h.01M19 11.5h.01M5 19h14" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l2 2" /></>,
  intercom: <><rect x="6" y="2" width="12" height="20" rx="2" /><circle cx="12" cy="8" r="2.5" /><path d="M9 14h6M9 17h6" /></>,
  alarm: <><path d="M6 17V11a6 6 0 0 1 12 0v6" /><path d="M4 17h16M10 21h4M12 3V2M4.5 6.5 3.5 5.5M19.5 6.5l1-1" /></>,
  network: <><rect x="9" y="2" width="6" height="5" rx="1" /><rect x="2" y="17" width="6" height="5" rx="1" /><rect x="16" y="17" width="6" height="5" rx="1" /><path d="M12 7v5M5 17v-3h14v3" /></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></>,
  upgrade: <><path d="M12 19V5M5 12l7-7 7 7" /><path d="M5 21h14" /></>,
  shield: <><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" /><path d="M9 12l2 2 4-4" /></>,
  tools: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2" y="14" width="5" height="6" rx="1.5" /><rect x="17" y="14" width="5" height="6" rx="1.5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" /></>,
  store: <><path d="M3 9l2-5h14l2 5" /><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" /><path d="M5 13v8h14v-8" /></>,
  warehouse: <><path d="M2 9l10-5 10 5v12H2z" /><path d="M6 21v-8h12v8M6 16h12" /></>,
  hotel: <><path d="M3 21V7l9-4 9 4v14" /><path d="M7 21v-4h10v4M8 10h1M15 10h1M8 13h1M15 13h1" /></>,
  wallet: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 13h2M2 10h20" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /></>,
  pencil: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M14 6l4 4" /></>,
  check: <><path d="M5 12l5 5L20 7" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  phone: <><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  pin: <><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6L6 18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  whatsapp: <><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-1-1 .8a4 4 0 0 1-2-2l.8-1-1-1.8z" /></>,
  drive: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="12" cy="12" r="4" /><path d="M7 17h.01" /></>,
  cable: <><path d="M4 20c0-6 4-6 8-8s8-2 8-8" /><rect x="2" y="18" width="4" height="4" rx="1" /><rect x="18" y="2" width="4" height="4" rx="1" /></>,
};

export function Icon({ name, className = "h-6 w-6", label }: { name: string; className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      className={className} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      {P[name] ?? P.shield}
    </svg>
  );
}

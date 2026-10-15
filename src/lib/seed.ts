import type Database from "better-sqlite3";

/**
 * Initial content. Runs once on an empty database.
 * Everything marked is_sample = 1 is placeholder data and must be replaced
 * or confirmed by GOODWIN SECURITY before relying on it.
 */

export const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: "GOODWIN SECURITY W.L.L.",
  country: "Kingdom of Bahrain",
  short_description:
    "Security system products, professional installation and technical support for homes and businesses across Bahrain.",
  phone: "", // e.g. +973 XXXX XXXX — add once verified
  whatsapp: "", // digits only with country code, e.g. 973XXXXXXXX
  email: "", // public contact email, once verified
  address: "", // street address, once verified
  map_embed_url: "", // Google Maps embed URL (https://www.google.com/maps/embed?pb=...)
  opening_hours: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  x_twitter: "",
  notify_email: "", // where new enquiries are emailed; falls back to ENQUIRY_NOTIFY_EMAIL
  free_consultation: "0", // set to "1" only if free consultations are company policy
  hero_heading: "Smart Security Solutions for a Safer Tomorrow",
  hero_text:
    "GOODWIN SECURITY W.L.L. delivers reliable security systems, professional installation, and technical support for residential, commercial, and industrial environments across Bahrain.",
  hero_image: "",
  about_overview:
    "GOODWIN SECURITY W.L.L. provides security system products and related technical services in Bahrain. We help residential, commercial, and industrial customers identify suitable security technologies for surveillance, access management, and property protection.",
  about_approach:
    "Every property is different. We start by understanding how a site is used, what needs protecting and what the budget allows, then recommend equipment and a configuration that fits — rather than a one-size-fits-all package.",
  about_commitment:
    "We aim to be a dependable technical partner: clear advice before the sale, careful installation, and responsive support afterwards when a system needs attention.",
};

const CATEGORIES: [string, string, string][] = [
  ["cctv-cameras", "CCTV Cameras", "Surveillance cameras for indoor and outdoor coverage."],
  ["ip-cameras", "IP Cameras", "Network cameras that stream high-resolution video over your IP network."],
  ["analog-hd-cameras", "Analog HD Cameras", "HD-over-coax cameras that reuse existing coaxial cabling."],
  ["nvr", "Network Video Recorders (NVR)", "Recorders for IP camera systems, with local storage and remote viewing."],
  ["dvr", "Digital Video Recorders (DVR)", "Recorders for analog HD camera systems."],
  ["storage", "Hard Drives and Storage", "Surveillance-rated drives and storage for continuous recording."],
  ["access-control", "Access Control Devices", "Card, PIN, fingerprint and face terminals, locks and controllers."],
  ["video-intercoms", "Video Intercoms", "Door stations and indoor monitors for villas, apartments and offices."],
  ["alarm-systems", "Alarm Systems", "Intruder alarm panels, detectors and sirens."],
  ["network-equipment", "PoE Switches and Network Equipment", "PoE switches, routers and network gear for security systems."],
  ["cctv-accessories", "CCTV Accessories", "Brackets, junction boxes, housings and mounting accessories."],
  ["cables-power", "Cables, Connectors, and Power Supplies", "Network and coax cable, connectors and power supplies."],
];

const BRANDS: [string, string, string, string, number][] = [
  ["hikvision", "Hikvision", "Video surveillance, access control and intercom products.", "https://www.hikvision.com", 1],
  ["dahua", "Dahua Technology", "Video surveillance and related security technology.", "https://www.dahuasecurity.com", 1],
  ["other", "Other compatible brands", "Compatible security, storage and networking products selected per project.", "", 0],
];

type SampleProduct = {
  slug: string; name: string; cat: string; brand: string; summary: string; icon: string;
};

const SAMPLE_PRODUCTS: SampleProduct[] = [
  { slug: "sample-ip-turret-camera", name: "IP Turret Camera (Sample)", cat: "ip-cameras", brand: "hikvision", summary: "Fixed-lens IP turret camera for indoor and outdoor use.", icon: "turret" },
  { slug: "sample-ip-bullet-camera", name: "IP Bullet Camera (Sample)", cat: "ip-cameras", brand: "dahua", summary: "Outdoor IP bullet camera for perimeters and car parks.", icon: "bullet" },
  { slug: "sample-dome-camera", name: "Indoor Dome Camera (Sample)", cat: "cctv-cameras", brand: "hikvision", summary: "Compact dome camera for offices, shops and corridors.", icon: "dome" },
  { slug: "sample-analog-hd-bullet", name: "Analog HD Bullet Camera (Sample)", cat: "analog-hd-cameras", brand: "dahua", summary: "HD-over-coax camera for upgrading existing analog systems.", icon: "bullet" },
  { slug: "sample-8ch-nvr", name: "8-Channel NVR (Sample)", cat: "nvr", brand: "hikvision", summary: "Network video recorder for small and medium IP systems.", icon: "recorder" },
  { slug: "sample-16ch-nvr", name: "16-Channel NVR (Sample)", cat: "nvr", brand: "dahua", summary: "Network video recorder for larger multi-camera sites.", icon: "recorder" },
  { slug: "sample-8ch-dvr", name: "8-Channel DVR (Sample)", cat: "dvr", brand: "hikvision", summary: "Recorder for analog HD camera systems.", icon: "recorder" },
  { slug: "sample-surveillance-hdd", name: "Surveillance Hard Drive (Sample)", cat: "storage", brand: "other", summary: "Drive designed for continuous video recording.", icon: "drive" },
  { slug: "sample-face-terminal", name: "Face Recognition Terminal (Sample)", cat: "access-control", brand: "hikvision", summary: "Door access terminal with face, card and PIN options.", icon: "terminal" },
  { slug: "sample-card-reader", name: "Card Reader & Controller Kit (Sample)", cat: "access-control", brand: "dahua", summary: "Card-based door access for offices and restricted rooms.", icon: "terminal" },
  { slug: "sample-video-intercom-kit", name: "Video Intercom Kit (Sample)", cat: "video-intercoms", brand: "hikvision", summary: "Door station and indoor monitor for villas and offices.", icon: "intercom" },
  { slug: "sample-alarm-panel", name: "Intruder Alarm Panel Kit (Sample)", cat: "alarm-systems", brand: "other", summary: "Alarm panel with detectors and siren for homes and shops.", icon: "alarm" },
  { slug: "sample-8-port-poe-switch", name: "8-Port PoE Switch (Sample)", cat: "network-equipment", brand: "other", summary: "Powers and connects IP cameras over a single cable.", icon: "switch" },
  { slug: "sample-junction-box", name: "Camera Junction Box (Sample)", cat: "cctv-accessories", brand: "other", summary: "Weatherproof mounting box for neat outdoor installations.", icon: "accessory" },
  { slug: "sample-cat6-cable", name: "CAT6 Network Cable (Sample)", cat: "cables-power", brand: "other", summary: "Network cable for IP camera and PoE installations.", icon: "cable" },
  { slug: "sample-power-supply", name: "CCTV Power Supply (Sample)", cat: "cables-power", brand: "other", summary: "Regulated power supply for analog camera systems.", icon: "power" },
];

const SERVICES = [
  {
    slug: "cctv-installation", title: "CCTV Installation", icon: "camera",
    summary: "Site assessment, camera positioning, installation and configuration of complete CCTV systems.",
    description: "We assess the site, plan camera positions for the coverage you need, install and cable the system neatly, and configure recording and — where the equipment supports it — remote viewing on your phone or PC.",
    benefits: ["Coverage planned around how your site is actually used", "Neat cabling and secure mounting", "Recording schedules and retention set up for you", "Remote viewing configured where supported", "Handover and basic user guidance"],
  },
  {
    slug: "cctv-maintenance", title: "CCTV Maintenance and Troubleshooting", icon: "wrench",
    summary: "Inspection, fault diagnosis and maintenance to keep existing systems recording reliably.",
    description: "Cameras offline, recordings missing or storage full? We inspect the system, diagnose faults, check camera connectivity, recording and storage, and carry out the maintenance needed to get it working reliably again.",
    benefits: ["Fault diagnosis for cameras, recorders and cabling", "Recording and storage health checks", "Connectivity and remote-viewing fixes", "Planned maintenance visits by arrangement"],
  },
  {
    slug: "access-control", title: "Access Control", icon: "key",
    summary: "Electronic access control for doors, offices and restricted areas.",
    description: "Control who enters which areas and when. We supply and install card, PIN, fingerprint and face-recognition access solutions for doors, offices, server rooms and other restricted areas, matched to your building and workflow.",
    benefits: ["Replace keys with cards, PINs or biometrics", "Restrict sensitive areas by user and time", "Entry records for review", "Options for single doors up to multi-door sites"],
  },
  {
    slug: "video-intercom", title: "Video Intercom Systems", icon: "intercom",
    summary: "Door communication and video intercoms for homes and commercial buildings.",
    description: "See and speak to visitors before opening the door. We install video door phones and intercom systems for villas, apartments and commercial premises, including door release integration where suitable.",
    benefits: ["See and talk to visitors before opening", "Door release integration where suitable", "Options for villas, buildings and offices"],
  },
  {
    slug: "networking-infrastructure", title: "Networking and Infrastructure", icon: "network",
    summary: "Structured cabling, PoE networking and connectivity for security systems.",
    description: "A security system is only as reliable as the network behind it. We provide structured cabling, PoE switching and the network infrastructure your cameras, recorders and access devices depend on.",
    benefits: ["Structured cabling for new and existing sites", "PoE switching sized to your devices", "Tidy, labelled installations that are easier to maintain"],
  },
  {
    slug: "system-upgrades", title: "Security System Upgrades", icon: "upgrade",
    summary: "Replace outdated equipment, expand existing systems and migrate to newer technology.",
    description: "Upgrade grainy analog cameras, add coverage to an existing system, or migrate to IP technology. We review what you have, reuse what makes sense, and recommend compatible replacements.",
    benefits: ["Reuse existing cabling where practical", "Higher-resolution cameras and modern recorders", "Expand coverage without starting again"],
  },
];

const SAMPLE_PROJECTS = [
  { slug: "sample-retail-showroom-cctv", title: "Retail Showroom CCTV (Sample)", category: "Retail", systems: "IP cameras, NVR, remote viewing", description: "Placeholder entry showing how a completed project will appear. Replace with a real, approved project." },
  { slug: "sample-office-access-control", title: "Office Access Control (Sample)", category: "Commercial", systems: "Access control terminals, door locks", description: "Placeholder entry showing how a completed project will appear. Replace with a real, approved project." },
  { slug: "sample-warehouse-surveillance", title: "Warehouse Surveillance (Sample)", category: "Industrial", systems: "Outdoor bullet cameras, PoE network, NVR", description: "Placeholder entry showing how a completed project will appear. Replace with a real, approved project." },
];

export function seed(db: Database.Database) {
  const done = db.prepare("SELECT value FROM settings WHERE key = '__seeded'").get();
  // Always back-fill any newly added setting keys without overwriting edits.
  const insSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) insSetting.run(k, v);
  if (done) return;

  const tx = db.transaction(() => {
    const insCat = db.prepare("INSERT INTO categories (slug, name, description, sort) VALUES (?, ?, ?, ?)");
    CATEGORIES.forEach(([slug, name, d], i) => insCat.run(slug, name, d, i));

    const insBrand = db.prepare("INSERT INTO brands (slug, name, description, website, featured, sort) VALUES (?, ?, ?, ?, ?, ?)");
    BRANDS.forEach(([slug, name, d, w, f], i) => insBrand.run(slug, name, d, w, f, i));

    const catId = (s: string) => (db.prepare("SELECT id FROM categories WHERE slug = ?").get(s) as { id: number }).id;
    const brandId = (s: string) => (db.prepare("SELECT id FROM brands WHERE slug = ?").get(s) as { id: number }).id;
    const insProd = db.prepare(`INSERT INTO products
      (slug, name, model, sku, category_id, brand_id, summary, description, specs, compatibility, accessories, image_path, featured, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);
    SAMPLE_PRODUCTS.forEach((p, i) => {
      const n = String(i + 1).padStart(3, "0");
      insProd.run(
        p.slug, p.name, `SAMPLE-${n}`, `GW-SMP-${n}`, catId(p.cat), brandId(p.brand), p.summary,
        "Sample listing for layout purposes. Replace with the verified manufacturer, model number, description and specifications before publishing.",
        JSON.stringify([
          { label: "Model", value: "To be confirmed" },
          { label: "Key specification", value: "To be confirmed from manufacturer datasheet" },
          { label: "Availability", value: "Ask us — subject to supplier" },
        ]),
        "Compatibility depends on the exact model and firmware. Contact us to confirm compatibility with your existing system.",
        "Mounting brackets, cabling and power accessories available on request.",
        `icon:${p.icon}`, i < 6 ? 1 : 0,
      );
    });

    const insSvc = db.prepare("INSERT INTO services (slug, title, summary, description, benefits, icon, sort) VALUES (?, ?, ?, ?, ?, ?, ?)");
    SERVICES.forEach((s, i) => insSvc.run(s.slug, s.title, s.summary, s.description, JSON.stringify(s.benefits), s.icon, i));

    const insProj = db.prepare("INSERT INTO projects (slug, title, category, location, description, systems, published, is_sample) VALUES (?, ?, ?, '', ?, ?, 1, 1)");
    SAMPLE_PROJECTS.forEach((p) => insProj.run(p.slug, p.title, p.category, p.description, p.systems));

    db.prepare("INSERT INTO settings (key, value) VALUES ('__seeded', ?)").run(new Date().toISOString());
  });
  tx();
}

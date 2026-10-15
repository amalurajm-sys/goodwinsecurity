export const SITE_URL = (process.env.SITE_URL || "https://goodwinsecuritybh.com").replace(/\/$/, "");

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/brands", label: "Brands" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact Us" },
];

export const ENQUIRY_TYPES = [
  { value: "general", label: "General enquiry" },
  { value: "product-price", label: "Product price / quotation" },
  { value: "installation", label: "CCTV / security installation" },
  { value: "maintenance", label: "Maintenance or troubleshooting" },
  { value: "complete-system", label: "Complete security system for a property" },
] as const;

export const PROPERTY_TYPES = [
  "Villa / residence", "Apartment / building", "Retail shop / showroom", "Office / commercial building",
  "Warehouse / industrial", "Hotel / hospitality", "Other",
];

export const CONTACT_METHODS = ["Phone call", "WhatsApp", "Email"];

/** Turns a Bahrain number into a tel: href. Returns "" if empty. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  return "tel:" + (digits.startsWith("+") ? digits : digits.length === 8 ? "+973" + digits : "+" + digits);
}
/** Formats as +973 XXXX XXXX when it is a Bahraini number. */
export function formatBhPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  const local = d.startsWith("973") && d.length === 11 ? d.slice(3) : d.length === 8 ? d : "";
  return local ? `+973 ${local.slice(0, 4)} ${local.slice(4)}` : phone;
}
export function waHref(num: string, text?: string): string {
  const d = num.replace(/\D/g, "");
  if (!d) return "";
  const full = d.length === 8 ? "973" + d : d;
  return `https://wa.me/${full}${text ? "?text=" + encodeURIComponent(text) : ""}`;
}

"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { CONTACT_METHODS, ENQUIRY_TYPES, PROPERTY_TYPES } from "@/lib/site";

type Props = {
  defaultType?: string;
  product?: { id: number; label: string } | null;
  defaultItem?: string;
  defaultService?: string;
  services: string[];
  showQuantity?: boolean;
};

type Errors = Record<string, string>;

export function EnquiryForm({ defaultType = "general", product = null, defaultItem = "", defaultService = "", services, showQuantity = true }: Props) {
  const [type, setType] = useState(defaultType);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState("");
  const started = useRef(0);
  const doneRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  useEffect(() => { started.current = Date.now(); }, []);
  useEffect(() => { if (status === "done") doneRef.current?.focus(); if (status === "error") errRef.current?.focus(); }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(fd.entries());
    data.consent = fd.get("consent") === "on";
    data.started = started.current;
    if (product) data.product_id = product.id;
    setStatus("sending"); setErrors({}); setMessage("");
    try {
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) { setRef(json.ref); setStatus("done"); return; }
      setErrors(json.fields ?? {});
      setMessage(json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setMessage("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center outline-none">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white"><Icon name="check" className="h-7 w-7" /></span>
        <h2 className="mt-5 text-2xl font-bold">Thank you — we've received your enquiry</h2>
        <p className="mt-3 text-slate-700">Your reference number is</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-brand-dark">{ref}</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">Please keep this reference. Our team will review your request and contact you using your preferred contact method.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-outline">Continue browsing</Link>
          <Link href="/" className="btn-primary">Back to home</Link>
        </div>
      </div>
    );
  }

  const err = (k: string) => errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-sm text-red-700">{errors[k]}</p> : null;
  const aria = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});
  const showProperty = type === "installation" || type === "complete-system" || type === "maintenance";
  const showItem = type === "product-price" && !product;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "error" && message && (
        <div ref={errRef} tabIndex={-1} role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 outline-none">{message}</div>
      )}

      {product && (
        <div className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3">
          <Icon name="ip" className="h-6 w-6 shrink-0 text-brand" />
          <div className="text-sm"><span className="block text-slate-500">Selected product</span><strong className="text-navy-900">{product.label}</strong></div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="type" className="label">Enquiry type <span className="text-red-600">*</span></label>
          <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} className="input" required>
            {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="label">Name <span className="text-red-600">*</span></label>
          <input id="name" name="name" autoComplete="name" required maxLength={120} className="input" {...aria("name")} />{err("name")}
        </div>
        <div>
          <label htmlFor="company" className="label">Company name <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="company" name="company" autoComplete="organization" maxLength={160} className="input" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email <span className="text-red-600">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} className="input" {...aria("email")} />{err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone number <span className="text-red-600">*</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="+973" className="input" {...aria("phone")} />{err("phone")}
        </div>

        {showItem && (
          <div className="sm:col-span-2">
            <label htmlFor="item" className="label">Product required</label>
            <input id="item" name="item" defaultValue={defaultItem} maxLength={200} placeholder="Product name, model or description" className="input" />
          </div>
        )}
        {!product && !showItem && (
          <div className="sm:col-span-2">
            <label htmlFor="service" className="label">Product or service required</label>
            <select id="service" name="service" defaultValue={defaultService} className="input">
              <option value="">Select (optional)</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
              {defaultService && !services.includes(defaultService) && <option value={defaultService}>{defaultService}</option>}
              <option value="Other / not sure">Other / not sure</option>
            </select>
          </div>
        )}
        {showProperty && (
          <div>
            <label htmlFor="property_type" className="label">Property type</label>
            <select id="property_type" name="property_type" className="input" defaultValue="">
              <option value="">Select (optional)</option>
              {PROPERTY_TYPES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        )}
        {showQuantity && (type === "product-price" || product) && (
          <div>
            <label htmlFor="quantity" className="label">Quantity</label>
            <input id="quantity" name="quantity" type="number" min={1} max={100000} inputMode="numeric" className="input" {...aria("quantity")} />{err("quantity")}
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="message" className="label">Message <span className="text-red-600">*</span></label>
          <textarea id="message" name="message" rows={5} required maxLength={4000} className="input"
            placeholder="Tell us about your site, the number of cameras or doors, and anything else that helps us understand your requirements." {...aria("message")} />{err("message")}
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="label">Preferred contact method <span className="text-red-600">*</span></legend>
          <div className="flex flex-wrap gap-3">
            {CONTACT_METHODS.map((m, i) => (
              <label key={m} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                <input type="radio" name="preferred_contact" value={m} defaultChecked={i === 0} className="accent-brand" /> {m}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Honeypot — hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-brand" {...aria("consent")} />
          <span>I agree that GOODWIN SECURITY W.L.L. may use these details to respond to my enquiry, as described in the <Link href="/privacy" className="font-semibold text-brand underline">Privacy Policy</Link>.</span>
        </label>
        {err("consent")}
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "Sending…" : "Submit enquiry"}
      </button>
    </form>
  );
}

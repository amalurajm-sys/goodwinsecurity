import { z } from "zod";

const clean = (max: number) => z.string().trim().max(max).transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""));

export const enquirySchema = z.object({
  type: z.enum(["general", "product-price", "installation", "maintenance", "complete-system"]),
  name: clean(120).pipe(z.string().min(2, "Please enter your name")),
  company: clean(160).optional().default(""),
  email: z.string().trim().max(200).email("Please enter a valid email address"),
  phone: z.string().trim().max(30).regex(/^[+()\d\s-]{7,30}$/, "Please enter a valid phone number"),
  preferred_contact: z.enum(["Phone call", "WhatsApp", "Email"]),
  property_type: clean(80).optional().default(""),
  product_id: z.coerce.number().int().positive().optional().nullable(),
  item: clean(200).optional().default(""),
  service: clean(160).optional().default(""),
  quantity: z.union([z.literal(""), z.coerce.number().int().min(1).max(100000)]).optional().nullable(),
  message: clean(4000).pipe(z.string().min(5, "Please tell us a little about your requirements")),
  consent: z.literal(true, { message: "Please agree so we can contact you about your enquiry" }),
  // anti-spam
  website: z.string().max(0).optional().default(""),
  started: z.coerce.number().int(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

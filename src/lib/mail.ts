import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

let transporter: Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!mailConfigured() || !opts.to) return false;
  try {
    await getTransporter().sendMail({ from: process.env.SMTP_FROM, ...opts });
    return true;
  } catch (e) {
    console.error("[mail] send failed:", (e as Error).message);
    return false;
  }
}

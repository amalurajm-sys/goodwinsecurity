import { waHref } from "@/lib/site";
import { Icon } from "./Icon";

export function WhatsAppFab({ number }: { number: string }) {
  return (
    <a href={waHref(number, "Hello GOODWIN SECURITY, I have an enquiry.")} target="_blank" rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1FAF54] text-white shadow-lg transition hover:scale-105">
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}

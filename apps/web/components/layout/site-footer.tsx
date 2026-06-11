import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { shopName, shopPhone, whatsappNumber } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-bold">{shopName}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            A modern local business platform for product discovery, customer inquiries, inventory visibility, and shop
            operations.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quick Links</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <Link href="/products">Products</Link>
            <Link href="/dashboard">Customer Dashboard</Link>
            <Link href="/admin">Admin Dashboard</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <a className="inline-flex items-center gap-2" href={`tel:${shopPhone}`}>
              <Phone className="h-4 w-4" aria-hidden />
              {shopPhone}
            </a>
            <a className="inline-flex items-center gap-2" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              <MapPin className="h-4 w-4" aria-hidden />
              WhatsApp inquiry
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        Built for future mobile app and retail operations integration.
      </div>
    </footer>
  );
}

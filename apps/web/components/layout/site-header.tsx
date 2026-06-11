import Link from "next/link";
import { Menu, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopName, shopPhone, whatsappNumber } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/dashboard", label: "Customer Dashboard" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight text-slate-950 sm:text-base">{shopName}</span>
            <span className="block text-xs font-medium text-slate-500">Hardware, Electrical, Cement & Agriculture</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${shopPhone}`}>
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
          </Button>
          <Button asChild variant="accent" size="sm">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>

        <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </header>
  );
}

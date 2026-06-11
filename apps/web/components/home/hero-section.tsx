"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopName, shopPhone, whatsappNumber } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-primary text-white">
      <img
        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=80"
        alt="Hardware tools and shop supplies"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />

      <div className="container-page relative flex min-h-[680px] items-center py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-slate-100 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            Local retail platform for product inquiry and shop operations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl"
          >
            {shopName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
          >
            Browse hardware, electrical, cement, and agriculture products, check stock status, and send inquiries before
            visiting the shop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild variant="accent" size="lg">
              <a href={`tel:${shopPhone}`}>
                <Phone className="h-5 w-5" aria-hidden />
                Call Now
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button asChild size="lg">
              <Link href="/products">
                View Products
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
          </motion.div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["4", "Core categories"],
              ["24h", "Inquiry follow-up"],
              ["AI", "Smart support"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

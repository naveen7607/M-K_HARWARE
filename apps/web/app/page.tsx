import Link from "next/link";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories, products, reviews } from "@/lib/sample-data";
import { mapEmbedUrl, shopPhone, whatsappNumber } from "@/lib/constants";

export default function HomePage() {
  const featured = products.filter((product) => product.isFeatured);

  return (
    <main>
      <HeroSection />

      <section className="band bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured Products"
            title="Fast-moving shop items customers ask for every week"
            description="Showcase high-demand products with live stock indicators, pricing, and quick inquiry actions."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="band bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Shop Categories"
            title="Hardware, electrical, cement, and agriculture under one roof"
            description="Each category can be searched, filtered, stocked, and managed by staff from the admin dashboard."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <Card className="group h-full overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={`${category.name} products`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About Shop"
              title="Built like a local IndiaMART plus retail desk"
              description="The platform is designed to help customers ask faster and help the shop owner track inventory, inquiries, customers, and sales signals from one place."
            />
            <div className="grid gap-3">
              {[
                "Customer database with profile and inquiry history.",
                "Low stock warnings for products below threshold.",
                "Admin analytics for customers, products, inquiries, and revenue.",
                "API-first architecture ready for a future mobile app."
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80"
              alt="Shop inventory and tools"
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="band bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Trust signals for local buyers"
            description="Approved reviews can be shown publicly while staff moderate new submissions from the dashboard."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.name} className="p-5">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">{review.comment}</p>
                <p className="mt-4 font-semibold text-slate-950">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="band bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Call, WhatsApp, or visit the shop"
              description="Customers can quickly confirm product availability, quantity, and current pricing before visiting."
            />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`tel:${shopPhone}`}>Call {shopPhone}</a>
              </Button>
              <Button asChild variant="accent" size="lg">
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                  WhatsApp Inquiry
                </a>
              </Button>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <MapPin className="mt-1 h-5 w-5 text-secondary" aria-hidden />
              <p className="text-sm leading-6 text-slate-700">
                Replace the map environment variable with the exact shop address embed URL before launch.
              </p>
            </div>
          </div>
          <div className="min-h-[420px] overflow-hidden rounded-lg border border-slate-200">
            <iframe
              src={mapEmbedUrl}
              title="Shop location map"
              loading="lazy"
              className="h-full min-h-[420px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

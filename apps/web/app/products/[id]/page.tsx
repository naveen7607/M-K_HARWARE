import Link from "next/link";
import { AlertTriangle, ArrowLeft, PackageCheck, Star } from "lucide-react";
import { InquiryForm } from "@/components/products/inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product._id
  }));
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item._id === id) ?? products[0];

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container-page">
          <Button asChild variant="ghost" size="sm">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Products
            </Link>
          </Button>
        </div>
      </section>

      <section className="band">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_420px]">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_0.9fr]">
              <div className="aspect-[4/3] bg-white lg:aspect-auto">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <Badge>{product.category}</Badge>
                <h1 className="mt-4 text-3xl font-bold tracking-normal text-slate-950">{product.name}</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {product.brand} · SKU {product.sku}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <p className="text-3xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    <Star className="h-4 w-4 fill-amber-500" aria-hidden />
                    {product.ratingAverage ?? 4.5}
                  </span>
                </div>

                <p className="mt-5 leading-7 text-slate-600">{product.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <PackageCheck className="h-5 w-5 text-emerald-600" aria-hidden />
                    <p className="mt-2 text-sm font-semibold text-slate-950">Stock Quantity</p>
                    <p className="mt-1 text-2xl font-bold">{product.stockQuantity}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
                    <p className="mt-2 text-sm font-semibold text-slate-950">Inventory Alert</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {product.stockQuantity < 10 ? "Low Stock Warning" : "Stock available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <InquiryForm product={product} />
        </div>
      </section>
    </main>
  );
}

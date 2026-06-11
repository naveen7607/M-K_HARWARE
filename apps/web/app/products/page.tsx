import { Suspense } from "react";
import { ProductsCatalog } from "@/components/products/products-catalog";

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<{
    category?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">Product Catalog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Search products and send inquiries</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Browse by category, check stock indicators, sort by price or availability, and request a callback for current
            prices.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="container-page">
          <Suspense fallback={null}>
            <ProductsCatalog initialCategory={resolvedSearchParams?.category} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

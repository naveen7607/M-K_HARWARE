"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { categories, products as fallbackProducts, type CategoryName, type Product } from "@/lib/sample-data";

const pageSize = 6;

export function ProductsCatalog({ initialCategory }: { initialCategory?: string }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiFetch<{ items: Product[] }>("/products?limit=100")
      .then((response) => {
        if (mounted && response.data.items.length) {
          setProducts(response.data.items);
        }
      })
      .catch(() => {
        if (mounted) setProducts(fallbackProducts);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.brand, product.sku, product.description, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesCategory = category === "All" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock-asc") return a.stockQuantity - b.stockQuantity;
      if (sort === "stock-desc") return b.stockQuantity - a.stockQuantity;
      return 0;
    });
  }, [category, products, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [category, query, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-max rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
        </div>

        <div className="mt-4 grid gap-3">
          <Button
            type="button"
            variant={category === "All" ? "primary" : "ghost"}
            className="justify-start"
            onClick={() => setCategory("All")}
          >
            All Products
          </Button>
          {categories.map((item) => (
            <Button
              key={item.name}
              type="button"
              variant={category === item.name ? "primary" : "ghost"}
              className="justify-start"
              onClick={() => setCategory(item.name)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </aside>

      <section>
        <div className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden />
            <Input
              className="pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product, SKU, brand, or category"
            />
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
            aria-label="Sort products"
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="stock-asc">Stock low to high</option>
            <option value="stock-desc">Stock high to low</option>
          </select>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        ) : visible.length ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                  Previous
                </Button>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-950">No products found</p>
            <p className="mt-2 text-sm text-slate-500">Try a different category or search term.</p>
          </div>
        )}
      </section>
    </div>
  );
}

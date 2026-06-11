import Link from "next/link";
import { AlertTriangle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product._id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge>{product.category}</Badge>
            <Link href={`/products/${product._id}`} className="mt-2 block text-base font-semibold text-slate-950 hover:text-secondary">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-950">{formatCurrency(product.price)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-500" aria-hidden />
              {product.ratingAverage ?? 4.5}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>

        {product.stockQuantity < 10 ? (
          <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Low Stock Warning
          </div>
        ) : (
          <p className="text-xs font-medium text-emerald-700">{product.stockQuantity} units available</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/products/${product._id}`}>Details</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/products/${product._id}#inquiry`}>Inquiry</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

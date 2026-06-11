"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { postJson } from "@/lib/api";
import { categories, products as initialProducts, type Product } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [notice, setNotice] = useState("");

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const product: Product = {
      _id: crypto.randomUUID(),
      name: String(formData.get("name")),
      imageUrl: String(formData.get("imageUrl")),
      category: String(formData.get("category")) as Product["category"],
      brand: String(formData.get("brand")),
      stockQuantity: Number(formData.get("stockQuantity")),
      price: Number(formData.get("price")),
      description: String(formData.get("description")),
      sku: String(formData.get("sku"))
    };

    setProducts((current) => [product, ...current]);

    try {
      await postJson("/products", product);
      setNotice("Product added to backend.");
    } catch {
      setNotice("Product added to the local demo table. Login as staff/admin to save to backend.");
    }

    event.currentTarget.reset();
  }

  function updateStock(id: string, change: number) {
    setProducts((current) =>
      current.map((product) =>
        product._id === id ? { ...product, stockQuantity: Math.max(0, product.stockQuantity + change) } : product
      )
    );
    setNotice("Stock updated in demo mode. Backend inventory endpoint is ready for authenticated staff.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Create products with category, brand, stock, price, image, description, and SKU.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addProduct} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Product Image URL</Label>
              <Input id="imageUrl" name="imageUrl" type="url" required placeholder="https://..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" className="h-11 rounded-md border border-slate-300 px-3 text-sm">
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" min={0} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" min={0} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4" aria-hidden />
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Edit stock quickly and monitor low-stock warnings.</CardDescription>
        </CardHeader>
        <CardContent>
          {notice ? <p className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{notice}</p> : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">SKU</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Stock</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                        <div>
                          <p className="font-semibold text-slate-950">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge>{product.category}</Badge>
                    </td>
                    <td className="py-4 pr-4 font-mono text-xs">{product.sku}</td>
                    <td className="py-4 pr-4">{formatCurrency(product.price)}</td>
                    <td className="py-4 pr-4">
                      <span className={product.stockQuantity < 10 ? "font-bold text-amber-700" : "font-semibold text-slate-950"}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateStock(product._id, -1)}>
                          -1
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => updateStock(product._id, 1)}>
                          +1
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Save product">
                          <Save className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

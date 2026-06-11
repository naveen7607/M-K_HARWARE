import { ProductManager } from "@/components/admin/product-manager";

export default function AdminProductsPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">Inventory</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Product Management</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Add products, update stock, and catch low-stock warnings before customers ask.
          </p>
        </div>
      </section>
      <section className="band">
        <div className="container-page">
          <ProductManager />
        </div>
      </section>
    </main>
  );
}

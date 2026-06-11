import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

export default function DashboardPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">Customer Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Profile, orders, inquiries, invoices, and wishlist</h1>
        </div>
      </section>
      <section className="band">
        <div className="container-page">
          <CustomerDashboard />
        </div>
      </section>
    </main>
  );
}

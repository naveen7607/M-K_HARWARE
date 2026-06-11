import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">Owner & Staff</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Admin Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage customers, products, inquiries, inventory, alerts, and sales signals from one clean workspace.
          </p>
        </div>
      </section>
      <section className="band">
        <div className="container-page">
          <AdminDashboard />
        </div>
      </section>
    </main>
  );
}

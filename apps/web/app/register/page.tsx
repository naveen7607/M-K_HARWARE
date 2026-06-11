import { RegisterPanel } from "@/components/auth/register-panel";

export default function RegisterPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">New Customer</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Create your customer account</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Save contact details, track inquiries, manage wishlist items, and download future invoices.
          </p>
        </div>
      </section>
      <section className="band">
        <div className="container-page">
          <RegisterPanel />
        </div>
      </section>
    </main>
  );
}

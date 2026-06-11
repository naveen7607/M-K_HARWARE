import { LoginPanel } from "@/components/auth/login-panel";

export default function LoginPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-wide text-secondary">Customer Access</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">Login with email, Google, or mobile OTP</h1>
        </div>
      </section>
      <section className="band">
        <div className="container-page">
          <LoginPanel />
        </div>
      </section>
    </main>
  );
}

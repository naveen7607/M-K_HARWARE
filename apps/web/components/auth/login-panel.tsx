"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postJson } from "@/lib/api";

export function LoginPanel() {
  const [status, setStatus] = useState("");
  const [otpMobile, setOtpMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setStatus("");

    try {
      await postJson("/auth/login", {
        email: String(formData.get("email")),
        password: String(formData.get("password"))
      });
      setStatus("Login successful. You can open the dashboard.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp() {
    setStatus("");
    setLoading(true);
    try {
      await postJson("/auth/otp/request", { mobile: otpMobile });
      setStatus("OTP sent. In local dev, the backend prints the OTP in its console.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "OTP request failed");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setStatus("");
    setLoading(true);
    try {
      const response = await postJson<{ requiresRegistration?: boolean }>("/auth/otp/verify", {
        mobile: otpMobile,
        code: otpCode
      });
      setStatus(response.data.requiresRegistration ? "Mobile verified. Please register to complete your account." : "OTP login successful.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Email Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={login} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="customer@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="Password" />
            </div>
            <Button type="submit" disabled={loading}>
              <LogIn className="h-4 w-4" aria-hidden />
              Login
            </Button>
            <Button type="button" variant="outline" disabled={loading}>
              Continue with Google
            </Button>
            <Link href="/register" className="text-sm font-semibold text-secondary">
              New customer? Register here
            </Link>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile OTP Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" value={otpMobile} onChange={(event) => setOtpMobile(event.target.value)} placeholder="+91..." />
          </div>
          <Button type="button" variant="outline" disabled={loading || otpMobile.length < 10} onClick={requestOtp}>
            Request OTP
          </Button>
          <div className="grid gap-2">
            <Label htmlFor="otp">6 Digit OTP</Label>
            <Input id="otp" value={otpCode} onChange={(event) => setOtpCode(event.target.value)} inputMode="numeric" maxLength={6} />
          </div>
          <Button type="button" disabled={loading || otpCode.length !== 6} onClick={verifyOtp}>
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Verify OTP
          </Button>
        </CardContent>
      </Card>

      {status ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 lg:col-span-2">{status}</div>
      ) : null}
    </div>
  );
}

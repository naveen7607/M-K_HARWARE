"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postJson } from "@/lib/api";

export function RegisterPanel() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setStatus("");

    try {
      await postJson("/auth/register", {
        fullName: String(formData.get("fullName")),
        mobile: String(formData.get("mobile")),
        email: String(formData.get("email")),
        password: String(formData.get("password"))
      });
      setStatus("Registration successful. You can continue to the customer dashboard.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Customer Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={register} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required placeholder="Enter full name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" required placeholder="+91..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="customer@example.com" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
          </div>
          <Button type="submit" disabled={loading}>
            <UserPlus className="h-4 w-4" aria-hidden />
            Create Account
          </Button>
          <Link href="/login" className="text-sm font-semibold text-secondary">
            Already registered? Login
          </Link>
          {status ? <p className="rounded-lg bg-slate-100 p-3 text-sm font-medium text-slate-700">{status}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}

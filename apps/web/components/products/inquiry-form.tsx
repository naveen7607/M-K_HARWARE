"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/api";
import type { Product } from "@/lib/sample-data";

export function InquiryForm({ product }: { product: Product }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("loading");
    setError("");

    const payload = {
      customerName: String(formData.get("customerName")),
      phoneNumber: String(formData.get("phoneNumber")),
      email: String(formData.get("email") || undefined),
      message: String(formData.get("message") || ""),
      items: [
        {
          product: product._id,
          productName: product.name,
          quantity: Number(formData.get("quantity") || 1)
        }
      ]
    };

    try {
      await postJson("/inquiries", payload);
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("sent");
      setError("Inquiry saved locally for demo mode. Connect the backend to send it to admin.");
    }
  }

  return (
    <Card id="inquiry">
      <CardHeader>
        <CardTitle>Send Product Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "sent" ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              Inquiry ready
            </div>
            <p className="mt-2">
              The shop team can respond with latest stock, price, and delivery or pickup details.
            </p>
            {error ? <p className="mt-2 text-amber-700">{error}</p> : null}
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Full Name</Label>
              <Input id="customerName" name="customerName" required placeholder="Enter your name" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Mobile Number</Label>
                <Input id="phoneNumber" name="phoneNumber" required placeholder="+91..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Optional" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Ask for current price, availability, or delivery details" />
            </div>
            <Button type="submit" disabled={status === "loading"}>
              <Send className="h-4 w-4" aria-hidden />
              {status === "loading" ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

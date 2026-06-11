"use client";

import { useEffect, useState } from "react";
import { Download, Heart, Package, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { products } from "@/lib/sample-data";

type UserProfile = {
  fullName: string;
  mobile: string;
  email: string;
};

const demoProfile: UserProfile = {
  fullName: "Demo Customer",
  mobile: "+919999999999",
  email: "customer@example.com"
};

const demoInquiries = [
  {
    id: "INQ-1001",
    product: "UltraTech Cement Bag",
    quantity: 25,
    status: "quoted"
  },
  {
    id: "INQ-1002",
    product: "Finolex Copper Wire Bundle",
    quantity: 2,
    status: "new"
  }
];

export function CustomerDashboard() {
  const [profile, setProfile] = useState<UserProfile>(demoProfile);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiFetch<{ user: UserProfile }>("/auth/me")
      .then((response) => setProfile(response.data.user))
      .catch(() => setProfile(demoProfile));
  }, []);

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setProfile({
      fullName: String(formData.get("fullName")),
      mobile: String(formData.get("mobile")),
      email: String(formData.get("email"))
    });
    setNotice("Profile changes are ready. Connect the backend session to persist them.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" aria-hidden />
            Profile
          </CardTitle>
          <CardDescription>View and edit customer details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={profile.fullName} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" name="mobile" defaultValue={profile.mobile} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile.email} />
            </div>
            <Button type="submit">Save Profile</Button>
            {notice ? <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">{notice}</p> : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Orders", "2 active requests", Package],
            ["Inquiries", "2 history items", UserRound],
            ["Wishlist", "3 saved products", Heart]
          ].map(([title, value, Icon]) => (
            <Card key={String(title)} className="p-5">
              <Icon className="h-5 w-5 text-secondary" aria-hidden />
              <p className="mt-3 text-sm text-slate-500">{String(title)}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{String(value)}</p>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry History</CardTitle>
            <CardDescription>Track product inquiries and shop follow-up status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-950">{inquiry.product}</p>
                  <p className="text-sm text-slate-500">
                    {inquiry.id} · Quantity {inquiry.quantity}
                  </p>
                </div>
                <Badge>{inquiry.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Download Invoices</CardTitle>
              <CardDescription>Invoice documents can be attached after order conversion.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <Download className="h-4 w-4" aria-hidden />
                Download Demo Invoice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wishlist Products</CardTitle>
              <CardDescription>Saved products for faster repeat inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {products.slice(0, 3).map((product) => (
                <div key={product._id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-md object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

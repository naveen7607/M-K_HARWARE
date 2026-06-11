"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BadgeIndianRupee, Package, UsersRound, ClipboardList } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type Analytics = {
  cards: {
    totalCustomers: number;
    totalProducts: number;
    totalInquiries: number;
    monthlySales: number;
    revenue: number;
  };
  charts: {
    categoryChart: Array<{ name: string; value: number }>;
    customerGrowth: Array<{ month: string; customers: number }>;
    salesChart: Array<{ month: string; inquiries: number; converted: number }>;
  };
  lowStockProducts: Array<{ _id: string; name: string; sku: string; stockQuantity: number; lowStockThreshold: number }>;
};

const fallbackAnalytics: Analytics = {
  cards: {
    totalCustomers: 128,
    totalProducts: 84,
    totalInquiries: 312,
    monthlySales: 47,
    revenue: 286000
  },
  charts: {
    categoryChart: [
      { name: "Hardware", value: 28 },
      { name: "Electrical", value: 24 },
      { name: "Cement", value: 14 },
      { name: "Agriculture", value: 18 }
    ],
    customerGrowth: [
      { month: "1/2026", customers: 12 },
      { month: "2/2026", customers: 18 },
      { month: "3/2026", customers: 22 },
      { month: "4/2026", customers: 26 },
      { month: "5/2026", customers: 31 },
      { month: "6/2026", customers: 19 }
    ],
    salesChart: [
      { month: "1/2026", inquiries: 28, converted: 12 },
      { month: "2/2026", inquiries: 34, converted: 17 },
      { month: "3/2026", inquiries: 43, converted: 18 },
      { month: "4/2026", inquiries: 52, converted: 24 },
      { month: "5/2026", inquiries: 49, converted: 22 },
      { month: "6/2026", inquiries: 47, converted: 21 }
    ]
  },
  lowStockProducts: [
    { _id: "demo-wire", name: "Finolex Copper Wire Bundle", sku: "EL-WIRE-025", stockQuantity: 8, lowStockThreshold: 10 },
    { _id: "demo-sprayer", name: "Agriculture Battery Sprayer", sku: "AG-SPRAYER-016", stockQuantity: 9, lowStockThreshold: 10 }
  ]
};

const pieColors = ["#2563EB", "#F59E0B", "#10B981", "#64748B"];

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>(fallbackAnalytics);

  useEffect(() => {
    apiFetch<Analytics>("/admin/analytics")
      .then((response) => setAnalytics(response.data))
      .catch(() => setAnalytics(fallbackAnalytics));
  }, []);

  const cards = [
    { label: "Total Customers", value: analytics.cards.totalCustomers.toLocaleString("en-IN"), icon: UsersRound },
    { label: "Total Products", value: analytics.cards.totalProducts.toLocaleString("en-IN"), icon: Package },
    { label: "Total Inquiries", value: analytics.cards.totalInquiries.toLocaleString("en-IN"), icon: ClipboardList },
    { label: "Monthly Sales", value: analytics.cards.monthlySales.toLocaleString("en-IN"), icon: BadgeIndianRupee },
    { label: "Revenue", value: formatCurrency(analytics.cards.revenue), icon: BadgeIndianRupee }
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Customers, inventory, inquiries, revenue, and category performance.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products">Manage Products</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <card.icon className="h-5 w-5 text-secondary" aria-hidden />
            <p className="mt-3 text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
            <CardDescription>Inquiry and conversion trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.charts.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inquiries" stroke="#2563EB" strokeWidth={2} />
                  <Line type="monotone" dataKey="converted" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Category Chart</CardTitle>
            <CardDescription>Catalog distribution by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" nameKey="name" data={analytics.charts.categoryChart} outerRadius={100} label>
                    {analytics.charts.categoryChart.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth Chart</CardTitle>
            <CardDescription>New customer registration trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.charts.customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products below configured threshold.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.lowStockProducts.map((product) => (
              <div key={product._id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-amber-600" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-950">{product.name}</p>
                    <p className="text-sm text-slate-600">
                      SKU {product.sku} · Stock {product.stockQuantity}/{product.lowStockThreshold}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-amber-700">Low Stock Warning</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

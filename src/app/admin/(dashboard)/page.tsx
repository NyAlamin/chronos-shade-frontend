"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, Clock, Package, ArrowUpRight } from "lucide-react";
import { adminApi } from "@/lib/api";
import { OrderStats, Order, Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    adminApi.getOrderStats().then(setStats).catch(() => {});
    adminApi.getOrders().then((o: Order[]) => setOrders(o.slice(0, 5))).catch(() => {});
    adminApi
      .getProducts({ limit: 1 })
      .then((r: any) => setProductCount(r.total || 0))
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats?.revenue || 0), icon: TrendingUp, color: "#059669" },
    { label: "Total Orders", value: stats?.total || 0, icon: ShoppingBag, color: "#2563EB" },
    { label: "Pending Orders", value: stats?.pending || 0, icon: Clock, color: "#D97706" },
    { label: "Total Products", value: productCount, icon: Package, color: "#7C3AED" },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50",
    confirmed: "text-blue-600 bg-blue-50",
    processing: "text-purple-600 bg-purple-50",
    shipped: "text-cyan-600 bg-cyan-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3.5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}10`, color: s.color }}
              >
                <s.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-bold">Recent Orders</h3>
        </div>
        {orders.map((o) => (
          <div key={o.id} className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1a1a1a]">{o.customerName}</p>
              <p className="text-xs text-gray-400">
                {o.orderNumber} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="text-sm font-bold mr-3">{formatPrice(o.total)}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[o.status] || ""}`}>
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
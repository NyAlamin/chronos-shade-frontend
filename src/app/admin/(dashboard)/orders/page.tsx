"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50", confirmed: "text-blue-600 bg-blue-50",
  processing: "text-purple-600 bg-purple-50", shipped: "text-cyan-600 bg-cyan-50",
  delivered: "text-green-600 bg-green-50", cancelled: "text-red-600 bg-red-50",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [viewing, setViewing] = useState<Order | null>(null);

  const fetch = (status?: string) =>
    adminApi.getOrders(status === "all" ? undefined : status).then(setOrders).catch(() => {});

  useEffect(() => { fetch(filter); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
      fetch(filter);
      if (viewing?.id === id) setViewing({ ...viewing!, status });
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold mb-1">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} orders</p>
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition ${
              filter === s ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Order ID", "Customer", "Items", "Total", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-50">
                <td className="px-4 py-3 text-sm font-semibold font-mono">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold">{o.customerName}</p>
                  <p className="text-xs text-gray-400">{o.phone}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{o.items.length}</td>
                <td className="px-4 py-3 text-sm font-bold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" onClick={() => setViewing(o)}><Eye size={14} /></Button>
                    {o.status !== "delivered" && o.status !== "cancelled" && (
                      <select onChange={(e) => { if (e.target.value) updateStatus(o.id, e.target.value); e.target.value = ""; }}
                        className="text-xs border border-gray-200 rounded-md py-1 px-2 bg-white cursor-pointer">
                        <option value="">Update</option>
                        {STATUSES.filter((s) => s !== "all" && s !== o.status).map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order {viewing?.orderNumber}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[viewing.status]}`}>{viewing.status}</span>
                <span className="text-xs text-gray-400">{new Date(viewing.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p className="font-bold text-[#1a1a1a]">{viewing.customerName}</p>
                <p className="text-gray-500">{viewing.phone}</p>
                {viewing.email && <p className="text-gray-500">{viewing.email}</p>}
                <p className="text-gray-500">{viewing.address}, {viewing.district}</p>
                {viewing.notes && <p className="text-amber-600 font-medium mt-2">Note: {viewing.notes}</p>}
              </div>
              <div className="border-t pt-3">
                {viewing.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-bold">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 mt-2 border-t text-base font-bold">
                  <span>Total</span><span>{formatPrice(viewing.total)}</span>
                </div>
              </div>
              {viewing.status !== "delivered" && viewing.status !== "cancelled" && (
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {STATUSES.filter((s) => s !== "all" && s !== viewing.status).map((s) => (
                      <Button key={s} variant="outline" size="sm" className="capitalize text-xs"
                        onClick={() => updateStatus(viewing.id, s)}>{s}</Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
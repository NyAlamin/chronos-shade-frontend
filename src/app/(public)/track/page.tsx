"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Package, Check, Truck, Clock } from "lucide-react";
import { trackOrderSchema, TrackOrderFormData } from "@/lib/validations";
import { publicApi } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={16} />,
  confirmed: <Check size={16} />,
  processing: <Package size={16} />,
  shipped: <Truck size={16} />,
  delivered: <Check size={16} />,
};

export default function TrackOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<TrackOrderFormData>({
    resolver: zodResolver(trackOrderSchema),
  });

  const onSubmit = async (data: TrackOrderFormData) => {
    setLoading(true);
    try {
      const result = await publicApi.trackOrder(data.orderNumber);
      setOrder(result);
    } catch {
      toast.error("Order not found");
      setOrder(null);
    }
    setLoading(false);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">
          Track Your Order
        </h1>
        <p className="text-sm text-gray-500">
          Enter your order number to check the status
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mb-10">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            {...register("orderNumber")}
            placeholder="CS-XXXXXX"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none font-mono transition ${
              errors.orderNumber ? "border-red-400" : "border-gray-200 focus:border-[#C4A265]"
            }`}
          />
          {errors.orderNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.orderNumber.message}</p>
          )}
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1a1a1a] hover:bg-[#333] px-8">
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {order && (
        <div className="bg-[#faf9f6] rounded-2xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs text-gray-400">Order Number</p>
              <p className="text-lg font-bold font-mono">{order.orderNumber}</p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Status timeline */}
          {order.status !== "cancelled" && (
            <div className="flex items-center justify-between mb-8 px-4">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${
                      i <= currentStep ? "bg-[#C4A265]" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {STATUS_ICONS[step]}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        i < currentStep ? "bg-[#C4A265]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Items */}
          <div className="border-t border-gray-200 pt-5">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-semibold">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
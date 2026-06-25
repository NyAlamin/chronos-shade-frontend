"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations";
import { publicApi } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod" },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productImage: i.image,
          quantity: i.quantity,
          price: i.price,
        })),
      };
      const result = await publicApi.createOrder(orderData);
      setOrder(result);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
    setSubmitting(false);
  };

  // Order confirmation
  if (order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-[72px] h-[72px] rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-500 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="bg-[#faf9f6] rounded-xl p-6 mb-6 text-left">
            <p className="text-xs text-gray-400 mb-1">Order Number</p>
            <p className="text-xl font-bold font-mono text-[#1a1a1a] mb-4">
              {order.orderNumber}
            </p>
            <p className="text-xs text-gray-400 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-[#1a1a1a]">
              {formatPrice(order.total)}
            </p>
          </div>
          <Link href="/">
            <Button className="bg-[#1a1a1a] hover:bg-[#333] text-white font-bold px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-400 mb-4">
            Your cart is empty
          </p>
          <Link href="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a1a1a] mb-6 transition"
      >
        <ChevronLeft size={16} /> Back to shop
      </Link>
      <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10"
      >
        {/* Form */}
        <div>
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-5">
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Full Name *
              </label>
              <input
                {...register("customerName")}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.customerName
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Phone Number *
              </label>
              <input
                {...register("phone")}
                placeholder="+880 1XXX XXXXXX"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.phone
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Email (Optional)
              </label>
              <input
                {...register("email")}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Delivery Address *
              </label>
              <input
                {...register("address")}
                placeholder="House, Street, Area"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.address
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                District / City *
              </label>
              <input
                {...register("district")}
                placeholder="e.g. Dhaka"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.district
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.district && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Postal Code
              </label>
              <input
                {...register("postalCode")}
                placeholder="e.g. 1205"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Any special instructions..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition resize-vertical"
              />
            </div>
          </div>

          {/* Payment Method */}
          <h3 className="text-lg font-bold text-[#1a1a1a] mt-8 mb-4">
            Payment Method
          </h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "cod", label: "Cash on Delivery" },
              { value: "bkash", label: "bKash" },
              { value: "nagad", label: "Nagad" },
            ].map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() =>
                  setValue("paymentMethod", m.value as any, {
                    shouldValidate: true,
                  })
                }
                className={`flex-1 min-w-[120px] py-4 px-5 rounded-xl text-sm font-semibold text-center transition ${
                  paymentMethod === m.value
                    ? "border-2 border-[#C4A265] bg-[#C4A265]/5"
                    : "border border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#faf9f6] rounded-2xl p-7 self-start lg:sticky lg:top-24">
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-5">
            Order Summary
          </h3>
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 mb-4 items-center"
            >
              <div className="w-[52px] h-[52px] bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag size={18} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#1a1a1a] pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-[#1a1a1a] hover:bg-[#333] text-white font-bold rounded-lg mt-5"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">
            By placing this order, you agree to our Terms of Service
          </p>
        </div>
      </form>
    </div>
  );
}
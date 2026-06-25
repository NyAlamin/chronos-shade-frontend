"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-display text-lg">
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="mx-auto mb-4" size={48} strokeWidth={1} />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 py-4 border-b border-gray-100"
              >
                <div className="w-[72px] h-[72px] rounded-lg bg-[#f0ede8] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="text-gray-300" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="self-start p-1 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <Button
              className="w-full h-12 bg-[#1a1a1a] hover:bg-[#333] text-white font-bold rounded-lg"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
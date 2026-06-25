"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { openCart, getCount } = useCartStore();
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-bold font-display text-[#C4A265] whitespace-nowrap">
            {/* Chronos <span className="text-[#C4A265]">&</span> Shade */}
            Purai Joss
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Shop", href: "/products" },
              { label: "Watches", href: "/products?categoryId=1" },
              { label: "Sunglasses", href: "/products?categoryId=2" },
              { label: "New Arrivals", href: "/products?sortBy=newest" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 hover:opacity-70 transition"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button onClick={openCart} className="p-1 relative hover:opacity-70 transition">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#C4A265] text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-100 px-6 py-3">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watches, sunglasses, brands..."
              className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition"
            />
          </form>
        </div>
      )}
    </nav>
  );
}
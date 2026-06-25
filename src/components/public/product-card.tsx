"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getDiscount } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const discount = getDiscount(product.price, product.oldPrice);
  const mainImage = product.images?.[0]?.url;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: mainImage || null,
      stock: product.stock,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative bg-[#f0ede8] rounded-xl aspect-[3/4] overflow-hidden mb-3.5">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="text-gray-300" size={48} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-[#1a1a1a] text-[#C4A265]">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-[#C4A265] text-white">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-red-600 text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Heart
            size={16}
            fill={liked ? "#C4A265" : "none"}
            className={liked ? "text-[#C4A265]" : "text-[#1a1a1a]"}
          />
        </button>

        {/* Quick actions */}
        {product.stock > 0 && (
          <div
            className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
              hovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2.5"
            }`}
          >
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-xs font-semibold hover:bg-[#333] transition"
            >
              Add to Cart
            </button>
            <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          {product.brand?.name}
        </p>
        <h3 className="text-sm font-semibold text-[#1a1a1a] mt-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < 4 ? "#C4A265" : "none"}
                className="text-[#C4A265]"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-bold text-[#1a1a1a]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
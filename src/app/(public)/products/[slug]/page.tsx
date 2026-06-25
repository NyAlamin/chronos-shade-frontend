"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { publicApi } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    publicApi
      .getProductBySlug(slug as string)
      .then((p: Product) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-gray-400">Product not found</p>
        <Link href="/products" className="text-[#C4A265] text-sm mt-2 inline-block">
          ← Back to products
        </Link>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.oldPrice);
  const images = product.images || [];
  const currentImage = images[selectedImage]?.url;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images[0]?.url || null,
        stock: product.stock,
      });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a1a1a] mb-8 transition"
      >
        <ChevronLeft size={16} /> Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-[#f0ede8] rounded-2xl overflow-hidden mb-4">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="text-gray-300" size={64} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    i === selectedImage
                      ? "border-[#C4A265]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C4A265] mb-2">
            {product.brand?.name}
          </p>
          <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < 4 ? "#C4A265" : "none"}
                  className="text-[#C4A265]"
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">(Reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[#1a1a1a]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded">
                Save {discount}%
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          <div className="text-sm mb-6">
            <span className="font-semibold text-[#1a1a1a]">Availability: </span>
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-14 bg-[#1a1a1a] hover:bg-[#333] text-white text-base font-bold rounded-xl mb-6"
              >
                <ShoppingBag className="mr-2" size={18} />
                Add to Cart — {formatPrice(product.price * quantity)}
              </Button>
            </>
          )}

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            {[
              { icon: <Truck size={18} />, label: "Free Delivery" },
              { icon: <RotateCcw size={18} />, label: "30-Day Returns" },
              { icon: <Shield size={18} />, label: "2-Year Warranty" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-[#C4A265] mx-auto mb-1.5 flex justify-center">
                  {item.icon}
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
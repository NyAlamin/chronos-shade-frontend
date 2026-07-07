"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Truck, Shield, RotateCcw, Package } from "lucide-react";
import HeroSlider from "@/components/public/hero-slider";
import ProductCard from "@/components/public/product-card";
import Newsletter from "@/components/public/newsletter";
import { publicApi } from "@/lib/api";
import { Product, Category } from "@/types";

function PromoBar() {
  return (
    <div className="bg-[#1a1a1a] py-3.5">
      <div className="max-w-[1200px] mx-auto flex justify-center gap-12 flex-wrap px-6">
        {[
          { icon: <Truck size={18} />, text: "Free Shipping Over ৳500" },
          { icon: <Shield size={18} />, text: "2-Year Warranty" },
          { icon: <RotateCcw size={18} />, text: "30-Day Returns" },
          { icon: <Package size={18} />, text: "Authentic Products" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-[13px] font-medium"
          >
            <span className="text-[#C4A265]">{item.icon}</span>
            <span className="text-white">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    publicApi.getFeaturedProducts().then(setFeatured).catch(() => {});
    publicApi
      .getProducts({ limit: 8, sortBy: "newest" })
      .then((r: any) => setProducts(r.products || []))
      .catch(() => {});
    publicApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <>
      <HeroSlider />
      <PromoBar />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-2">
              Browse
            </p>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="bg-[#f7f5f1] rounded-2xl p-9 hover:border-[#C4A265] border border-transparent transition-all hover:-translate-y-0.5"
              >
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-semibold text-[#C4A265]">
                    View Products
                  </span>
                  <ArrowRight size={16} className="text-[#C4A265]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Top Sellers */}
      {featured.length > 0 && (
        <section className="bg-[#faf9f6] py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-2">
                  Most Popular
                </p>
                <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
                  Top Sellers
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 border-2 border-[#1a1a1a] rounded-lg text-sm font-semibold hover:bg-[#1a1a1a] hover:text-white transition"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dual CTA Banners */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-2xl p-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C4A265] mb-3">
              Watches
            </p>
            <h3 className="font-display text-3xl font-bold text-white mb-2">
              Up to 40% Off
            </h3>
            <p className="text-white/50 text-sm mb-7">
              Premium timepieces at exceptional prices
            </p>
            <Link
              href="/products?categoryId=1"
              className="inline-block px-8 py-3.5 bg-[#C4A265] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#b8964e] transition"
            >
              Shop Now
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b00] to-[#4a3728] rounded-2xl p-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A574] mb-3">
              Sunglasses
            </p>
            <h3 className="font-display text-3xl font-bold text-white mb-2">
              Summer Sale
            </h3>
            <p className="text-white/50 text-sm mb-7">
              Designer shades starting ৳159
            </p>
            <Link
              href="/products?categoryId=2"
              className="inline-block px-8 py-3.5 bg-[#D4A574] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#c09565] transition"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Metal Wall Art Section */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#2a2a2a] rounded-2xl p-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C4A265] mb-3">
            New Category
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Metal Wall Art
          </h3>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Transform your space with our handcrafted metal wall art pieces.
            Bold designs that make a statement.
          </p>
          <Link
            href="/products?categoryId=3"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C4A265] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#b8964e] transition"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* All Products */}
      {products.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 pb-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-2">
                Our Collection
              </p>
              <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 border-2 border-[#1a1a1a] rounded-lg text-sm font-semibold hover:bg-[#1a1a1a] hover:text-white transition"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
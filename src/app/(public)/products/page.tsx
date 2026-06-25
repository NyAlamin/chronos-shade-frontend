"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";
import ProductCard from "@/components/public/product-card";
import { publicApi } from "@/lib/api";
import { Product, Category, Brand } from "@/types";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const gender = searchParams.get("gender") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const featured = searchParams.get("featured") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 12, sortBy };
      if (search) params.search = search;
      if (categoryId) params.categoryId = Number(categoryId);
      if (brandId) params.brandId = Number(brandId);
      if (gender) params.gender = gender;
      if (featured) params.featured = true;

      const res = await publicApi.getProducts(params);
      setProducts(res.products || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [page, search, categoryId, brandId, gender, sortBy, featured]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    publicApi.getCategories().then(setCategories).catch(() => {});
    publicApi.getBrands().then(setBrands).catch(() => {});
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-2">
          {search ? `Results for "${search}"` : "All Products"}
        </h1>
        <p className="text-sm text-gray-500">{total} products found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={categoryId}
          onChange={(e) => updateFilter("categoryId", e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:border-[#C4A265] outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={brandId}
          onChange={(e) => updateFilter("brandId", e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:border-[#C4A265] outline-none"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={gender}
          onChange={(e) => updateFilter("gender", e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:border-[#C4A265] outline-none"
        >
          <option value="">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:border-[#C4A265] outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-[3/4] mb-3" />
              <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold mb-2">No products found</p>
          <p className="text-sm">Try changing your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                p === page
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
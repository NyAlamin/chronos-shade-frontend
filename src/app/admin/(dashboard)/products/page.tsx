"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Edit2, Trash2, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/admin/delete-dialog";
import { adminApi } from "@/lib/api";
import { productSchema, ProductFormData } from "@/lib/validations";
import { Product, Category, Brand } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import MultiImageUpload from "@/components/admin/multi-image-upload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
  });

  const fetchProducts = () => {
    const params: Record<string, any> = { limit: 100 };
    if (search) params.search = search;
    if (filterCat) params.categoryId = Number(filterCat);
    adminApi.getProducts(params).then((r: any) => setProducts(r.products || [])).catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
    adminApi.getCategories().then(setCategories).catch(() => {});
    adminApi.getBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filterCat]);

  const openAdd = () => {
    reset({
      name: "", price: 0, oldPrice: null, stock: 0,
      status: "active", featured: false, gender: "unisex",
      categoryId: null, brandId: null,
    });
    setEditing(null);
    setModal("add");
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    reset({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      specifications: p.specifications || "",
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      stock: p.stock,
      status: p.status as any,
      featured: p.featured,
      gender: p.gender as any,
      categoryId: p.categoryId,
      brandId: p.brandId,
    });
    setModal("edit");
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      if (modal === "add") {
        await adminApi.createProduct(data);
        toast.success("Product added");
      } else if (editing) {
        await adminApi.updateProduct(editing.id, data);
        toast.success("Product updated");
      }
      setModal(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await adminApi.deleteProduct(deleting.id);
      toast.success("Product deleted");
      setDeleting(null);
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleFeatured = async (p: Product) => {
    await adminApi.updateProduct(p.id, { featured: !p.featured });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white">
        <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Product", "Category", "Price", "Stock", "Status", "Featured", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const discount = getDiscount(Number(p.price), p.oldPrice ? Number(p.oldPrice) : null);
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-[#f5f3ef] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-300 text-lg">📦</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1a]">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand?.name} · {p.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold">{formatPrice(Number(p.price))}</span>
                    {p.oldPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5">
                        {formatPrice(Number(p.oldPrice))}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-green-600 ml-1.5">-{discount}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${
                      p.stock === 0 ? "text-red-600" : p.stock < 10 ? "text-amber-600" : "text-green-600"
                    }`}>
                      {p.stock === 0 ? "Out of stock" : p.stock < 10 ? `Low (${p.stock})` : p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                      p.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p)}>
                      <Star size={18} fill={p.featured ? "#C4A265" : "none"} className={p.featured ? "text-[#C4A265]" : "text-gray-200"} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleting(p)}>
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-semibold">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Product Name *</label>
                <input {...register("name")} placeholder="e.g. Aviator Classic"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none ${errors.name ? "border-red-400" : "border-gray-200 focus:border-[#C4A265]"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
                <select {...register("categoryId", { setValueAs: (v) => v ? Number(v) : null })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">None</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Brand</label>
                <select {...register("brandId", { setValueAs: (v) => v ? Number(v) : null })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">None</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Selling Price (৳) *</label>
                <input {...register("price", { valueAsNumber: true })} type="number" step="0.01" placeholder="249"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none ${errors.price ? "border-red-400" : "border-gray-200 focus:border-[#C4A265]"}`} />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Old Price (৳)</label>
                <input {...register("oldPrice", { setValueAs: (v) => v === "" ? null : Number(v) })} type="number" step="0.01" placeholder="320"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Stock</label>
                <input {...register("stock", { valueAsNumber: true })} type="number" placeholder="50"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Gender</label>
                <select {...register("gender")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                <select {...register("status")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input {...register("featured")} type="checkbox" className="w-4 h-4 accent-[#C4A265]" />
                <label className="text-sm text-gray-600">Featured</label>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Product Images
                </label>
                <MultiImageUpload
                  values={watch("imageUrls") || []}
                  onChange={(urls) => setValue("imageUrls", urls)}
                  max={5}
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                <textarea {...register("description")} rows={3} placeholder="Product description..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] resize-vertical" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#1a1a1a] hover:bg-[#333] text-white">
                {saving ? "Saving..." : modal === "add" ? "Add Product" : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} name={deleting?.name || ""} />
    </div>
  );
}
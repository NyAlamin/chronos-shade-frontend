"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2, Upload } from "lucide-react";
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
import { brandSchema, BrandFormData } from "@/lib/validations";
import { Brand } from "@/types";
import ImageUpload from "@/components/admin/image-upload";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
  });

  const fetchBrands = () =>
    adminApi
      .getBrands()
      .then(setBrands)
      .catch(() => {});

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAdd = () => {
    reset({ name: "", slug: "", status: "active" });
    setEditing(null);
    setModal("add");
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    reset({
      name: b.name,
      slug: b.slug,
      logo: b.logo || "",
      status: b.status as "active" | "inactive",
    });
    setModal("edit");
  };

  const onSubmit = async (data: BrandFormData) => {
    setSaving(true);
    try {
      if (modal === "add") {
        await adminApi.createBrand(data);
        toast.success("Brand added");
      } else if (editing) {
        await adminApi.updateBrand(editing.id, data);
        toast.success("Brand updated");
      }
      setModal(null);
      fetchBrands();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving brand");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await adminApi.deleteBrand(deleting.id);
      toast.success("Brand deleted");
      setDeleting(null);
      fetchBrands();
    } catch {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">
            Brands
          </h2>
          <p className="text-sm text-gray-500">{brands.length} brands</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white">
          <Plus size={16} /> Add Brand
        </Button>
      </div>

      {/* Brand Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b: any) => (
          <div
            key={b.id}
            className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-[52px] h-[52px] rounded-xl bg-[#f5f3ef] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {b.logo ? (
                <img
                  src={b.logo}
                  alt={b.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🏷️</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[#1a1a1a] truncate">
                {b.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {b.productCount ?? 0} products ·{" "}
                <span
                  className={
                    b.status === "active" ? "text-green-600" : "text-red-600"
                  }
                >
                  {b.status}
                </span>
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                <Edit2 size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleting(b)}>
                <Trash2 size={14} className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {brands.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold mb-2">No brands yet</p>
          <p className="text-sm mb-4">Add your first brand to get started</p>
          <Button onClick={openAdd} className="bg-[#1a1a1a] hover:bg-[#333] text-white">
            <Plus size={16} className="mr-1.5" /> Add Brand
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modal === "add" ? "Add Brand" : "Edit Brand"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Brand Name *
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Meridian"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Slug
              </label>
              <input
                {...register("slug")}
                placeholder="auto-generated from name"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Leave empty to auto-generate from name
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#C4A265] cursor-pointer transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Logo Upload Area */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Brand Logo
              </label>
              <ImageUpload
                value={watch("logo") || ""}
                onChange={(url) => setValue("logo", url)}
                label="Upload brand logo"
                hint="PNG, JPG, SVG up to 2MB"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#1a1a1a] hover:bg-[#333] text-white"
              >
                {saving
                  ? "Saving..."
                  : modal === "add"
                  ? "Add Brand"
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        name={deleting?.name || ""}
      />
    </div>
  );
}
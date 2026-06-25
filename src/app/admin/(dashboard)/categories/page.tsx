"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/admin/delete-dialog";
import { adminApi } from "@/lib/api";
import { categorySchema, CategoryFormData } from "@/lib/validations";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetch = () => adminApi.getCategories().then(setCategories).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { reset({ name: "", slug: "", status: "active" }); setEditing(null); setModal("add"); };
  const openEdit = (c: Category) => { setEditing(c); reset({ name: c.name, slug: c.slug, status: c.status as any }); setModal("edit"); };

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (modal === "add") { await adminApi.createCategory(data); toast.success("Category added"); }
      else if (editing) { await adminApi.updateCategory(editing.id, data); toast.success("Category updated"); }
      setModal(null); fetch();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await adminApi.deleteCategory(deleting.id); toast.success("Deleted"); setDeleting(null); fetch(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1">Categories</h2>
          <p className="text-sm text-gray-500">{categories.length} categories</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white">

          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c: any) => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-base font-bold text-[#1a1a1a]">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {c.productCount ?? 0} products ·{" "}
                <span className={c.status === "active" ? "text-green-600" : "text-red-600"}>{c.status}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit2 size={14} /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleting(c)}><Trash2 size={14} className="text-red-500" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{modal === "add" ? "Add Category" : "Edit Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Name *</label>
              <input {...register("name")} placeholder="e.g. Luxury Watches"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none ${errors.name ? "border-red-400" : "border-gray-200 focus:border-[#C4A265]"}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Slug</label>
              <input {...register("slug")} placeholder="auto-generated" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
              <select {...register("status")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#1a1a1a] hover:bg-[#333] text-white">
                {saving ? "Saving..." : modal === "add" ? "Add" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} name={deleting?.name || ""} />
    </div>
  );
}
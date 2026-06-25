"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2, GripVertical, Image, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/admin/delete-dialog";
import { adminApi } from "@/lib/api";
import { bannerSchema, BannerFormData } from "@/lib/validations";
import { Banner } from "@/types";
import MultiImageUpload from "@/components/admin/multi-image-upload";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema) as any,
  });

  const fetch = () => adminApi.getBanners().then(setBanners).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { reset({ title: "", subtitle: "", description: "", ctaText: "", active: true, order: banners.length }); setEditing(null); setModal("add"); };
  const openEdit = (b: Banner) => { setEditing(b); reset({ title: b.title, subtitle: b.subtitle || "", description: b.description || "", ctaText: b.ctaText || "", ctaLink: b.ctaLink || "", active: b.active, order: b.order }); setModal("edit"); };

  const onSubmit = async (data: BannerFormData) => {
    setSaving(true);
    try {
      if (modal === "add") { await adminApi.createBanner(data); toast.success("Banner added"); }
      else if (editing) { await adminApi.updateBanner(editing.id, data); toast.success("Banner updated"); }
      setModal(null); fetch();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
    setSaving(false);
  };

  const toggleActive = async (b: Banner) => {
    await adminApi.updateBanner(b.id, { active: !b.active });
    fetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1">Hero Banners</h2>
          <p className="text-sm text-gray-500">Manage homepage hero slider</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white">

          <Plus size={16} /> Add Banner
        </Button>
      </div>

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <GripVertical size={18} className="text-gray-200 cursor-grab" />
            <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center flex-shrink-0">
              <Image size={20} className="text-[#C4A265]/50" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-[#1a1a1a]">{b.title}</p>
              <p className="text-xs text-gray-400">{b.subtitle} · CTA: "{b.ctaText}"</p>
            </div>
            <button onClick={() => toggleActive(b)}>
              {b.active ? <ToggleRight size={28} className="text-green-600" /> : <ToggleLeft size={28} className="text-gray-300" />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(b)}><Edit2 size={14} /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleting(b)}><Trash2 size={14} className="text-red-500" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{modal === "add" ? "Add Banner" : "Edit Banner"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Title *</label>
              <input {...register("title")} placeholder="e.g. Timeless Elegance"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none ${errors.title ? "border-red-400" : "border-gray-200 focus:border-[#C4A265]"}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Subtitle</label>
              <input {...register("subtitle")} placeholder="e.g. New Collection 2026" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
              <textarea {...register("description")} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] resize-vertical" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">CTA Text</label>
                <input {...register("ctaText")} placeholder="Shop Now" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">CTA Link</label>
                <input {...register("ctaLink")} placeholder="/products" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
              </div>
            </div>
           <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Banner Images
              </label>
              <MultiImageUpload
                values={(() => {
                  try {
                    const val = watch("image");
                    return val ? JSON.parse(val) : [];
                  } catch {
                    return watch("image") ? [watch("image")] : [];
                  }
                })()}
                onChange={(urls) => setValue("image", JSON.stringify(urls))}
                max={5}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Upload multiple images — they will auto-animate on the homepage. Recommended: 1920×800px
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input {...register("active")} type="checkbox" className="w-4 h-4 accent-[#C4A265]" />
              <label className="text-sm text-gray-600">Active</label>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#1a1a1a] hover:bg-[#333] text-white">
                {saving ? "Saving..." : modal === "add" ? "Add Banner" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={async () => { await adminApi.deleteBanner(deleting!.id); toast.success("Deleted"); setDeleting(null); fetch(); }}
        name={deleting?.title || ""} />
    </div>
  );
}
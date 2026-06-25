"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Edit2,
  Trash2,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Zap,
} from "lucide-react";
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
import { promotionSchema, PromotionFormData } from "@/lib/validations";
import { Promotion } from "@/types";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
  });

  const watchedText = watch("text");

  const fetchPromotions = () =>
    adminApi
      .getPromotions()
      .then(setPromotions)
      .catch(() => {});

  useEffect(() => {
    fetchPromotions();
  }, []);

  const openAdd = () => {
    reset({ text: "", type: "announcement", active: true });
    setEditing(null);
    setModal("add");
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    reset({
      text: p.text,
      type: p.type as "announcement" | "banner",
      active: p.active,
    });
    setModal("edit");
  };

  const onSubmit = async (data: PromotionFormData) => {
    setSaving(true);
    try {
      if (modal === "add") {
        await adminApi.createPromotion(data);
        toast.success("Promotion added");
      } else if (editing) {
        await adminApi.updatePromotion(editing.id, data);
        toast.success("Promotion updated");
      }
      setModal(null);
      fetchPromotions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving promotion");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await adminApi.deletePromotion(deleting.id);
      toast.success("Promotion deleted");
      setDeleting(null);
      fetchPromotions();
    } catch {
      toast.error("Failed to delete promotion");
    }
  };

  const toggleActive = async (p: Promotion) => {
    try {
      await adminApi.updatePromotion(p.id, { active: !p.active });
      fetchPromotions();
      toast.success(
        `Promotion ${!p.active ? "activated" : "deactivated"}`
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  const activeAnnouncement = promotions.find(
    (p) => p.active && p.type === "announcement"
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">
            Promotions
          </h2>
          <p className="text-sm text-gray-500">
            Announcement bars and promotional campaigns
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white"
        >
          <Plus size={16} /> Add Promotion
        </Button>
      </div>

      {/* Live Preview */}
      {activeAnnouncement && (
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Live Preview
          </p>
          <div className="bg-[#C4A265] py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-[#1a1a1a]">
            <Zap size={13} className="inline -mt-0.5 mr-1.5" />
            {activeAnnouncement.text}
          </div>
        </div>
      )}

      {/* Promotion List */}
      <div className="space-y-3">
        {promotions.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[#C4A265]/10 flex items-center justify-center flex-shrink-0">
              <Megaphone size={18} className="text-[#C4A265]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                {p.text}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Type: <span className="capitalize">{p.type}</span>
                {" · "}
                Created: {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${
                p.type === "announcement"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {p.type}
            </span>

            <button
              onClick={() => toggleActive(p)}
              className="flex-shrink-0"
              title={p.active ? "Deactivate" : "Activate"}
            >
              {p.active ? (
                <ToggleRight size={28} className="text-green-600" />
              ) : (
                <ToggleLeft size={28} className="text-gray-300" />
              )}
            </button>

            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                <Edit2 size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleting(p)}>
                <Trash2 size={14} className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {promotions.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Megaphone size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold mb-2">No promotions yet</p>
          <p className="text-sm mb-4">
            Create your first promotion to show on the storefront
          </p>
          <Button onClick={openAdd} className="bg-[#1a1a1a] hover:bg-[#333]">
            <Plus size={16} className="mr-1.5" /> Add Promotion
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modal === "add" ? "Add Promotion" : "Edit Promotion"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Text */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Promotion Text *
              </label>
              <textarea
                {...register("text")}
                rows={3}
                placeholder="e.g. Summer Sale — Up to 40% off on selected items"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-vertical transition ${
                  errors.text
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.text && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.text.message}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-1">
                This text will be displayed on the announcement bar or
                promotional banner
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Type
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#C4A265] cursor-pointer transition"
              >
                <option value="announcement">Announcement Bar</option>
                <option value="banner">Promotional Banner</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Announcement bars appear at the top of the page. Promotional
                banners appear in the main content area.
              </p>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <input
                {...register("active")}
                type="checkbox"
                id="promo-active"
                className="w-4 h-4 accent-[#C4A265] cursor-pointer"
              />
              <label
                htmlFor="promo-active"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Active — show this promotion on the storefront
              </label>
            </div>

            {/* Live Preview (updates as you type) */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Preview
              </p>
              <div className="bg-[#C4A265] py-2 px-4 rounded-lg text-center text-xs font-semibold text-[#1a1a1a]">
                <Zap size={11} className="inline -mt-0.5 mr-1" />
                {watchedText || "Your promotion text will appear here"}
              </div>
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
                  ? "Add Promotion"
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
        name={
          deleting
            ? deleting.text.length > 40
              ? deleting.text.substring(0, 40) + "..."
              : deleting.text
            : ""
        }
      />
    </div>
  );
}
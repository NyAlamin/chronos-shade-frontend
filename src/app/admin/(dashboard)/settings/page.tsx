"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Phone, Truck, Save } from "lucide-react";
import { toast } from "sonner";
import { settingsSchema, SettingsFormData } from "@/lib/validations";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    adminApi.getSettings().then((s: Record<string, string>) => {
      reset({
        storeName: s.storeName || "Chronos & Shade",
        tagline: s.tagline || "",
        phone: s.phone || "",
        email: s.email || "",
        address: s.address || "",
        facebook: s.facebook || "",
        instagram: s.instagram || "",
        twitter: s.twitter || "",
        youtube: s.youtube || "",
        freeShippingMin: s.freeShippingMin || "500",
        currency: s.currency || "BDT",
        currencySymbol: s.currencySymbol || "৳",
      });
    }).catch(() => {});
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const settings: Record<string, string> = {};
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) settings[k] = String(v); });
      await adminApi.updateSettings(settings);
      toast.success("Settings saved");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <h3 className="text-base font-bold text-[#1a1a1a] flex items-center gap-2 mb-5">
        <span className="text-[#C4A265]">{icon}</span> {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold mb-1">Site Settings</h2>
        <p className="text-sm text-gray-500">General store configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section icon={<Globe size={18} />} title="General">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Store Name</label>
              <input {...register("storeName")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tagline</label>
              <input {...register("tagline")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
            </div>
          </div>
        </Section>

        <Section icon={<Phone size={18} />} title="Contact Information">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Phone</label>
              <input {...register("phone")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
              <input {...register("email")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
            <div className="col-span-2"><label className="text-xs font-semibold text-gray-500 mb-1 block">Address</label>
              <input {...register("address")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
          </div>
        </Section>

        <Section icon={<Globe size={18} />} title="Social Media">
          <div className="grid grid-cols-2 gap-4">
            {(["facebook", "instagram", "twitter", "youtube"] as const).map((s) => (
              <div key={s}>
                <label className="text-xs font-semibold text-gray-500 mb-1 block capitalize">{s}</label>
                <input {...register(s)} placeholder={`https://${s}.com/...`}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<Truck size={18} />} title="Shipping & Currency">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Free Shipping Min (৳)</label>
              <input {...register("freeShippingMin")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Currency Code</label>
              <input {...register("currency")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Currency Symbol</label>
              <input {...register("currencySymbol")} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265]" /></div>
          </div>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="gap-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white">
            <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
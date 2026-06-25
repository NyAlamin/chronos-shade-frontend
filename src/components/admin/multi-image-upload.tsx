"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function MultiImageUpload({
  values = [],
  onChange,
  max = 5,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = max - values.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }

    const toUpload = files.slice(0, remaining);

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }
    }

    setUploading(true);
    try {
      const results = await adminApi.uploadImages(toUpload);
      const newUrls = results.map((r: any) => r.url);
      onChange([...values, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
    setUploading(false);

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {values.map((url, i) => (
          <div key={i} className="relative aspect-square">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      {values.length < max && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-[#f9f8f5] rounded-lg p-5 border-2 border-dashed border-[#e0ddd5] text-center cursor-pointer hover:border-[#C4A265] transition disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="text-[#C4A265] mx-auto mb-1 animate-spin" />
                <p className="text-xs text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">
                  Click to upload images ({values.length}/{max})
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
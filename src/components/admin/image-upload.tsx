"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  hint?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  hint = "PNG, JPG up to 5MB",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    try {
      const result = await adminApi.uploadImage(file);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
    setUploading(false);

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-full max-w-[280px] h-40 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => {
              onRemove?.();
              onChange("");
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-[#f9f8f5] rounded-lg p-6 border-2 border-dashed border-[#e0ddd5] text-center cursor-pointer hover:border-[#C4A265] transition disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="text-[#C4A265] mx-auto mb-2 animate-spin" />
              <p className="text-xs text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <Upload size={22} className="text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-[11px] text-gray-400 mt-1">{hint}</p>
            </>
          )}
        </button>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { publicApi } from "@/lib/api";
import { Promotion } from "@/types";

export default function AnnouncementBar() {
  const [promo, setPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    publicApi.getActivePromos().then((promos: Promotion[]) => {
      const announcement = promos.find((p) => p.type === "announcement");
      if (announcement) setPromo(announcement);
    }).catch(() => {});
  }, []);

  if (!promo) return null;

  return (
    <div className="bg-[#C4A265] py-2 px-4 text-center text-sm font-semibold text-[#1a1a1a]">
      <Zap className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
      {promo.text}
    </div>
  );
}
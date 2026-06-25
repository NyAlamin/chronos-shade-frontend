"use client";

import { usePathname } from "next/navigation";
import { Bell, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminHeader() {
  const pathname = usePathname();
  const page = pathname.split("/").pop() || "dashboard";

  return (
    <header className="bg-white border-b border-gray-100 px-7 h-14 flex items-center justify-between sticky top-0 z-50">
      <p className="text-sm text-gray-400">
        Admin / <span className="text-[#1a1a1a] font-semibold capitalize">{page}</span>
      </p>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          <Bell size={17} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Eye size={14} /> View Store
          </Button>
        </Link>
      </div>
    </header>
  );
}
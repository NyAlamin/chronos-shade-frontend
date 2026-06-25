"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Layers, Tag, ShoppingBag,
  Image, Megaphone, Settings, LogOut, Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const NAV = [
  { id: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { id: "/admin/products", label: "Products", icon: Package },
  { id: "/admin/categories", label: "Categories", icon: Layers },
  { id: "/admin/brands", label: "Brands", icon: Tag },
  { id: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { id: "divider" },
  { id: "/admin/banners", label: "Hero Banners", icon: Image },
  { id: "/admin/promotions", label: "Promotions", icon: Megaphone },
  { id: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-250 flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-[248px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 border-b border-gray-100 min-h-[65px] ${
          collapsed ? "px-3 justify-center" : "px-5"
        }`}
      >
        <button onClick={() => setCollapsed(!collapsed)} className="p-1">
          <Menu size={20} className="text-[#1a1a1a]" />
        </button>
        {!collapsed && (
          <h1 className="text-base font-bold font-display text-[#1a1a1a] whitespace-nowrap">
            Chronos <span className="text-[#C4A265]">&</span> Shade
          </h1>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {NAV.map((item, i) => {
          if (item.id === "divider")
            return <div key={i} className="h-px bg-gray-100 my-2" />;
          const Icon = item.icon!;
          const active = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-[#C4A265]/10 text-[#C4A265]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#C4A265] text-xs font-bold flex-shrink-0">
            {user?.name?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1a1a1a] truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <button onClick={logout} className="text-gray-300 hover:text-red-500 transition">
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
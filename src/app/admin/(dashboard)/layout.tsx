"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");

    if (!token || !user) {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [router]);

  // Show nothing while checking auth
  if (checking || !authorized) {
    return (
      <div className="h-screen w-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C4A265] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f8f6] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <AdminHeader />
        <div className="p-7 flex-1">{children}</div>
      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  // Don't show login form until we verify user is not already logged in
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C4A265] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">
            Chronos <span className="text-[#C4A265]">&</span> Shade
          </h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@chronos.com"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.email
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition ${
                  errors.password
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#C4A265]"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1a1a1a] hover:bg-[#333] text-white font-bold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
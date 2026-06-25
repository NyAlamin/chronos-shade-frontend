import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Unwrap the { success, data, message } envelope
api.interceptors.response.use(
  (response) => {
    if (response.data?.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Public endpoints ────────────────────────────
export const publicApi = {
  // Products
  getProducts: (params?: Record<string, any>) =>
    api.get("/products", { params }).then((r) => r.data),
  getFeaturedProducts: () =>
    api.get("/products/featured").then((r) => r.data),
  getProductBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`).then((r) => r.data),

  // Categories & Brands
  getCategories: () => api.get("/categories/active").then((r) => r.data),
  getBrands: () => api.get("/brands/active").then((r) => r.data),

  // Banners & Promos
  getActiveBanners: () => api.get("/banners/active").then((r) => r.data),
  getActivePromos: () => api.get("/promotions/active").then((r) => r.data),

  // Settings
  getSettings: () => api.get("/settings").then((r) => r.data),

  // Orders (guest)
  createOrder: (data: any) => api.post("/orders", data).then((r) => r.data),
  trackOrder: (orderNumber: string) =>
    api.get(`/orders/track/${orderNumber}`).then((r) => r.data),
};

// ── Admin endpoints ─────────────────────────────
export const adminApi = {
  // Auth
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((r) => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch("/auth/change-password", data).then((r) => r.data),

  // Products
  getProducts: (params?: Record<string, any>) =>
    api.get("/products", { params }).then((r) => r.data),
  getProduct: (id: number) =>
    api.get(`/products/${id}`).then((r) => r.data),
  createProduct: (data: any) =>
    api.post("/products", data).then((r) => r.data),
  updateProduct: (id: number, data: any) =>
    api.patch(`/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: number) =>
    api.delete(`/products/${id}`).then((r) => r.data),

  // Categories
  getCategories: () => api.get("/categories").then((r) => r.data),
  createCategory: (data: any) =>
    api.post("/categories", data).then((r) => r.data),
  updateCategory: (id: number, data: any) =>
    api.patch(`/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: number) =>
    api.delete(`/categories/${id}`).then((r) => r.data),

  // Brands
  getBrands: () => api.get("/brands").then((r) => r.data),
  createBrand: (data: any) =>
    api.post("/brands", data).then((r) => r.data),
  updateBrand: (id: number, data: any) =>
    api.patch(`/brands/${id}`, data).then((r) => r.data),
  deleteBrand: (id: number) =>
    api.delete(`/brands/${id}`).then((r) => r.data),

  // Orders
  getOrders: (status?: string) =>
    api.get("/orders", { params: status ? { status } : {} }).then((r) => r.data),
  getOrder: (id: number) =>
    api.get(`/orders/${id}`).then((r) => r.data),
  getOrderStats: () =>
    api.get("/orders/stats").then((r) => r.data),
  updateOrderStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),

  // Banners
  getBanners: () => api.get("/banners").then((r) => r.data),
  createBanner: (data: any) =>
    api.post("/banners", data).then((r) => r.data),
  updateBanner: (id: number, data: any) =>
    api.patch(`/banners/${id}`, data).then((r) => r.data),
  deleteBanner: (id: number) =>
    api.delete(`/banners/${id}`).then((r) => r.data),

  // Promotions
  getPromotions: () => api.get("/promotions").then((r) => r.data),
  createPromotion: (data: any) =>
    api.post("/promotions", data).then((r) => r.data),
  updatePromotion: (id: number, data: any) =>
    api.patch(`/promotions/${id}`, data).then((r) => r.data),
  deletePromotion: (id: number) =>
    api.delete(`/promotions/${id}`).then((r) => r.data),

  // Settings
  getSettings: () => api.get("/settings").then((r) => r.data),
  updateSettings: (settings: Record<string, string>) =>
    api.put("/settings", { settings }).then((r) => r.data),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return api
      .post("/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

export default api;
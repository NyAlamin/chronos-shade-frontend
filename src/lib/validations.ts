import { z } from "zod";

// ── Auth ──────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Min 6 characters"),
    newPassword: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ── Category ──────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});
export type CategoryFormData = z.infer<typeof categorySchema>;

// ── Brand ─────────────────────────────────────────
export const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
  logo: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});
export type BrandFormData = z.infer<typeof brandSchema>;

// ── Product ───────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  specifications: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  oldPrice: z.coerce.number().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  featured: z.boolean(),
  gender: z.enum(["men", "women", "unisex"]),
  categoryId: z.coerce.number().nullable().optional(),
  brandId: z.coerce.number().nullable().optional(),
  imageUrls: z.array(z.string()).optional(),
});
export type ProductFormData = z.infer<typeof productSchema>;

// ── Checkout (Guest) ──────────────────────────────
export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  phone: z
    .string()
    .min(11, "Phone must be at least 11 digits")
    .regex(/^[\d+\-\s]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  postalCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["cod", "bkash", "nagad"]),
});
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ── Order Status ──────────────────────────────────
export const orderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

// ── Banner ────────────────────────────────────────
export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean(),
  order: z.coerce.number().int().min(0),
});
export type BannerFormData = z.infer<typeof bannerSchema>;

// ── Promotion ─────────────────────────────────────
export const promotionSchema = z.object({
  text: z.string().min(1, "Text is required").max(300),
  type: z.enum(["announcement", "banner"]),
  active: z.boolean(),
});
export type PromotionFormData = z.infer<typeof promotionSchema>;

// ── Settings ──────────────────────────────────────
export const settingsSchema = z.object({
  storeName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  freeShippingMin: z.string().optional(),
  shippingDhaka: z.string().optional(),
  shippingOutside: z.string().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
});
export type SettingsFormData = z.infer<typeof settingsSchema>;

// ── Track Order ───────────────────────────────────
export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .min(1, "Order number is required")
    .regex(/^CS-/, "Order number must start with CS-"),
});
export type TrackOrderFormData = z.infer<typeof trackOrderSchema>;
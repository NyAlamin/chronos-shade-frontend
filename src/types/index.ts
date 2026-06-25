export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  status: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  status: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  publicId: string | null;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  specifications: string | null;
  price: number;
  oldPrice: number | null;
  stock: number;
  status: string;
  featured: boolean;
  gender: string;
  category: Category | null;
  categoryId: number | null;
  brand: Brand | null;
  brandId: number | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  district: string;
  postalCode: string | null;
  notes: string | null;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  image: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: number;
  text: string;
  type: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  discount: number;
  createdAt: Date;
  items: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  externalId?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  boletoUrl?: string;
  boletoCode?: string;
  amount: number;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: Date;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REFUNDED";
export type CouponType = "PERCENTAGE" | "FIXED";

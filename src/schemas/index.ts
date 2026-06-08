import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const checkoutSchema = z.object({
  // Personal
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  // Address
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  street: z.string().min(3, "Endereço obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  district: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Estado inválido"),
  // Payment
  paymentMethod: z.enum(["PIX", "CREDIT_CARD", "BOLETO"]),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  categoryId: z.string(),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

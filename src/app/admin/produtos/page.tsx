import { prisma } from "@/lib/prisma";
import AdminProdutosClient from "@/components/admin/AdminProdutosClient";

export default async function AdminProdutosPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return <AdminProdutosClient products={products as any} categories={categories} />;
}

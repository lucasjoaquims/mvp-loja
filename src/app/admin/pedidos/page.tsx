import { prisma } from "@/lib/prisma";
import AdminPedidosClient from "@/components/admin/AdminPedidosClient";

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      payment: true,
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return <AdminPedidosClient orders={orders as any} />;
}

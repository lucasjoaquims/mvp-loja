import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/utils";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const [totalOrders, totalRevenueAgg, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
    }),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, payment: true },
    }),
  ]);

  const stats = {
    totalOrders,
    totalRevenue: totalRevenueAgg._sum.total ?? 0,
    totalProducts,
    totalUsers,
  };

  return <AdminDashboardClient stats={stats} recentOrders={recentOrders as any} />;
}

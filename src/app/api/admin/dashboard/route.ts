import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { notIn: ["CANCELLED", "REFUNDED"] } } }),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, payment: true },
    }),
  ]);

  // Sales by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const salesData = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: { total: true },
    where: { createdAt: { gte: sixMonthsAgo }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
  });

  return NextResponse.json({
    stats: {
      totalOrders,
      totalRevenue: totalRevenue._sum.total ?? 0,
      totalProducts,
      totalUsers,
    },
    recentOrders,
    salesData,
  });
}

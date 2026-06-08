import { prisma } from "@/lib/prisma";
import AdminCuponsClient from "@/components/admin/AdminCuponsClient";

export default async function AdminCuponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminCuponsClient coupons={coupons as any} />;
}

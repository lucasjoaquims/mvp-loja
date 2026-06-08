import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: params.code.toUpperCase() },
  });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Cupom inválido ou expirado" }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  }

  return NextResponse.json({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minAmount: coupon.minAmount,
  });
}

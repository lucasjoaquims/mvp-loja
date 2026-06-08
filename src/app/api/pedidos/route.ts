import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { form, items, total, discount } = await req.json();

  // Save/find address
  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      cep: form.cep,
      street: form.street,
      number: form.number,
      complement: form.complement,
      district: form.district,
      city: form.city,
      state: form.state,
    },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      discount,
      addressId: address.id,
      status: "PENDING",
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
      },
    },
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

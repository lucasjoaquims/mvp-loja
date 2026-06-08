import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCardPayment } from "@/lib/mercadopago";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { orderId, form } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  try {
    const payment = await createCardPayment({
      orderId,
      amount: order.total,
      email: form.email,
      name: form.name,
      cpf: form.cpf,
      token: form.cardToken,
      installments: form.installments ?? 1,
      paymentMethodId: form.paymentMethodId ?? "visa",
      issuerId: form.issuerId,
    });

    const status = (payment as any).status;
    await prisma.payment.create({
      data: {
        orderId,
        method: "CREDIT_CARD",
        status: status === "approved" ? "APPROVED" : "PENDING",
        externalId: String((payment as any).id),
        amount: order.total,
      },
    });

    if (status === "approved") {
      await prisma.order.update({ where: { id: orderId }, data: { status: "CONFIRMED" } });
    }

    return NextResponse.json({ paymentId: (payment as any).id, status });
  } catch (e: any) {
    console.error("Card error:", e);
    return NextResponse.json({ error: e.message ?? "Erro ao processar cartão" }, { status: 500 });
  }
}

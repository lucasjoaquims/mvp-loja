import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPixPayment } from "@/lib/mercadopago";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { orderId, form } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  try {
    const payment = await createPixPayment({
      orderId,
      amount: order.total,
      email: form.email,
      name: form.name,
      cpf: form.cpf,
    });

    const txInfo = (payment as any).transaction_details ?? {};
    const pixData = (payment as any).point_of_interaction?.transaction_data ?? {};

    await prisma.payment.create({
      data: {
        orderId,
        method: "PIX",
        status: "PENDING",
        externalId: String((payment as any).id),
        pixQrCode: pixData.qr_code ?? "",
        pixQrCodeBase64: pixData.qr_code_base64 ?? "",
        amount: order.total,
      },
    });

    return NextResponse.json({
      paymentId: (payment as any).id,
      pixQrCode: pixData.qr_code,
      pixQrCodeBase64: pixData.qr_code_base64,
      status: (payment as any).status,
    });
  } catch (e: any) {
    console.error("PIX error:", e);
    return NextResponse.json({ error: e.message ?? "Erro ao criar PIX" }, { status: 500 });
  }
}

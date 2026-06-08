import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBoletoPayment } from "@/lib/mercadopago";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { orderId, form } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  try {
    const payment = await createBoletoPayment({
      orderId,
      amount: order.total,
      email: form.email,
      name: form.name,
      cpf: form.cpf,
      address: {
        street: form.street,
        number: form.number,
        city: form.city,
        state: form.state,
        cep: form.cep,
      },
    });

    const boletoData = (payment as any).transaction_details ?? {};

    await prisma.payment.create({
      data: {
        orderId,
        method: "BOLETO",
        status: "PENDING",
        externalId: String((payment as any).id),
        boletoUrl: boletoData.external_resource_url ?? "",
        boletoCode: (payment as any).barcode_content ?? "",
        amount: order.total,
      },
    });

    return NextResponse.json({
      paymentId: (payment as any).id,
      boletoUrl: boletoData.external_resource_url,
      boletoCode: (payment as any).barcode_content,
      status: (payment as any).status,
    });
  } catch (e: any) {
    console.error("Boleto error:", e);
    return NextResponse.json({ error: e.message ?? "Erro ao gerar boleto" }, { status: 500 });
  }
}

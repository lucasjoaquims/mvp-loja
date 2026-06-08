import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    const mpPayment = await getPaymentStatus(data.id);
    const mpStatus = (mpPayment as any).status;
    const orderId = (mpPayment as any).external_reference;

    if (!orderId) return NextResponse.json({ received: true });

    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) return NextResponse.json({ received: true });

    let paymentStatus: string;
    let orderStatus: string;

    switch (mpStatus) {
      case "approved":
        paymentStatus = "APPROVED";
        orderStatus = "CONFIRMED";
        break;
      case "rejected":
        paymentStatus = "REJECTED";
        orderStatus = "CANCELLED";
        break;
      case "cancelled":
        paymentStatus = "CANCELLED";
        orderStatus = "CANCELLED";
        break;
      default:
        paymentStatus = "PENDING";
        orderStatus = "PENDING";
    }

    await prisma.payment.update({
      where: { orderId },
      data: { status: paymentStatus as any },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus as any },
    });

    // Decrement stock if approved
    if (mpStatus === "approved") {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

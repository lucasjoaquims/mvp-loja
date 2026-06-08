import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente", CONFIRMED: "Confirmado", PROCESSING: "Em preparo",
  SHIPPED: "Enviado", DELIVERED: "Entregue", CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function ContaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { select: { name: true, images: true } } } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight">Minha Conta</h1>
        <p className="text-zinc-400 text-sm mt-1">{session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-50 p-6">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Total de pedidos</p>
          <p className="text-3xl font-black">{orders.length}</p>
        </div>
        <div className="bg-zinc-50 p-6">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Valor total gasto</p>
          <p className="text-3xl font-black">
            {formatCurrency(orders.reduce((s, o) => s + o.total, 0))}
          </p>
        </div>
        <div className="bg-zinc-50 p-6">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Pedidos entregues</p>
          <p className="text-3xl font-black">{orders.filter((o) => o.status === "DELIVERED").length}</p>
        </div>
      </div>

      <h2 className="text-xl font-black uppercase tracking-tight mb-6">Meus Pedidos</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50">
          <p className="text-zinc-400">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-zinc-100 p-6">
              <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-xs text-zinc-400">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 font-medium ${STATUS_COLORS[order.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="font-bold text-sm">{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {order.items.map((item) => (
                  <div key={item.id} className="shrink-0 flex items-center gap-2">
                    <img src={item.product?.images[0]} alt={item.product?.name} className="w-14 h-18 object-cover bg-zinc-100" />
                    <div>
                      <p className="text-xs font-semibold">{item.product?.name}</p>
                      <p className="text-xs text-zinc-400">Qtd: {item.quantity}</p>
                      <p className="text-xs font-bold">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Em preparo",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-zinc-100 text-zinc-600",
};

const PAYMENT_LABELS: Record<string, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão",
  BOLETO: "Boleto",
};

export default function AdminPedidosClient({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/pedidos/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      toast.success("Status atualizado!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Pedidos</h1>
        <p className="text-zinc-400 text-sm mt-1">{orders.length} pedido(s) no total</p>
      </div>

      <div className="bg-white border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["ID", "Cliente", "Itens", "Total", "Pagamento", "Status", "Data"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-widest text-zinc-400 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-zinc-400">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-xs">{order.user?.name ?? "—"}</p>
                    <p className="text-xs text-zinc-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-zinc-500">
                    {order.items.map((i: any) => `${i.product?.name} (${i.quantity})`).join(", ").slice(0, 40)}
                    {order.items.length > 1 ? "..." : ""}
                  </td>
                  <td className="py-3 px-4 font-bold whitespace-nowrap">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-4 text-xs">
                    {order.payment ? PAYMENT_LABELS[order.payment.method] ?? order.payment.method : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      disabled={updating === order.id}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-xs text-zinc-400 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-zinc-400">Nenhum pedido ainda</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

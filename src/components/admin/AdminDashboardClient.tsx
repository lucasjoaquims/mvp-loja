"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, ShoppingBag, Users } from "lucide-react";
import { formatCurrency } from "@/utils";

const MOCK_CHART = [
  { month: "Jan", vendas: 8400 },
  { month: "Fev", vendas: 12300 },
  { month: "Mar", vendas: 9800 },
  { month: "Abr", vendas: 15600 },
  { month: "Mai", vendas: 13200 },
  { month: "Jun", vendas: 18900 },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Em preparo",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

interface Props {
  stats: { totalOrders: number; totalRevenue: number; totalProducts: number; totalUsers: number };
  recentOrders: any[];
}

export default function AdminDashboardClient({ stats, recentOrders }: Props) {
  const cards = [
    { label: "Receita Total", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Pedidos", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Produtos Ativos", value: stats.totalProducts, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Clientes", value: stats.totalUsers, icon: Users, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Visão geral da loja</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-zinc-100 p-6">
            <div className={`inline-flex p-2 rounded ${card.color} mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-black">{card.value}</p>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-zinc-100 p-6">
        <h2 className="font-black uppercase tracking-tight mb-6">Vendas (últimos 6 meses)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={MOCK_CHART}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Bar dataKey="vendas" fill="#09090b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-zinc-100 p-6">
        <h2 className="font-black uppercase tracking-tight mb-6">Pedidos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left py-3 px-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">ID</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Cliente</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Total</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Status</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="py-3 px-2 font-mono text-xs text-zinc-400">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-2">
                    <p className="font-medium">{order.user?.name ?? "—"}</p>
                    <p className="text-xs text-zinc-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-2 font-bold">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 font-medium ${STATUS_COLORS[order.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-400">Nenhum pedido ainda</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

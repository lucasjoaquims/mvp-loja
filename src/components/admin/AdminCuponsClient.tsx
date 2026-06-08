"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minAmount?: number | null;
  maxUses?: number | null;
  usedCount: number;
  active: boolean;
  expiresAt?: Date | null;
}

export default function AdminCuponsClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: "", minAmount: "", maxUses: "", expiresAt: "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: parseFloat(form.value),
          minAmount: form.minAmount ? parseFloat(form.minAmount) : undefined,
          maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar cupom");
      toast.success("Cupom criado!");
      setShowModal(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/cupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Cupons</h1>
          <p className="text-zinc-400 text-sm mt-1">{coupons.length} cupom(s) cadastrado(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Novo Cupom
        </button>
      </div>

      <div className="bg-white border border-zinc-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              {["Código", "Tipo", "Valor", "Mínimo", "Usos", "Status", "Ações"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-widest text-zinc-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                <td className="py-3 px-4 font-mono font-bold">{c.code}</td>
                <td className="py-3 px-4 text-xs text-zinc-500">{c.type === "PERCENTAGE" ? "Percentual" : "Valor fixo"}</td>
                <td className="py-3 px-4 font-bold">
                  {c.type === "PERCENTAGE" ? `${c.value}%` : formatCurrency(c.value)}
                </td>
                <td className="py-3 px-4 text-xs text-zinc-500">
                  {c.minAmount ? formatCurrency(c.minAmount) : "—"}
                </td>
                <td className="py-3 px-4 text-xs">
                  {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                    {c.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleActive(c.id, c.active)}
                    className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                  >
                    {c.active ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-zinc-400">Nenhum cupom cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-white z-50 shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black uppercase tracking-tight">Novo Cupom</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Código</label>
                  <input className="input-field uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="BEMVINDO10" />
                </div>
                <div>
                  <label className="label">Tipo</label>
                  <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Valor ({form.type === "PERCENTAGE" ? "%" : "R$"})</label>
                  <input className="input-field" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "PERCENTAGE" ? "10" : "50"} />
                </div>
                <div>
                  <label className="label">Valor mínimo do pedido (opcional)</label>
                  <input className="input-field" type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} placeholder="200" />
                </div>
                <div>
                  <label className="label">Máximo de usos (opcional)</label>
                  <input className="input-field" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="100" />
                </div>
                <div>
                  <label className="label">Validade (opcional)</label>
                  <input className="input-field" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                    {loading ? "Criando..." : "Criar Cupom"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

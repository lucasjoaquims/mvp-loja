"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getDiscount, getTotal, getItemCount, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const totalQty = getItemCount();

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch(`/api/cupons/${couponCode.toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cupom inválido");
      applyCoupon({ code: data.code, type: data.type, value: data.value });
      toast.success(`Cupom "${data.code}" aplicado!`);
      setCouponCode("");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Seu carrinho está vazio</h1>
        <p className="text-zinc-400 mb-8">Adicione alguns produtos e volte aqui.</p>
        <Link href="/produtos" className="btn-primary">Explorar Produtos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-10">Carrinho ({totalQty})</h1>

      {totalQty >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-6 flex items-center gap-2"
        >
          🎉 Desconto de 10% aplicado automaticamente por 3+ itens!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                layout
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 border border-zinc-100 p-4"
              >
                <Link href={`/produto/${item.slug}`}>
                  <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-zinc-100 shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm uppercase tracking-wide">{item.name}</h3>
                  <div className="flex gap-3 mt-1">
                    {item.size && <span className="text-xs text-zinc-400">Tam: {item.size}</span>}
                    {item.color && <span className="text-xs text-zinc-400">Cor: {item.color}</span>}
                  </div>
                  <p className="font-bold mt-2">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-zinc-200">
                      <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="px-3 py-1 hover:bg-zinc-100 text-lg">−</button>
                      <span className="px-4 py-1 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="px-3 py-1 hover:bg-zinc-100 text-lg">+</button>
                    </div>
                    <button
                      onClick={() => { removeItem(item.id, item.size, item.color); toast.success("Item removido"); }}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-sm shrink-0">{formatCurrency(item.price * item.quantity)}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-zinc-50 p-6 h-fit space-y-4">
          <h2 className="font-black uppercase tracking-tight text-lg">Resumo</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-{formatCurrency(getDiscount())}</span>
              </div>
            )}
            <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatCurrency(getTotal())}</span>
            </div>
          </div>

          {/* Coupon */}
          <div>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-green-700"><Tag size={14} />{coupon.code}</span>
                <button onClick={removeCoupon} className="text-red-500 text-xs hover:underline">Remover</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                  className="input-field flex-1 py-2 text-xs"
                />
                <button onClick={handleCoupon} disabled={couponLoading} className="btn-secondary py-2 px-4 text-xs">
                  {couponLoading ? "..." : "Aplicar"}
                </button>
              </div>
            )}
          </div>

          <Link href="/checkout" className="btn-primary w-full text-center">
            Finalizar Compra
          </Link>
          <Link href="/produtos" className="btn-ghost w-full text-center text-xs">
            ← Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

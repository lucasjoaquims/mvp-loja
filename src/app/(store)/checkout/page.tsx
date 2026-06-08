"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, formatCPF, formatCEP, formatPhone, fetchCEP } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, CreditCard, QrCode, FileText } from "lucide-react";

const STEPS = ["Dados Pessoais", "Endereço", "Pagamento", "Confirmação"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getDiscount, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  const [form, setForm] = useState({
    name: "", email: "", cpf: "", phone: "",
    cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
    paymentMethod: "PIX" as "PIX" | "CREDIT_CARD" | "BOLETO",
    cardToken: "", installments: 1, paymentMethodId: "",
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleCEP = async (cep: string) => {
    update("cep", formatCEP(cep));
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) {
      try {
        const addr = await fetchCEP(clean);
        update("street", addr.street);
        update("district", addr.district);
        update("city", addr.city);
        update("state", addr.state);
      } catch {
        toast.error("CEP não encontrado");
      }
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, items, total: getTotal(), discount: getDiscount() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao criar pedido");
      setOrderId(data.orderId);

      // Process payment
      const payRes = await fetch(`/api/pagamentos/${form.paymentMethod.toLowerCase().replace("_", "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId, form }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error ?? "Erro no pagamento");
      setPaymentData(payData);
      clearCart();
      setStep(3);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-zinc-400 mb-4">Seu carrinho está vazio.</p>
        <button onClick={() => router.push("/produtos")} className="btn-primary">Voltar às compras</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < step ? "bg-green-500 text-white" : i === step ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-400"
            }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs uppercase tracking-wider ${i === step ? "text-zinc-900 font-semibold" : "text-zinc-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-zinc-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 0 - Personal data */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Dados Pessoais</h2>
                <div>
                  <label className="label">Nome completo</label>
                  <input className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input-field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="seu@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">CPF</label>
                    <input className="input-field" value={form.cpf} onChange={(e) => update("cpf", formatCPF(e.target.value))} placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="label">Telefone</label>
                    <input className="input-field" value={form.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!form.name || !form.email || !form.cpf || !form.phone) { toast.error("Preencha todos os campos"); return; }
                    setStep(1);
                  }}
                  className="btn-primary w-full mt-4"
                >
                  Continuar →
                </button>
              </motion.div>
            )}

            {/* Step 1 - Address */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Endereço de Entrega</h2>
                <div>
                  <label className="label">CEP</label>
                  <input className="input-field" value={form.cep} onChange={(e) => handleCEP(e.target.value)} placeholder="00000-000" />
                </div>
                <div>
                  <label className="label">Rua</label>
                  <input className="input-field" value={form.street} onChange={(e) => update("street", e.target.value)} placeholder="Nome da rua" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Número</label>
                    <input className="input-field" value={form.number} onChange={(e) => update("number", e.target.value)} placeholder="123" />
                  </div>
                  <div>
                    <label className="label">Complemento</label>
                    <input className="input-field" value={form.complement} onChange={(e) => update("complement", e.target.value)} placeholder="Apto, bloco..." />
                  </div>
                </div>
                <div>
                  <label className="label">Bairro</label>
                  <input className="input-field" value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="Bairro" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Cidade</label>
                    <input className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Cidade" />
                  </div>
                  <div>
                    <label className="label">Estado (UF)</label>
                    <input className="input-field" value={form.state} onChange={(e) => update("state", e.target.value.toUpperCase().slice(0, 2))} placeholder="SP" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Voltar</button>
                  <button
                    onClick={() => {
                      if (!form.cep || !form.street || !form.number || !form.city || !form.state) { toast.error("Preencha todos os campos"); return; }
                      setStep(2);
                    }}
                    className="btn-primary flex-1"
                  >
                    Continuar →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Forma de Pagamento</h2>
                <div className="space-y-3">
                  {[
                    { value: "PIX", label: "PIX", desc: "Aprovação imediata", icon: <QrCode size={20} /> },
                    { value: "CREDIT_CARD", label: "Cartão de Crédito", desc: "Em até 12x sem juros", icon: <CreditCard size={20} /> },
                    { value: "BOLETO", label: "Boleto Bancário", desc: "Vencimento em 3 dias úteis", icon: <FileText size={20} /> },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => update("paymentMethod", method.value)}
                      className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-colors ${
                        form.paymentMethod === method.value ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className={`p-2 ${form.paymentMethod === method.value ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                        {method.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-zinc-400">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {form.paymentMethod === "CREDIT_CARD" && (
                  <div className="bg-zinc-50 p-4 border border-zinc-200">
                    <p className="text-xs text-zinc-500 mb-3">Os dados do cartão são processados com segurança pelo Mercado Pago.</p>
                    <div id="cardForm" className="space-y-3">
                      <div>
                        <label className="label">Número do cartão</label>
                        <input className="input-field" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label">Validade</label>
                          <input className="input-field" placeholder="MM/AA" />
                        </div>
                        <div>
                          <label className="label">CVV</label>
                          <input className="input-field" placeholder="000" />
                        </div>
                      </div>
                      <div>
                        <label className="label">Nome no cartão</label>
                        <input className="input-field" placeholder="Como aparece no cartão" />
                      </div>
                      <div>
                        <label className="label">Parcelamento</label>
                        <select className="input-field" value={form.installments} onChange={(e) => update("installments", parseInt(e.target.value))}>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                            <option key={n} value={n}>{n}x de {formatCurrency(getTotal() / n)}{n === 1 ? " (sem juros)" : ""}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Voltar</button>
                  <button onClick={handleSubmitOrder} disabled={loading} className="btn-primary flex-1">
                    {loading ? "Processando..." : `Pagar ${formatCurrency(getTotal())}`}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Confirmation */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check size={36} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Pedido Confirmado!</h2>
                <p className="text-zinc-500 mb-2">Pedido #{orderId.slice(0, 8).toUpperCase()}</p>

                {paymentData?.pixQrCode && (
                  <div className="bg-zinc-50 border border-zinc-200 p-6 mt-6 max-w-sm mx-auto">
                    <p className="text-sm font-semibold mb-4 uppercase tracking-wide">Pague via PIX</p>
                    {paymentData.pixQrCodeBase64 && (
                      <img src={`data:image/png;base64,${paymentData.pixQrCodeBase64}`} alt="QR Code PIX" className="mx-auto w-48 h-48 mb-4" />
                    )}
                    <div className="bg-white border border-zinc-200 p-3 rounded">
                      <p className="text-xs text-zinc-400 mb-1">Copia e Cola</p>
                      <p className="text-xs break-all font-mono">{paymentData.pixQrCode}</p>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(paymentData.pixQrCode); toast.success("Copiado!"); }}
                      className="btn-secondary w-full mt-3 text-xs"
                    >
                      Copiar Código
                    </button>
                    <p className="text-xs text-zinc-400 mt-2">Expira em 30 minutos</p>
                  </div>
                )}

                {paymentData?.boletoUrl && (
                  <div className="bg-zinc-50 border border-zinc-200 p-6 mt-6 max-w-sm mx-auto">
                    <p className="text-sm font-semibold mb-4 uppercase tracking-wide">Boleto Bancário</p>
                    <p className="text-xs text-zinc-400 mb-4">Vencimento em 3 dias úteis</p>
                    <a href={paymentData.boletoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                      Imprimir Boleto
                    </a>
                  </div>
                )}

                {form.paymentMethod === "CREDIT_CARD" && paymentData && (
                  <div className="bg-green-50 border border-green-200 p-6 mt-6 max-w-sm mx-auto">
                    <p className="text-sm font-semibold text-green-700">Pagamento aprovado! ✓</p>
                  </div>
                )}

                <div className="mt-8 flex gap-3 justify-center">
                  <button onClick={() => router.push("/conta")} className="btn-secondary">Meus Pedidos</button>
                  <button onClick={() => router.push("/produtos")} className="btn-primary">Continuar Comprando</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        {step < 3 && (
          <div className="bg-zinc-50 p-6 h-fit space-y-4">
            <h3 className="font-black uppercase tracking-tight">Resumo</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-zinc-200 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400">{item.size} · Qtd: {item.quantity}</p>
                    <p className="text-xs font-bold mt-1">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>{formatCurrency(getSubtotal())}</span></div>
              {getDiscount() > 0 && <div className="flex justify-between text-green-600"><span>Desconto</span><span>-{formatCurrency(getDiscount())}</span></div>}
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(getTotal())}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

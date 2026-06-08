"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Senhas não coincidem"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await signIn("credentials", { email: form.email, password: form.password, callbackUrl: "/" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-10 shadow-sm">
        <Link href="/" className="font-black text-xl uppercase tracking-tight block mb-10 text-center">Loja MVP</Link>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-8 text-center">Criar Conta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome completo</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Seu nome" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="seu@email.com" />
          </div>
          <div>
            <label className="label">Senha</label>
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Mínimo 8 caracteres" />
          </div>
          <div>
            <label className="label">Confirmar senha</label>
            <input className="input-field" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required placeholder="Repita a senha" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Criando..." : "Criar Conta"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-zinc-900 font-semibold hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}

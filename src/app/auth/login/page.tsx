"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Email ou senha incorretos");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 shadow-sm"
      >
        <Link href="/" className="font-black text-xl uppercase tracking-tight block mb-10 text-center">
          Loja MVP
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-8 text-center">Entrar</h1>

        <button
          onClick={handleGoogle}
          className="btn-secondary w-full mb-6 flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26a5.4 5.4 0 0 1-8.06-2.85H.96v2.34A8.99 8.99 0 0 0 9 18Z" fill="#34A853"/><path d="M4 10.71a5.4 5.4 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1L4 10.71Z" fill="#FBBC05"/><path d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 8.99 8.99 0 0 0 .96 4.95L4 7.29A5.36 5.36 0 0 1 9 3.58Z" fill="#EA4335"/></svg>
          Entrar com Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
          </div>
          <div>
            <label className="label">Senha</label>
            <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Não tem conta?{" "}
          <Link href="/auth/register" className="text-zinc-900 font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Inscrição realizada! Bem-vindo(a) 🎉");
    setEmail("");
    setLoading(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-zinc-100 py-20 px-6 text-center"
    >
      <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Newsletter</p>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Fique por dentro</h2>
      <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm">
        Receba em primeira mão nossos lançamentos, promoções exclusivas e dicas de estilo.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="input-field flex-1"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? "..." : "Inscrever"}
        </button>
      </form>
    </motion.section>
  );
}

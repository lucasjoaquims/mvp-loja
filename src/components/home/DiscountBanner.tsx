"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DiscountBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-zinc-900 text-white py-14 px-6 text-center my-10"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Oferta Especial</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
          Compre 3, ganhe{" "}
          <span className="text-yellow-400">10% OFF</span>
        </h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Adicione 3 ou mais itens ao carrinho e o desconto é aplicado automaticamente.
        </p>
        <Link href="/produtos" className="btn-primary bg-white text-zinc-900 hover:bg-zinc-100">
          Aproveitar Agora
        </Link>
      </motion.div>
    </motion.section>
  );
}

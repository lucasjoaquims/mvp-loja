"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { name: "Camisetas", slug: "camisetas", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Calças", slug: "calcas", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
  { name: "Tênis", slug: "tenis", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name: "Acessórios", slug: "acessorios", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { name: "Moletons", slug: "moletons", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
  { name: "Vestidos", slug: "vestidos", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
];

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Explorar</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Categorias</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
          >
            <Link
              href={`/produtos?categoria=${cat.slug}`}
              className="group block relative overflow-hidden aspect-[3/4] bg-zinc-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

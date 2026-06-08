"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Ana Paula", text: "Qualidade incrível! As peças chegaram antes do prazo e são exatamente como nas fotos. Já é minha loja favorita.", rating: 5, location: "São Paulo, SP" },
  { name: "Carlos Mendes", text: "Atendimento excepcional e produtos de alta qualidade. O tênis que comprei é perfeito para o dia a dia.", rating: 5, location: "Rio de Janeiro, RJ" },
  { name: "Fernanda Lima", text: "Comprei o vestido midi e recebi vários elogios. O caimento é perfeito e o tecido é de primeira linha.", rating: 5, location: "Belo Horizonte, MG" },
];

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Clientes</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">O que dizem sobre nós</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-50 p-8"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-zinc-400">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { prisma } from "@/lib/prisma";
import ProdutoCard from "@/components/produto/ProdutoCard";
import Link from "next/link";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { category: true },
    take: 8,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Seleção</p>
          <h2 className="text-3xl font-black uppercase tracking-tight">Destaques</h2>
        </div>
        <Link href="/produtos" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <ProdutoCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

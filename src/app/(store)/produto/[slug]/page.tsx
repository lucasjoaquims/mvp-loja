import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProdutoDetail from "@/components/produto/ProdutoDetail";
import ProdutoCard from "@/components/produto/ProdutoCard";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, NOT: { id: product.id } },
    take: 4,
  });

  return (
    <div>
      <ProdutoDetail product={product} />
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl font-black uppercase tracking-tight mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => <ProdutoCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

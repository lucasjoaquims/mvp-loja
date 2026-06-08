import { prisma } from "@/lib/prisma";
import ProdutoCard from "@/components/produto/ProdutoCard";
import ProdutosFilters from "@/components/produto/ProdutosFilters";

interface Props {
  searchParams: {
    categoria?: string;
    busca?: string;
    ordem?: string;
    promo?: string;
  };
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, busca, ordem, promo } = searchParams;

  const where: any = { active: true };
  if (categoria) {
    const cat = await prisma.category.findUnique({ where: { slug: categoria } });
    if (cat) where.categoryId = cat.id;
  }
  if (busca) where.name = { contains: busca, mode: "insensitive" };
  if (promo === "true") where.comparePrice = { not: null };

  let orderBy: any = { createdAt: "desc" };
  if (ordem === "preco-asc") orderBy = { price: "asc" };
  if (ordem === "preco-desc") orderBy = { price: "desc" };
  if (ordem === "destaque") orderBy = { featured: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy, include: { category: true } }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          {categoria
            ? categories.find((c) => c.slug === categoria)?.name ?? "Produtos"
            : busca
            ? `Busca: "${busca}"`
            : "Todos os Produtos"}
        </h1>
        <p className="text-zinc-400 text-sm mt-1">{products.length} produto{products.length !== 1 ? "s" : ""}</p>
      </div>

      <ProdutosFilters categories={categories} currentCategoria={categoria} currentOrdem={ordem} />

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {products.map((p, i) => (
            <ProdutoCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProdutoCard from "@/components/produto/ProdutoCard";
import Link from "next/link";
import { Heart } from "lucide-react";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-10">Favoritos ({wishlist.length})</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="mx-auto text-zinc-200 mb-6" />
          <p className="text-zinc-400 mb-4">Você não tem favoritos ainda.</p>
          <Link href="/produtos" className="btn-primary">Explorar Produtos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item, i) => (
            <ProdutoCard key={item.id} product={item.product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

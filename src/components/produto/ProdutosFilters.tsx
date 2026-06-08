"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: { id: string; name: string; slug: string }[];
  currentCategoria?: string;
  currentOrdem?: string;
}

export default function ProdutosFilters({ categories, currentCategoria, currentOrdem }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/produtos?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => update("categoria", undefined)}
          className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            !currentCategoria ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => update("categoria", cat.slug)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
              currentCategoria === cat.slug ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="ml-auto">
        <select
          value={currentOrdem ?? ""}
          onChange={(e) => update("ordem", e.target.value || undefined)}
          className="input-field py-2 text-xs uppercase tracking-wide"
        >
          <option value="">Mais recentes</option>
          <option value="preco-asc">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
          <option value="destaque">Destaques</option>
        </select>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { formatCurrency } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  featured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  categoryId: string;
  description?: string | null;
  category?: { name: string };
}

interface Props {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
}

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "", comparePrice: "",
  images: "", sizes: "", colors: "", stock: "", featured: false, categoryId: "",
};

export default function AdminProdutosClient({ products, categories }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? "" });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: String(p.price),
      comparePrice: p.comparePrice ? String(p.comparePrice) : "",
      images: p.images.join(", "),
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      stock: String(p.stock),
      featured: p.featured,
      categoryId: p.categoryId,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        stock: parseInt(form.stock),
        featured: form.featured,
        categoryId: form.categoryId,
        active: true,
      };

      const url = editing ? `/api/produtos/${editing.id}` : "/api/produtos";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Erro ao salvar produto");

      toast.success(editing ? "Produto atualizado!" : "Produto criado!");
      setShowModal(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja desativar este produto?")) return;
    try {
      await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      toast.success("Produto desativado");
      router.refresh();
    } catch {
      toast.error("Erro ao desativar produto");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Produtos</h1>
          <p className="text-zinc-400 text-sm mt-1">{products.length} produto(s) ativo(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <div className="bg-white border border-zinc-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              {["Produto", "Categoria", "Preço", "Estoque", "Destaque", "Ações"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-widest text-zinc-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover bg-zinc-100 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-wide">{p.name}</p>
                      <p className="text-xs text-zinc-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-zinc-500">{p.category?.name}</td>
                <td className="py-3 px-4 font-bold">{formatCurrency(p.price)}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold ${p.stock <= 5 ? "text-red-600" : "text-zinc-600"}`}>{p.stock}</span>
                </td>
                <td className="py-3 px-4">
                  {p.featured ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-zinc-300" />}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-zinc-400">Nenhum produto cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black uppercase tracking-tight">{editing ? "Editar" : "Novo"} Produto</h2>
                  <button onClick={() => setShowModal(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Nome", key: "name", placeholder: "Nome do produto" },
                    { label: "Slug", key: "slug", placeholder: "nome-do-produto" },
                    { label: "Descrição", key: "description", placeholder: "Descrição..." },
                    { label: "Preço (R$)", key: "price", placeholder: "99.90", type: "number" },
                    { label: "Preço Original (R$)", key: "comparePrice", placeholder: "149.90", type: "number" },
                    { label: "Estoque", key: "stock", placeholder: "0", type: "number" },
                    { label: "Imagens (URLs separadas por vírgula)", key: "images", placeholder: "https://..." },
                    { label: "Tamanhos (separados por vírgula)", key: "sizes", placeholder: "P, M, G, GG" },
                    { label: "Cores (separadas por vírgula)", key: "colors", placeholder: "Preto, Branco" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="label">{field.label}</label>
                      <input
                        className="input-field"
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="label">Categoria</label>
                    <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-medium">Produto em destaque</span>
                  </label>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                    <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                      {loading ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

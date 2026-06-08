"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getDiscountPercent } from "@/utils";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
  };
  index?: number;
}

export default function ProdutoCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0],
      color: product.colors[0],
    });
    toast.success("Adicionado ao carrinho!");
  };

  const discountPercent =
    product.comparePrice ? getDiscountPercent(product.price, product.comparePrice) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <Link href={`/produto/${product.slug}`} className="group block">
        <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {discountPercent && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1">
              -{discountPercent}%
            </span>
          )}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-zinc-900 text-white text-xs uppercase tracking-widest py-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleQuickAdd}
          >
            <ShoppingBag size={14} />
            Adicionar
          </motion.button>
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
            <Heart size={14} />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

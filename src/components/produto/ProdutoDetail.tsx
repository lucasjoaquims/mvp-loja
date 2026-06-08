"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getDiscountPercent } from "@/utils";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    comparePrice?: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    category?: { name: string; slug: string } | null;
  };
}

export default function ProdutoDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const discountPercent = product.comparePrice
    ? getDiscountPercent(product.price, product.comparePrice)
    : null;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative overflow-hidden aspect-square bg-zinc-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1">
                -{discountPercent}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-zinc-900" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-zinc-400">{product.category.name}</p>
          )}
          <h1 className="text-3xl font-black uppercase tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-zinc-400 line-through">{formatCurrency(product.comparePrice)}</span>
            )}
          </div>

          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
            <span className="text-xs text-zinc-400 ml-1">(24 avaliações)</span>
          </div>

          {product.description && (
            <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <p className="label">Tamanho: <span className="text-zinc-900 font-semibold">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs border transition-colors font-medium ${
                      selectedSize === size ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 hover:border-zinc-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <p className="label">Cor: <span className="text-zinc-900 font-semibold">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap mt-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs border transition-colors font-medium ${
                      selectedColor === color ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 hover:border-zinc-900"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="label">Quantidade</p>
            <div className="flex items-center border border-zinc-200 w-fit mt-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-zinc-100 transition-colors text-lg"
              >−</button>
              <span className="px-6 py-3 text-sm font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-3 hover:bg-zinc-100 transition-colors text-lg"
              >+</button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary flex-1 gap-2" disabled={product.stock === 0}>
              <ShoppingBag size={16} />
              {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
            </button>
            <button className="btn-secondary p-3">
              <Heart size={18} />
            </button>
          </div>

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
              Últimas {product.stock} unidades!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

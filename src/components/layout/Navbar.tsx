"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/produtos", label: "Todos" },
    { href: "/produtos?categoria=camisetas", label: "Camisetas" },
    { href: "/produtos?categoria=calcas", label: "Calças" },
    { href: "/produtos?categoria=tenis", label: "Tênis" },
    { href: "/produtos?categoria=acessorios", label: "Acessórios" },
    { href: "/produtos?categoria=moletons", label: "Moletons" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md backdrop-blur-sm bg-white/95" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-black text-xl tracking-tight uppercase">
              Loja MVP
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-zinc-100 transition-colors"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
              <Link href="/favoritos" className="p-2 hover:bg-zinc-100 transition-colors hidden sm:block">
                <Heart size={18} />
              </Link>
              <Link href="/conta" className="p-2 hover:bg-zinc-100 transition-colors hidden sm:block">
                <User size={18} />
              </Link>
              <Link href="/carrinho" className="p-2 hover:bg-zinc-100 transition-colors relative">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-zinc-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 hover:bg-zinc-100 transition-colors md:hidden"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl p-6"
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                  <Search size={20} className="text-zinc-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/produtos?busca=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                    className="flex-1 text-lg outline-none placeholder:text-zinc-300"
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-zinc-100">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mt-3 ml-10">Pressione Enter para buscar</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-black text-lg uppercase">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors py-2 border-b border-zinc-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Link href="/conta" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-zinc-600 py-2">
                  <User size={16} /> Minha conta
                </Link>
                <Link href="/favoritos" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-zinc-600 py-2">
                  <Heart size={16} /> Favoritos
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

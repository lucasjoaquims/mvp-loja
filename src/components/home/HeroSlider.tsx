"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "Nova Coleção 2025",
    subtitle: "Descubra peças exclusivas com design premium",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
    link: "/produtos",
    cta: "Explorar Agora",
  },
  {
    title: "Até 40% OFF",
    subtitle: "Aproveite nossas promoções por tempo limitado",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
    link: "/produtos?promo=true",
    cta: "Ver Promoções",
  },
  {
    title: "Edição Limitada",
    subtitle: "Peças únicas para quem busca o extraordinário",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80",
    link: "/produtos",
    cta: "Comprar Agora",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + banners.length) % banners.length); };
  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % banners.length); };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-zinc-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 60 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d * -60 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p className="text-xs uppercase tracking-widest text-white/70 mb-3 font-medium">
                  Coleção Exclusiva
                </p>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
                  {banners[current].title}
                </h1>
                <p className="text-lg text-white/80 mb-8 max-w-md">
                  {banners[current].subtitle}
                </p>
                <Link
                  href={banners[current].link}
                  className="btn-primary bg-white text-zinc-900 hover:bg-zinc-100"
                >
                  {banners[current].cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-0.5 transition-all duration-300 ${i === current ? "bg-white w-8" : "bg-white/40 w-4"}`}
          />
        ))}
      </div>
    </section>
  );
}

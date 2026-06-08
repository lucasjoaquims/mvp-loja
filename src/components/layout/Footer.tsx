import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="font-black text-xl uppercase tracking-tight mb-4">Loja MVP</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Design premium para pessoas que valorizam qualidade e estilo. Cada peça é cuidadosamente selecionada para oferecer o melhor.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Loja</h4>
            <ul className="space-y-2">
              {["Todos os produtos", "Novidades", "Promoções", "Mais vendidos"].map((item) => (
                <li key={item}>
                  <Link href="/produtos" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Ajuda</h4>
            <ul className="space-y-2">
              {["Minha conta", "Pedidos", "Trocas e devoluções", "Fale conosco"].map((item) => (
                <li key={item}>
                  <Link href="/conta" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">© 2025 Loja MVP. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50" />
            <span className="text-zinc-500 text-xs uppercase tracking-wide">PIX</span>
            <span className="text-zinc-500 text-xs uppercase tracking-wide">Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

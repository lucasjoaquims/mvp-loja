import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="font-black text-sm uppercase tracking-widest text-white/70 hover:text-white">
            ← Loja MVP
          </Link>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Admin</p>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:text-white transition-colors">
            <LogOut size={16} /> Sair
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
